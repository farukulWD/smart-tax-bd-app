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
    <Pressable onPress={handleNavigation} className="mb-2 flex-1 items-center">
      <View className="mb-1 h-[80px] w-[80px] items-center justify-center rounded-2xl border border-[#3ca34d79] bg-[#3ca34d1f]">
        <LucideIcon name={IconName} size={45} className="text-primary" strokeWidth={2} />
      </View>

      <Text className="text-center font-medium text-foreground" numberOfLines={2}>
        {item.title[locale as keyof typeof item.title] || item.title.en}
      </Text>
    </Pressable>
  );
};

export default TaxCard;
