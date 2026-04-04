import { TResponse } from '../types/commonTypes';
import { TaxType } from '../types/publicTypes';
import { baseApi } from './baseApi';

export enum IncomeSource {
  GovtJob = 'Income from Govt.Job',
  PrivateJob = 'Income from Private Job',
  Business = 'Income from Business',
  Rent = 'Income from Rent',
  Agriculture = 'Income from Agriculture',
  FinancialAsset = 'Income from Financial Asset',
  CapitalGain = 'Income from Capital Gain',
  OthersSource = 'Income from others Source',
  ForignRemitance = 'Income from Forign Remitance',
}

export interface IPersonalInformation {
  name: string;
  email: string;
  phone: string;
  are_you_student: boolean;
  are_you_house_wife: boolean;
}

export interface IOrder {
  _id?: string;
  userId?: string;
  is_self: boolean;
  for_other_person: boolean;
  personal_iformation: IPersonalInformation;
  status: string;
  current_step: 1 | 2 | 3;
  are_you_get_notice_from_tax_office: boolean;
  income_from_partnership_firm: boolean;
  income_from_ldt_company: boolean;
  source_of_income: IncomeSource[];
  tax_year: string;
  documents?: string[];
  tax_payable_amount: number;
  is_tax_payable_amount_paid: boolean;
  tax_paid_amount: number;
  fee_amount: number;
  is_fee_amount_paid: boolean;
  fee_due_amount: number;
  is_fee_due_amount_paid: boolean;
  tax_paid_date?: string;
  createdAt?: string;
}

export interface ICreateTaxStepOnePayload {
  personal_iformation: IPersonalInformation;
  tax_year: string;
  source_of_income: IncomeSource[];
  income_from_ldt_company?: boolean;
  income_from_partnership_firm?: boolean;
  are_you_get_notice_from_tax_office?: boolean;
  for_other_person?: boolean;
  is_self?: boolean;
}

export interface ITaxStepOneResponse {
  tax_order: IOrder;
  required_documents: string[];
}

export interface ITaxStepThreeResponse {
  tax_order: IOrder;
  payable_amount: number;
  gatewayPageURL: string;
  transaction_id: string;
}

const orderApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getTaxOrderById: builder.query<TResponse<ITaxStepOneResponse>, string>({
      query: (taxId) => ({
        url: `/tax-orders/${taxId}`,
        method: 'GET',
      }),
      providesTags: ['orders'],
    }),
    getTaxTypes: builder.query<TResponse<TaxType[]>, undefined>({
      query: () => ({
        url: '/tax-types/get-all-tax-types',
        method: 'GET',
      }),
    }),
    createTaxStepOne: builder.mutation<TResponse<ITaxStepOneResponse>, ICreateTaxStepOnePayload>({
      query: (data) => ({
        url: '/tax-orders/step-1',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['orders'],
    }),
    updateTaxStepOne: builder.mutation<
      TResponse<ITaxStepOneResponse>,
      { taxId: string; data: ICreateTaxStepOnePayload }
    >({
      query: ({ taxId, data }) => ({
        url: `/tax-orders/${taxId}/step-1`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['orders'],
    }),
    uploadTaxStepTwoDocuments: builder.mutation<
      TResponse<IOrder>,
      { taxId: string; documentIds: string[] }
    >({
      query: ({ taxId, documentIds }) => ({
        url: `/tax-orders/${taxId}/step-2`,
        method: 'PATCH',
        data: { documents: documentIds },
      }),
      invalidatesTags: ['orders'],
    }),
    initTaxStepThreePayment: builder.mutation<TResponse<ITaxStepThreeResponse>, string>({
      query: (taxId) => ({
        url: `/tax-orders/${taxId}/step-3`,
        method: 'POST',
      }),
      invalidatesTags: ['orders'],
    }),
    getMyOrders: builder.query<TResponse<IOrder[]>, undefined>({
      query: () => ({
        url: '/tax-orders/my-orders',
        method: 'GET',
      }),
      providesTags: ['orders'],
    }),
  }),
});

export const {
  useGetTaxOrderByIdQuery,
  useGetTaxTypesQuery,
  useCreateTaxStepOneMutation,
  useUpdateTaxStepOneMutation,
  useUploadTaxStepTwoDocumentsMutation,
  useInitTaxStepThreePaymentMutation,
  useGetMyOrdersQuery,
} = orderApi;
