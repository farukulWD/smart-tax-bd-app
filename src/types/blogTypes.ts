export type BlogStatus = 'draft' | 'published';

// List queries use .select('-content') server-side, so list items carry no content.
export type BlogListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  category: string;
  tags: string[];
  authorName: string;
  status: BlogStatus;
  publishedAt?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Blog = BlogListItem & {
  content: string;
};

export type BlogMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

export type GetAllBlogsResponse = {
  success: boolean;
  message: string;
  data: BlogListItem[];
  meta: BlogMeta;
};

export type GetSingleBlogResponse = {
  success: boolean;
  message: string;
  data: {
    blog: Blog;
    related: BlogListItem[];
  };
};

export type GetAllBlogsArgs = {
  page: number;
  limit?: number;
};
