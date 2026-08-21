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

export const globalErrorHandler = (error: unknown) => {
  const typeError = error as { data: TGenericErrorResponse };

  if (typeError?.data?.errorSources?.length > 0) {
    toast.error(typeError.data?.errorSources[0]?.message);
  } else {
    toast.error('An unknown error occurred');
  }
};

/**
 * Pulls a human-readable message out of an RTK Query / axiosBaseQuery error.
 * Returns '' when nothing useful is available so callers can fall back to their
 * own copy instead of showing "[object Object]".
 */
export const getApiErrorMessage = (error: unknown): string => {
  const err = error as any;
  if (!err) return '';

  const data = err?.data;
  if (typeof data === 'string') return data;

  return (
    data?.errorSources?.[0]?.message || data?.message || data?.error || err?.error || err?.message || ''
  );
};
