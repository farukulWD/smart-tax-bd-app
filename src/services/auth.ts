import { ILoginResponse } from '../types/authTypes';
import { apiService } from './api';

export const authApi = apiService.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<ILoginResponse, { mobile: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    getUserFiles: build.query<any, void>({
      query: () => '/files/get-user-files',
    }),

    getUserInfo: build.query<any, void>({
      query: () => '/users/get-me',
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useGetUserFilesQuery, useGetUserInfoQuery } = authApi;
