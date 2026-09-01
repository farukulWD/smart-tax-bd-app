import { createApi } from '@reduxjs/toolkit/query/react';
import { REHYDRATE } from 'redux-persist';
import env from '../../env';
import { axiosBaseQuery } from './axios/axiosBaseQuery';

export const LONG_CACHE_SECONDS = 60 * 60 * 24;

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: axiosBaseQuery({ baseUrl: env.BASE_URL }),
  refetchOnReconnect: true,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === REHYDRATE) {
      return (action as { payload?: Record<string, unknown> }).payload?.[reducerPath] as never;
    }
  },
  endpoints: () => ({}),
  tagTypes: ['files', 'orders', 'payments', 'news', 'notifications', 'blogs', 'user'],
});
