import { GetAllNewsResponse, GetSingleNewsResponse } from '../types/publicTypes';
import { apiService } from './api';

const publicApi = apiService.injectEndpoints({
  endpoints: (build) => ({
    getAllNews: build.query<GetAllNewsResponse, void>({
      query: () => '/update-news/get-all-news',
    }),
    getSingleNews: build.query<GetSingleNewsResponse, string>({
      query: (id) => `/update-news/get-news/${id}`,
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllNewsQuery, useGetSingleNewsQuery } = publicApi;
