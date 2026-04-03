import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { useGetAllTaxTypesQuery } from '@/src/services/publicApi';
import LucideIcon from '../common/LucideIcon';
import TaxCard from './TaxCard';
import { Colors } from '@/src/context/ThemeProvider';
import { withOpacity } from '@/src/utils/commonFunction';

type TaxTypeItem = {
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

const splitIntoColumns = (items: TaxTypeItem[]) => {
  const left: TaxTypeItem[] = [];
  const right: TaxTypeItem[] = [];

  items.forEach((item, index) => {
    if (index % 2 === 0) {
      left.push(item);
    } else {
      right.push(item);
    }
  });

  return { left, right };
};

const TaxTypeSection = () => {
  const { data, isLoading, error } = useGetAllTaxTypesQuery();
  const types = data?.data || [];

  const { left, right } = splitIntoColumns(types);

  if (isLoading) {
    return (
      <View className="items-center justify-center px-5 py-14">
        <ActivityIndicator size="large" color="#3ca34d" />
        <Text className="mt-3 text-sm text-mutedForeground">Loading tax types...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="px-5 py-14">
        <Text className="text-center text-base font-semibold text-red-500">
          Failed to load tax categories
        </Text>
      </View>
    );
  }
  console.log('Colors', JSON.stringify(Colors.primary, null, 2));
  return (
    <View className="bg-background px-4 py-3">
      <View
        style={{ backgroundColor: withOpacity(Colors.primary, 30) }}
        className="self-start rounded-full border border-border px-3 py-2">
        <Text className="text-[12px] font-bold text-[#3ca34d]">Expert Compliance</Text>
      </View>

      <Text className="text-[34px] font-extrabold leading-[40px] text-foreground">
        Tax Services <Text className="text-[#3ca34d]">&amp; Categories</Text>
      </Text>

      <Text className="text-[15px] leading-7 text-mutedForeground">
        Navigate the complexities of Bangladeshi tax law with our specialized services. We provide
        accurate, timely, and compliant solutions for every tax category.
      </Text>

      {!types.length ? (
        <View className="py-10">
          <Text className="text-center text-sm text-mutedForeground">No tax categories found</Text>
        </View>
      ) : (
        <View className="mt-2 flex-row justify-between">
          <View className="w-[49%]">
            {left.map((item) => (
              <TaxCard key={item._id} item={item} />
            ))}
          </View>

          <View className="w-[49%]">
            {right.map((item) => (
              <TaxCard key={item._id} item={item} />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default TaxTypeSection;
