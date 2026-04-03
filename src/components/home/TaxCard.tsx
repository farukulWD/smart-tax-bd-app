import { TaxTypeItem } from '@/src/types/publicTypes';
import { Pressable, Text, View } from 'react-native';
import LucideIcon from '../common/LucideIcon';
import { ArrowRight } from 'lucide-react-native';
import { withOpacity } from '@/src/utils/commonFunction';
import { Colors } from '@/src/context/ThemeProvider';

const getTaxIconName = (value: string) => {
  switch (value) {
    case 'income_tax':
      return 'CircleDollarSign';
    case 'house_rental_tax':
      return 'Home';
    case 'property_tax':
      return 'Landmark';
    case 'import_duty':
      return 'Globe2';
    case 'customs_duty':
      return 'BadgeCheck';
    case 'capital_gains_tax':
      return 'HandCoins';
    case 'gift_tax':
      return 'CircleDollarSign';
    case 'inheritance_tax':
      return 'ShieldCheck';
    case 'sales_tax':
      return 'ReceiptText';
    case 'service_tax':
      return 'BadgeCheck';
    case 'entertainment_tax':
      return 'CircleDollarSign';
    case 'environmental_tax':
      return 'Globe2';
    case 'wealth_tax':
      return 'Landmark';
    default:
      return 'CircleDollarSign';
  }
};

const TaxCard = ({ item }: { item: TaxTypeItem }) => {
  const IconName = getTaxIconName(item.value);

  return (
    <Pressable
      className="mb-2 overflow-hidden rounded-[22px] border border-border bg-card p-4"
      style={{
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}>
      <View className="relative">
        <View className="absolute right-0 top-0 opacity-[0.06]">
          <LucideIcon name={IconName} size={88} className="text-foreground" strokeWidth={1.5} />
        </View>
        <View
          style={{
            backgroundColor: withOpacity(Colors.primary, 15),
            borderWidth: 1,
            borderColor: withOpacity(Colors.primary, 30),
          }}
          className="mb-2 h-12 w-12 items-center justify-center rounded-2xl border">
          <LucideIcon name={IconName} size={22} className="text-foreground" strokeWidth={2} />
        </View>

        <Text
          className="mb-1 pr-4 text-[18px] font-bold leading-6 text-foreground"
          numberOfLines={2}>
          {item.title}
        </Text>
        <Text className="text-[13px] leading-5 text-mutedForeground" numberOfLines={4}>
          {item.description}
        </Text>
        <View className="mt-1">
          <View className="mb-2 h-[1px] bg-border" />

          <View className="flex-row items-center gap-2">
            <Text className="text-[12px] font-semibold uppercase tracking-[1.2px] text-[#3ca34d]">
              Explore Details
            </Text>
            <ArrowRight size={14} color="#3ca34d" />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default TaxCard;
