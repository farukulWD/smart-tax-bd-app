import { TaxTypeItem } from '@/src/types/publicTypes';
import { Pressable, Text, View } from 'react-native';
import LucideIcon from '../common/LucideIcon';
import { navigate } from '@/src/utils/NavigationUtils';
import { useLocale } from '@/src/localization/useLocale';

const getTaxIconName = (value: string) => {
  switch (value) {
    case 'income_tax':
      return 'CircleDollarSign';
    case 'income_tax_government':
      return 'Landmark';
    case 'income_tax_non_government':
      return 'Briefcase';
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
  const { locale } = useLocale();
  const handleNavigation = () => {
    navigate('CreateTaxOrder', { taxType: item.value });
  };

  return (
    <Pressable onPress={handleNavigation} className="mb-2 flex-1">
      <View className="flex-1 overflow-hidden rounded-xl border border-border bg-card p-3">
        <View className="mb-1 h-[40px] w-[40px] items-center justify-center rounded-xl bg-secondary/20">
          <LucideIcon name={IconName} size={20} className="text-secondary" strokeWidth={2} />
        </View>
        <View className="flex-grow" />
        <Text className="text-center font-medium text-foreground" numberOfLines={2}>
          {item.title[locale as keyof typeof item.title] || item.title.en}
        </Text>
        <LucideIcon
          name={IconName}
          size={60}
          className="absolute -right-1.5 -top-1.5 text-mutedForeground opacity-30"
          strokeWidth={2}
        />
      </View>
    </Pressable>
  );
};

export default TaxCard;
