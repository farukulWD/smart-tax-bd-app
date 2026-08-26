import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { instance, refreshInstance, isTokenExpired } from './axiosInstance';
import { logout, setToken } from '@/src/redux/slices/authSlice';
import {
  clearRefreshToken,
  getRefreshToken,
  saveRefreshToken,
} from '../auth/refreshTokenStore';

type Args = {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
};

// Auth endpoints must never trigger the session-expiry logout, otherwise a wrong
// password on the login screen would look like an expired session.
const isAuthEndpoint = (url: string) => url.startsWith('/auth/') || url.startsWith('/users/verify');

// A refresh can fail two very different ways, and treating them alike is what
// used to sign people out for going through a tunnel: only the server actually
// rejecting the refresh token ends the session, a failure to reach the server
// leaves it untouched.
type RefreshResult =
  | { status: 'ok'; token: string }
  | { status: 'unauthorized' }
  | { status: 'network-error' };

// Queries run in parallel, so several of them can discover the same expired
// token at once. Without this single-flight guard each one posts its own
// refresh, and every response but the last is a wasted round trip whose token
// is immediately overwritten.
let inFlightRefresh: Promise<RefreshResult> | null = null;

// A refresh started just before logout would otherwise resolve afterwards and
// hand a fresh token to the next request, so the guard is dropped on logout.
export const cancelInFlightRefresh = () => {
  inFlightRefresh = null;
};

const refreshAccessToken = (): Promise<RefreshResult> => {
  if (inFlightRefresh) return inFlightRefresh;

  inFlightRefresh = (async (): Promise<RefreshResult> => {
    try {
      // The token is sent in the body rather than relied upon as a cookie: a
      // React Native cookie jar does not survive restarts and OS updates
      // dependably enough to hold a session together.
      const storedRefreshToken = await getRefreshToken();

      const response = await refreshInstance.post(
        '/auth/refresh-token',
        storedRefreshToken ? { refreshToken: storedRefreshToken } : {}
      );

      const accessToken: string | undefined = response?.data?.data?.accessToken;
      const rotatedRefreshToken: string | undefined = response?.data?.data?.refreshToken;

      if (!accessToken) return { status: 'unauthorized' };

      // The server rotates the refresh token on every refresh, so the stored
      // copy must follow or the next refresh replays a superseded token.
      if (rotatedRefreshToken) {
        await saveRefreshToken(rotatedRefreshToken);
      }

      return { status: 'ok', token: accessToken };
    } catch (error) {
      const status = (error as AxiosError)?.response?.status;
      // No response at all means the request never reached the server.
      if (status === 401 || status === 403) return { status: 'unauthorized' };
      return { status: 'network-error' };
    } finally {
      inFlightRefresh = null;
    }
  })();

  return inFlightRefresh;
};

export const axiosBaseQuery =
  ({ baseUrl }: { baseUrl: string } = { baseUrl: '' }): BaseQueryFn<Args, unknown, unknown> =>
  async ({ url, method = 'GET', data, params, headers }, api) => {
    const state = api.getState() as any;
    let accessToken: string | null = state?.auth?.token ?? null;

    const send = (token: string | null) =>
      instance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          ...headers,
          ...(token ? { Authorization: token } : {}),
        },
      });

    const endSession = () => {
      // instead of leaving every screen stuck on a generic failure state.
      //
      // Dispatching it again once the session is already gone would reset the
      // API cache a second time and make every still-mounted query refetch, so
      // a stale 401 that lands late cannot restart the refresh/retry cycle.
      const current = api.getState() as any;
      if (!current?.auth?.token) return;
      api.dispatch(logout());
    };

    // jwtDecode throws on a malformed/truncated token, so treat that as expired.
    let expired = false;
    if (accessToken) {
      try {
        expired = isTokenExpired(accessToken);
      } catch {
        expired = true;
      }
    }

    if (accessToken && expired) {
      const refreshed = await refreshAccessToken();

      if (refreshed.status === 'ok') {
        accessToken = refreshed.token;
        api.dispatch(setToken(accessToken));
      } else if (!isAuthEndpoint(url)) {
        if (refreshed.status === 'unauthorized') {
          endSession();
          return {
            error: { status: 401, data: { message: 'Session expired. Please sign in again.' } },
          };
        }

        // Offline or the server is unreachable: report it as a failed request
        // and keep the session, so connectivity coming back is all it takes to
        // recover.
        return {
          error: {
            status: 'FETCH_ERROR',
            data: { message: 'Network error. Please check your connection and try again.' },
          },
        };
      }
    }

    try {
      const result = await send(accessToken);
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      const status = err.response?.status;

      if (status === 401 && !isAuthEndpoint(url)) {
        const refreshed = await refreshAccessToken();
        if (refreshed.status === 'ok') {
          api.dispatch(setToken(refreshed.token));
          try {
            const retry = await send(refreshed.token);
            return { data: retry.data };
          } catch (retryError) {
            const retryErr = retryError as AxiosError;
            if (retryErr.response?.status === 401) endSession();
            return {
              error: {
                status: retryErr.response?.status,
                data: retryErr.response?.data || retryErr.message,
              },
            };
          }
        }

        if (refreshed.status === 'unauthorized') endSession();
      }

      return {
        error: {
          status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

/**
 * Refreshes the session outside of a request, for the app's cold start.
 *
 * Returns true when the session is still good — either the stored access token
 * has life left in it, or the refresh succeeded.
 */
export const restoreSession = async (
  accessToken: string | null
): Promise<{ token: string | null; ended: boolean }> => {
  if (!accessToken) return { token: null, ended: false };

  let expired = false;
  try {
    expired = isTokenExpired(accessToken);
  } catch {
    expired = true;
  }

  if (!expired) return { token: accessToken, ended: false };

  const refreshed = await refreshAccessToken();

  if (refreshed.status === 'ok') return { token: refreshed.token, ended: false };
  // A network failure at launch is not a reason to sign anyone out; the next
  // request will try again.
  if (refreshed.status === 'network-error') return { token: accessToken, ended: false };

  await clearRefreshToken();
  return { token: null, ended: true };
};
