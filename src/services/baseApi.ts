import { createApi } from '@reduxjs/toolkit/query/react';
import env from '../../env';
import { axiosBaseQuery } from './axios/axiosBaseQuery';

export const LONG_CACHE_SECONDS = 60 * 60 * 24;

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: axiosBaseQuery({ baseUrl: env.BASE_URL }),
  endpoints: () => ({}),
  tagTypes: ['files', 'orders', 'payments', 'news', 'notifications', 'blogs', 'user'],
});
