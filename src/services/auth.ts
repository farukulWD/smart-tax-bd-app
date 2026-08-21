import { RegisterFormValues } from '../screen/auth/SignUpScreen';
import { ILoginResponse, IUser } from '../types/authTypes';
import { TResponse } from '../types/commonTypes';
import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<
      TResponse<any>,
      Omit<RegisterFormValues, 'confirmPassword' | 'email'> & { email?: string }
    >({
      query: (data) => ({
        url: '/users/register',
        method: 'POST',
        data,
      }),
    }),
    verifyRegisterOtp: builder.mutation<TResponse<any>, { mobile: string; otp: string }>({
      query: (data) => ({
        url: '/users/verify-otp',
        method: 'POST',
        data,
      }),
    }),
    resendRegisterOtp: builder.mutation<TResponse<any>, { mobile: string }>({
      query: (data) => ({
        url: '/users/resend-otp',
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
    resetPassword: builder.mutation<TResponse<any>, { resetToken: string; newPassword: string }>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        data,
      }),
    }),
    forgotPassword: builder.mutation<TResponse<any>, { mobile: string }>({
      query: (data) => ({
        url: '/auth/forget-password',
        method: 'POST',
        data,
      }),
    }),
    verifyForgotOtp: builder.mutation<
      TResponse<{ resetToken: string }>,
      { mobile: string; otp: string }
    >({
      query: (data) => ({
        url: '/auth/verify-forgot-otp',
        method: 'POST',
        data,
      }),
    }),
    logout: builder.mutation<TResponse<any>, any>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['user'],
    }),
    getUserInfo: builder.query<TResponse<IUser>, void>({
      query: () => ({
        url: '/users/get-me',
      }),
      providesTags: ['user'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetUserInfoQuery,
  useForgotPasswordMutation,
  useLogoutMutation,
  useResetPasswordMutation,
  useVerifyForgotOtpMutation,
  useVerifyRegisterOtpMutation,
  useResendRegisterOtpMutation,
  useLazyGetUserInfoQuery,
} = authApi;
