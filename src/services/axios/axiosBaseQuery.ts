import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { instance, refreshInstance, isTokenExpired } from './axiosInstance';
import { removeToken, setToken } from '@/src/redux/slices/authSlice';

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method = 'GET', data, params, headers }, api) => {
    try {
      const state = api.getState() as any;
      let accessToken = state?.auth?.token;

      if (accessToken && isTokenExpired(accessToken)) {
        try {
          const response = await refreshInstance.post('/auth/refresh-token');
          accessToken = response?.data?.data?.accessToken;

          if (accessToken) {
            api.dispatch(setToken(accessToken));
          }
        } catch (e) {
          accessToken = null;
          api.dispatch(removeToken());
        }
      }

      const result = await instance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          ...headers,
          ...(accessToken ? { Authorization: accessToken } : {}),
        },
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
