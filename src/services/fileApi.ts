import { TResponse } from '../types/commonTypes';
import { IFile } from '../types/filesTypes';
import { baseApi } from './baseApi';

const fileApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    uploadFile: builder.mutation<TResponse<any>, any>({
      query: (data: any) => ({
        url: '/files/create-file',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['files'],
    }),
    getMyFiles: builder.query<TResponse<any>, undefined>({
      query: () => ({
        url: '/files/get-user-files',
        method: 'GET',
      }),
      providesTags: ['files'],
    }),
    getSingleFile: builder.query<TResponse<any>, string>({
      query: (id: string) => ({
        url: `/files/get-single-file/${id}`,
        method: 'GET',
      }),
      providesTags: ['files'],
    }),
    deleteFile: builder.mutation<TResponse<any>, string>({
      query: (id: string) => ({
        url: `/files/delete-file/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['files'],
    }),
    updateFile: builder.mutation<TResponse<any>, { id: string; data: Partial<Pick<IFile, 'name' | 'type'>> }>({
      query: ({ id, data }) => ({
        url: `/files/update-file/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['files'],
    }),
  }),
});

export const {
  useUploadFileMutation,
  useGetMyFilesQuery,
  useGetSingleFileQuery,
  useDeleteFileMutation,
  useUpdateFileMutation,
} = fileApi;
