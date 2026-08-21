import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { instance, refreshInstance, isTokenExpired } from './axiosInstance';
import { logout, setToken } from '@/src/redux/slices/authSlice';

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

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await refreshInstance.post('/auth/refresh-token');
    return response?.data?.data?.accessToken ?? null;
  } catch {
    return null;
  }
};

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<Args, unknown, unknown> =>
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
      // Clears token AND isLoggedIn so ProtectedScreen sends the user to sign-in
      // instead of leaving every screen stuck on a generic failure state.
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
      accessToken = await refreshAccessToken();
      if (accessToken) {
        api.dispatch(setToken(accessToken));
      } else if (!isAuthEndpoint(url)) {
        endSession();
        return {
          error: { status: 401, data: { message: 'Session expired. Please sign in again.' } },
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
        const newToken = await refreshAccessToken();
        if (newToken) {
          api.dispatch(setToken(newToken));
          try {
            const retry = await send(newToken);
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
        endSession();
      }

      return {
        error: {
          status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
