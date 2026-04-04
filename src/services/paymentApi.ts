import { TResponse } from '../types/commonTypes';
import { baseApi } from './baseApi';
export interface IPayment {
  _id: string;
  userId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
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
    paymentSuccess: builder.mutation<TResponse<IPayment>, { tran_id: string; paymentFor?: string }>(
      {
        query: ({ tran_id, paymentFor }) => ({
          url: paymentFor === 'fee_amount' ? '/tax-orders/payment/success' : '/payments/success',
          method: 'POST',
          data: { tran_id },
        }),
        invalidatesTags: ['payments'],
      }
    ),
    getMyPayments: builder.query<TResponse<IPayment[]>, void>({
      query: () => ({
        url: '/payments/user-payment',
        method: 'GET',
      }),
      providesTags: ['payments'],
    }),
  }),
});

export const { useCreatePaymentMutation, useGetMyPaymentsQuery, usePaymentSuccessMutation } =
  paymentApi;
