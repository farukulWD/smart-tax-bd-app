import { useTranslation } from 'react-i18next';
import { setLocale } from './i18n';
import en from './locals/en';

type Leaves<T, P extends string = ''> = {
  [K in keyof T]: T[K] extends object ? Leaves<T[K], `${P}${K & string}.`> : `${P}${K & string}`;
}[keyof T];

type TranslationKey = Leaves<typeof en>;

type InterpolationMap = Record<string, string | number>;

export const useLocale = () => {
  const { t, i18n } = useTranslation();

  return {
    t: (key: TranslationKey, options?: InterpolationMap) => t(key, options),
    locale: i18n.language,
    setLocale,
    isEnglish: i18n.language === 'en',
    isBangla: i18n.language === 'bn',
  };
};
