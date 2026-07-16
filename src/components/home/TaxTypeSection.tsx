import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useGetAllTaxTypesQuery } from '@/src/services/publicApi';
import TaxCard from './TaxCard';
import { TaxTypeItem } from '@/src/types/publicTypes';

const NUM_COLUMNS = 2;

const getPaddedData = (data: TaxTypeItem[], columns: number): (TaxTypeItem | null)[] => {
  const remainder = data.length % columns;
  if (remainder === 0) return data;
  return [...data, ...Array(columns - remainder).fill(null)];
};

const TaxTypeSection = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useGetAllTaxTypesQuery();
  const types = data?.data || [];

  const paddedTypes = useMemo(() => getPaddedData(types, NUM_COLUMNS), [types]);

  const renderItem = useCallback(({ item, index }: { item: TaxTypeItem | null; index: number }) => {
    if (!item) return <View style={{ flex: 1 }} />;
    return <TaxCard item={item} index={index} />;
  }, []);

  const keyExtractor = useCallback(
    (item: TaxTypeItem | null, index: number) => item?._id ?? `spacer-${index}`,
    []
  );

  if (isLoading) {
    return (
      <View className="items-center justify-center px-5 py-14">
        <ActivityIndicator size="large" color="#3ca34d" />
        <Text className="mt-3 text-sm text-mutedForeground">{t('home.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="px-5 py-14">
        <Text className="text-center text-base font-semibold text-red-500">{t('home.error')}</Text>
      </View>
    );
  }

  if (!types.length) {
    return (
      <View className="bg-background px-4 py-10">
        <Text className="text-center text-sm text-mutedForeground">{t('home.notFound')}</Text>
      </View>
    );
  }

  return (
    <View className="bg-background px-4">
      <Text className="text-xl font-bold text-foreground">{t('home.taxTypes')}</Text>
      <FlatList
        data={paddedTypes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={NUM_COLUMNS}
        contentContainerClassName="gap-1"
        columnWrapperClassName="gap-3 items-start"
        scrollEnabled={false}
        removeClippedSubviews
      />
    </View>
  );
};

export default TaxTypeSection;
