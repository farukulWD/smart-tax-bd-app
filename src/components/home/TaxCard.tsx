import { TaxTypeItem } from '@/src/types/publicTypes';
import { Pressable, Text, View } from 'react-native';
import LucideIcon from '../common/LucideIcon';
import { navigate } from '@/src/utils/NavigationUtils';
import { useLocale } from '@/src/localization/useLocale';
const CARD_PALETTE = [
  '#E53E3E', // Red
  '#38A169', // Green
  '#DD6B20', // Orange
  '#3182CE', // Blue
];
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

function snakeToTitleCase(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

const TaxCard = ({ item, index }: { item: TaxTypeItem; index: number }) => {
  const IconName = getTaxIconName(item.value);
  const { locale } = useLocale();
  const handleNavigation = () => {
    navigate('CreateTaxOrder', { taxType: item.value });
  };
  const cardColor = CARD_PALETTE[index % CARD_PALETTE.length];
  return (
    <Pressable onPress={handleNavigation} className="mb-2 flex-1">
      <View className="flex-1 overflow-hidden rounded-xl border border-border bg-card p-3">
        <View
          style={{ backgroundColor: cardColor + 30 }}
          className="mb-1 h-[40px] w-[40px] items-center justify-center rounded-xl bg-secondary/20">
          <LucideIcon
            name={IconName}
            size={20}
            // className="text-secondary"
            color={cardColor}
            strokeWidth={2}
          />
        </View>
        <Text className="text-start font-bold text-foreground" numberOfLines={2}>
          {item.title[locale as keyof typeof item.title] || item.title.en}
        </Text>
        <Text
          className="py-2 text-start text-xs font-normal text-mutedForeground"
          numberOfLines={2}>
          {item.description[locale as keyof typeof item.description] || item.description.en}
        </Text>
        <View className="flex-grow" />
        <View className="flex-row items-center justify-between">
          <View style={{ backgroundColor: cardColor + 30 }} className="rounded-full px-2 py-1">
            <Text numberOfLines={1} className="text-[9px] font-medium" style={{ color: cardColor }}>
              {snakeToTitleCase(item.value)}
            </Text>
          </View>
          <View className="h-5 w-5 items-center justify-center rounded-full bg-muted">
            <LucideIcon name={'ArrowRight'} className="text-mutedForeground" size={12} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default TaxCard;
