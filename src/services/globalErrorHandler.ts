import { toast } from '../utils/ToastConfig';

export interface TErrorSourse {
  path: string | number;
  message: string;
}

export interface TGenericErrorResponse {
  statusCode: number;
  success: boolean;
  message: string;
  errorSources: TErrorSourse[];
  stack?: string | null;
}

export const getApiErrorMessage = (error: unknown): string => {
  const err = error as any;
  if (!err) return '';

  const data = err?.data;
  if (typeof data === 'string') return data;

  return (
    data?.errorSources?.[0]?.message ||
    data?.message ||
    data?.error ||
    err?.error ||
    err?.message ||
    ''
  );
};

export const globalErrorHandler = (error: unknown) => {
  toast.error(getApiErrorMessage(error) || 'An unknown error occurred');
};
