export interface TSlide {
  id: string;
  title: string;
  image: string;
  isActive: boolean;
  order: number;
  linkType?: SliderLinkType;
  linkUrl?: string;
  description?: string;
}
export type SliderLinkType = 'external' | 'internal';
