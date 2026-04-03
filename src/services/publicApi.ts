import { GetAllNewsResponse } from '../types/publicTypes';
import { apiService } from './api';

const publicApi = apiService.injectEndpoints({
  endpoints: (build) => ({
    getAllNews: build.query<GetAllNewsResponse, void>({
      query: () => '/update-news/get-all-news',
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllNewsQuery } = publicApi;
