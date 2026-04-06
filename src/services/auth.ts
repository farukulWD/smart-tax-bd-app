import { RegisterFormValues } from '../screen/auth/SignUpScreen';
import { ILoginResponse } from '../types/authTypes';
import { TResponse } from '../types/commonTypes';
import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<TResponse<any>, Omit<RegisterFormValues, 'confirmPassword'>>({
      query: (data) => ({
        url: '/users/register',
        method: 'POST',
        data,
      }),
    }),
    login: builder.mutation<ILoginResponse, { mobile: string; password: string }>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        data,
      }),
    }),
    resetPassword: builder.mutation<TResponse<any>, any>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        data,
      }),
    }),
    forgotPassword: builder.mutation<TResponse<any>, any>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        data,
      }),
    }),
    logout: builder.mutation<TResponse<any>, any>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getUserInfo: builder.query<any, void>({
      query: () => ({
        url: '/users/get-me',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetUserInfoQuery,
  useForgotPasswordMutation,
  useLogoutMutation,
  useResetPasswordMutation,
  useLazyGetUserInfoQuery,
} = authApi;
