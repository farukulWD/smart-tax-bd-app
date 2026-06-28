import { IFile } from '@/src/types/filesTypes';
import { PreviewFile } from '@/src/types/commonTypes';

export const isImageUrl = (url: string) => /\.(jpe?g|png|gif|webp|svg)(\?.*)?$/i.test(url);

export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-BD', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const shortenId = (id: string) => `\u2026${id.slice(-8)}`;

export const getExtension = (url: string) => {
  const match = url.split('?')[0].match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1].toUpperCase() : 'FILE';
};

export const getFileType = (url: string): 'image' | 'pdf' | 'other' => {
  if (isImageUrl(url)) return 'image';
  if (/\.pdf(\?.*)?$/i.test(url)) return 'pdf';
  return 'other';
};

export const toPreviewFile = (file: IFile): PreviewFile => ({
  url: file.file,
  name: file.name,
  type: getFileType(file.file),
});
