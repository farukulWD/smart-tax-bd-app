import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { instance, refreshInstance, isTokenExpired } from './axiosInstance';
import { logout, setToken } from '@/src/redux/slices/authSlice';
import { clearRefreshToken, getRefreshToken, saveRefreshToken } from '../auth/refreshTokenStore';

type Args = {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
};

const isAuthEndpoint = (url: string) => url.startsWith('/auth/') || url.startsWith('/users/verify');

type RefreshResult =
  { status: 'ok'; token: string } | { status: 'unauthorized' } | { status: 'network-error' };

let inFlightRefresh: Promise<RefreshResult> | null = null;

export const cancelInFlightRefresh = () => {
  inFlightRefresh = null;
};

const refreshAccessToken = (): Promise<RefreshResult> => {
  if (inFlightRefresh) return inFlightRefresh;

  inFlightRefresh = (async (): Promise<RefreshResult> => {
    try {
      const storedRefreshToken = await getRefreshToken();

      const response = await refreshInstance.post(
        '/auth/refresh-token',
        storedRefreshToken ? { refreshToken: storedRefreshToken } : {}
      );

      const accessToken: string | undefined = response?.data?.data?.accessToken;
      const rotatedRefreshToken: string | undefined = response?.data?.data?.refreshToken;

      if (!accessToken) return { status: 'unauthorized' };

      if (rotatedRefreshToken) {
        await saveRefreshToken(rotatedRefreshToken);
      }

      return { status: 'ok', token: accessToken };
    } catch (error) {
      const status = (error as AxiosError)?.response?.status;
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

    if (state?.network?.isOnline === false) {
      return {
        error: {
          status: 'FETCH_ERROR',
          data: { message: 'No internet connection. Please check your network and try again.' },
        },
      };
    }

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
      const current = api.getState() as any;
      if (!current?.auth?.token) return;
      api.dispatch(logout());
    };

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
  if (refreshed.status === 'network-error') return { token: accessToken, ended: false };

  await clearRefreshToken();
  return { token: null, ended: true };
};
