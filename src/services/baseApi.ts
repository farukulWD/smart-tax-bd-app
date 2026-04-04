import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import env from '../env';
import { axiosBaseQuery } from './axios/axiosBaseQuery';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: axiosBaseQuery({ baseUrl: env.BASE_URL }),
  endpoints: () => ({}),
  tagTypes: ['files', 'orders', 'payments', 'news'],
});
