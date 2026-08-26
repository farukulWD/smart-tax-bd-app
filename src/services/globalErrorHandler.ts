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

export const globalErrorHandler = (error: unknown) => {
  // Not every failure carries `errorSources`: rate-limit rejections and other
  // middleware answer before the API's error handler shapes the body, and a
  // dropped connection has no body at all. Reading only `errorSources` turned
  // all of those into "An unknown error occurred", hiding messages the user
  // needed to act on.
  toast.error(getApiErrorMessage(error) || 'An unknown error occurred');
};
