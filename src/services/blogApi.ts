import { GetAllBlogsArgs, GetAllBlogsResponse, GetSingleBlogResponse } from '../types/blogTypes';
import { baseApi } from './baseApi';

export const BLOG_PAGE_SIZE = 10;

const blogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllBlogs: build.query<GetAllBlogsResponse, GetAllBlogsArgs>({
      query: ({ page, limit = BLOG_PAGE_SIZE }) => ({
        url: '/blogs',
        params: { page, limit },
      }),
      // All pages share one cache entry so the list can accumulate.
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
    }),
    getSingleBlog: build.query<GetSingleBlogResponse, string>({
      query: (slug) => ({ url: `/blogs/${slug}` }),
      providesTags: ['blogs'],
    }),
  }),
  overrideExisting: true,
});

export const { useGetAllBlogsQuery, useGetSingleBlogQuery } = blogApi;
