import { GetAllBlogsArgs, GetAllBlogsResponse, GetSingleBlogResponse } from '../types/blogTypes';
import { baseApi, LONG_CACHE_SECONDS } from './baseApi';

export const BLOG_PAGE_SIZE = 10;

const blogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllBlogs: build.query<GetAllBlogsResponse, GetAllBlogsArgs>({
      query: ({ page, limit = BLOG_PAGE_SIZE }) => ({
        url: '/blogs',
        params: { page, limit },
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems) => {
        if (newItems.meta.page === 1) {
          return newItems;
        }
        currentCache.data.push(...newItems.data);
        currentCache.meta = newItems.meta;
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.page !== previousArg?.page,
      providesTags: ['blogs'],
      keepUnusedDataFor: LONG_CACHE_SECONDS,
    }),
    getSingleBlog: build.query<GetSingleBlogResponse, string>({
      query: (slug) => ({ url: `/blogs/${slug}` }),
      providesTags: ['blogs'],
      keepUnusedDataFor: LONG_CACHE_SECONDS,
    }),
  }),
  overrideExisting: true,
});

export const { useGetAllBlogsQuery, useGetSingleBlogQuery } = blogApi;
