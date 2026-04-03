import {
  GetAllNewsResponse,
  GetAllTaxTypesResponse,
  GetSingleNewsResponse,
} from '../types/publicTypes';
import { apiService } from './api';

const publicApi = apiService.injectEndpoints({
  endpoints: (build) => ({
    getAllNews: build.query<GetAllNewsResponse, void>({
      query: () => '/update-news/get-all-news',
    }),
    getSingleNews: build.query<GetSingleNewsResponse, string>({
      query: (id) => `/update-news/get-news/${id}`,
    }),
    getAllTaxTypes: build.query<GetAllTaxTypesResponse, void>({
      query: () => '/tax-types/get-all-tax-types',
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllNewsQuery, useGetSingleNewsQuery, useGetAllTaxTypesQuery } = publicApi;
