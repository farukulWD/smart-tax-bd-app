import { apiService } from './api';

const authApi = apiService.injectEndpoints({
  endpoints: (build) => ({
    // getAllNews: build.query<any, void>({
    //   query: () => '/update-news/get-all-news',
    // }),
  }),
  overrideExisting: false,
});

export const {} = authApi;
