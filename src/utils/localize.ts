export type Locale = 'en' | 'bn';

export type LocalizedText = { en: string; bn: string };

/**
 * Reads a possibly-localized field, tolerating plain-string rows that predate
 * a field becoming localized. Falls back to English, then the other locale.
 * Mirrors the client's `lib/localize.ts`.
 */
export const readLocalized = (
  field: LocalizedText | string | null | undefined,
  locale: Locale = 'en',
): string => {
  if (field == null) return '';
  if (typeof field === 'string') return field;
  return field[locale] ?? field.en ?? field.bn ?? '';
};

/** Narrows an i18next language tag (`bn`, `bn-BD`, `en-US`) to a Locale. */
export const toLocale = (language?: string): Locale =>
  language?.toLowerCase().startsWith('bn') ? 'bn' : 'en';
