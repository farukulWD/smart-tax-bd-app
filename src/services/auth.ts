import { ILoginResponse } from '../types/authTypes';
import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<ILoginResponse, { mobile: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    getUserFiles: build.query<any, void>({
      query: () => ({
        url: '/files/get-user-files',
      }),
    }),

    getUserInfo: build.query<any, void>({
      query: () => ({
        url: '/users/get-me',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useGetUserFilesQuery, useGetUserInfoQuery } = authApi;
