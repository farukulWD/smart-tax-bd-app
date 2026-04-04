export type NewsItem = {
  _id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
export interface TaxType {
  _id: string;
  title: string;
  rate: number;
  value: string;
  icon?: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
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
export type TaxTypeItem = {
  _id: string;
  title: string;
  rate: number;
  value: string;
  tax_orders_id: string[];
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type GetAllTaxTypesResponse = {
  success: boolean;
  message: string;
  data: TaxTypeItem[];
};
