import { createApi } from '@reduxjs/toolkit/query/react';
import env from '../../env';
import { axiosBaseQuery } from './axios/axiosBaseQuery';

// Reference content (tax types, FAQs, blogs) changes a handful of times a year.
// RTK Query's default drops a cache entry 60s after its last subscriber
// unmounts, so a tab switch was enough to make the next visit refetch and show
// a full-screen loading state again. Endpoints serving that content opt into
// this instead.
export const LONG_CACHE_SECONDS = 60 * 60 * 24;

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: axiosBaseQuery({ baseUrl: env.BASE_URL }),
  endpoints: () => ({}),
  tagTypes: ['files', 'orders', 'payments', 'news', 'notifications', 'blogs', 'user'],
});
