import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAllTaxTypesQuery } from '@/src/services/publicApi';
import { readLocalized, toLocale } from '@/src/utils/localize';

/**
 * Orders store tax type `value` keys; this turns one into its title in the
 * current language, falling back to the raw key for a tax type since deleted.
 */
export const useTaxTypeTitle = () => {
  const { i18n } = useTranslation();
  const locale = toLocale(i18n.language);
  const { data } = useGetAllTaxTypesQuery();
  const taxTypes = data?.data;

  return useCallback(
    (value: string) => {
      const taxType = taxTypes?.find((item) => item.value === value);
      return taxType ? readLocalized(taxType.title, locale) || value : value;
    },
    [taxTypes, locale]
  );
};
