import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import env from '../env';

export const apiService = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: env.BASE_URL }),
  endpoints: () => ({}),
});
