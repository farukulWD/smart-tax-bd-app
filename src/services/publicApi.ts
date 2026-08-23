import {
  GetAllFaqsResponse,
  GetAllNewsResponse,
  GetAllTaxTypesResponse,
  GetSingleNewsResponse,
} from '../types/publicTypes';
import { baseApi, LONG_CACHE_SECONDS } from './baseApi';

const publicApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllNews: build.query<GetAllNewsResponse, void>({
      query: () => ({ url: '/update-news/get-all-news' }),
    }),
    getSingleNews: build.query<GetSingleNewsResponse, string>({
      query: (id) => ({ url: `/update-news/get-news/${id}` }),
    }),
    getAllTaxTypes: build.query<GetAllTaxTypesResponse, void>({
      query: () => ({ url: '/tax-types/get-all-tax-types' }),
      keepUnusedDataFor: LONG_CACHE_SECONDS,
    }),
    getAllFaqs: build.query<GetAllFaqsResponse, void>({
      query: () => ({ url: '/faqs' }),
      keepUnusedDataFor: LONG_CACHE_SECONDS,
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllNewsQuery,
  useGetSingleNewsQuery,
  useGetAllTaxTypesQuery,
  useGetAllFaqsQuery,
} = publicApi;
