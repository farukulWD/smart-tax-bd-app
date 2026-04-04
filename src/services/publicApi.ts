import {
  GetAllNewsResponse,
  GetAllTaxTypesResponse,
  GetSingleNewsResponse,
} from '../types/publicTypes';
import { baseApi } from './baseApi';

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
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllNewsQuery, useGetSingleNewsQuery, useGetAllTaxTypesQuery } = publicApi;
