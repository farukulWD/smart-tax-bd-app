export type NewsItem = {
  _id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type GetAllNewsResponse = {
  success: boolean;
  message: string;
  data: NewsItem[];
};

export type GetSingleNewsResponse = {
  success: boolean;
  message: string;
  data: NewsItem;
};
