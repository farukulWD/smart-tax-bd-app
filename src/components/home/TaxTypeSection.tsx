import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import AppText from '@/src/components/common/AppText';
import { useTranslation } from 'react-i18next';
import { useGetAllTaxTypesQuery } from '@/src/services/publicApi';
import TaxCard from './TaxCard';
import { TaxTypeItem } from '@/src/types/publicTypes';

const NUM_COLUMNS = 3;

const getPaddedData = (data: TaxTypeItem[], columns: number): (TaxTypeItem | null)[] => {
  const remainder = data.length % columns;
  if (remainder === 0) return data;
  return [...data, ...Array(columns - remainder).fill(null)];
};

const TaxTypeSection = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useGetAllTaxTypesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const types = data?.data || [];

  const paddedTypes = useMemo(() => getPaddedData(types, NUM_COLUMNS), [types]);

  const renderItem = useCallback(({ item }: { item: TaxTypeItem | null }) => {
    if (!item) return <View style={{ flex: 1 }} />;
    return <TaxCard item={item} />;
  }, []);

  const keyExtractor = useCallback(
    (item: TaxTypeItem | null, index: number) => item?._id ?? `spacer-${index}`,
    []
  );

  if (isLoading) {
    return (
      <View className="items-center justify-center px-5 py-14">
        <ActivityIndicator size="large" color="#3ca34d" />
        <AppText className="mt-3 text-sm text-mutedForeground">{t('home.loading')}</AppText>
      </View>
    );
  }

  if (error) {
    return (
      <View className="px-5 py-14">
        <AppText className="text-center text-base font-semibold text-red-500">
          {t('home.error')}
        </AppText>
      </View>
    );
  }

  if (!types.length) {
    return (
      <View className="bg-background px-4 py-10">
        <AppText className="text-center text-sm text-mutedForeground">{t('home.notFound')}</AppText>
      </View>
    );
  }

  return (
    <View className="bg-background px-4">
      <View className="mb-3">
        <AppText className="text-2xl font-bold text-foreground">{t('home.taxCategories')}</AppText>
        <AppText className="text-sm text-mutedForeground">
          {t('home.taxCategoriesSubtitle')}
        </AppText>
      </View>
      {!types.length ? (
        <View className="py-10">
          <AppText className="text-center text-sm text-mutedForeground">
            {t('home.notFound')}
          </AppText>
        </View>
      ) : null}
      <FlatList
        data={paddedTypes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={NUM_COLUMNS}
        contentContainerClassName="gap-2"
        columnWrapperClassName="gap-2 items-stretch"
        scrollEnabled={false}
        removeClippedSubviews
      />
    </View>
  );
};

export default TaxTypeSection;
