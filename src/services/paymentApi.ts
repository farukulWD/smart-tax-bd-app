import { TResponse } from '../types/commonTypes';
import { baseApi } from './baseApi';
export interface IPayment {
  _id: string;
  userId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transaction_id?: string;
  paymentMethod?: string;
  gatewayPageURL?: string;
  paymentFor: string;
  createdAt: string;
  updatedAt: string;
}

const paymentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createPayment: builder.mutation<TResponse<IPayment>, any>({
      query: (data) => ({
        url: '/payments/initialize',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['payments'],
    }),
    // The server asks EPS for the real outcome; it fails unless EPS confirms
    // the payment, whatever URL the gateway redirected to.
    paymentSuccess: builder.mutation<TResponse<IPayment>, { tran_id: string }>({
      query: ({ tran_id }) => ({
        url: '/payments/success',
        method: 'POST',
        data: { tran_id },
      }),
      invalidatesTags: ['payments', 'orders'],
    }),
    paymentClosed: builder.mutation<
      TResponse<IPayment>,
      { tran_id: string; status: 'fail' | 'cancel' }
    >({
      query: ({ tran_id, status }) => ({
        url: `/payments/${status}`,
        method: 'POST',
        data: { tran_id },
      }),
      invalidatesTags: ['payments', 'orders'],
    }),
    getMyPayments: builder.query<TResponse<IPayment[]>, void>({
      query: () => ({
        url: '/payments/user-payment',
        method: 'GET',
      }),
      providesTags: ['payments'],
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useGetMyPaymentsQuery,
  usePaymentSuccessMutation,
  usePaymentClosedMutation,
} = paymentApi;
