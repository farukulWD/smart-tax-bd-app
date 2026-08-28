export type Locale = 'en' | 'bn';

export type LocalizedText = { en: string; bn: string };

export const readLocalized = (
  field: LocalizedText | string | null | undefined,
  locale: Locale = 'en'
): string => {
  if (field == null) return '';
  if (typeof field === 'string') return field;
  return field[locale] ?? field.en ?? field.bn ?? '';
};

export const toLocale = (language?: string): Locale =>
  language?.toLowerCase().startsWith('bn') ? 'bn' : 'en';
