import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locals/en';
import bn from './locals/bn';

const LANGUAGE_KEY = 'user_language';

export const setLocale = async (locale: string) => {
  await AsyncStorage.setItem(LANGUAGE_KEY, locale);
  i18n.changeLanguage(locale);
};

export const loadSavedLocale = async () => {
  const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
  if (saved) i18n.changeLanguage(saved);
};

const locales = {
  en: { translation: en },
  bn: { translation: bn },
};

const getInitialLanguage = (): string => {
  const locales = Localization.getLocales();
  if (locales && locales.length > 0 && locales[0].languageCode) {
    return locales[0].languageCode;
  }
  return 'en';
};

i18n.use(initReactI18next).init({
  resources: locales,
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

// Load saved language preference on app startup
loadSavedLocale();

export default i18n;
