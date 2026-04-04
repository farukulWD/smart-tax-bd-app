import { showToast } from '../utils/commonFunction';

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
    showToast({ message: typeError.data?.errorSources[0]?.message });
  } else {
    showToast({ message: 'An unknown error occurred' });
  }
};
