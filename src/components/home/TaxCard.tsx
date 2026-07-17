import { TaxTypeItem } from '@/src/types/publicTypes';
import { Pressable, Text, View } from 'react-native';
import { navigate } from '@/src/utils/NavigationUtils';
import { useLocale } from '@/src/localization/useLocale';

const STOPWORDS = new Set(['from', 'the', 'of', 'and', 'for', 'to', 'a', 'an', 'tax', 'return']);

const getInitials = (raw: string): string => {
  const words = raw
    .replace(/[^A-Za-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w.toLowerCase()));
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return raw.trim().slice(0, 2).toUpperCase();
};

const cardShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

const TaxCard = ({ item }: { item: TaxTypeItem }) => {
  const { locale } = useLocale();
  const title = item.title[locale as keyof typeof item.title] || item.title.en;
  const initials = getInitials(item.title.en);

  return (
    <Pressable
      onPress={() => navigate('CreateTaxOrder', { taxType: item.value })}
      className="mb-3 flex-1">
      <View
        className="min-h-[150px] rounded-2xl border border-border bg-card p-4"
        style={cardShadow}>
        <View className="mb-4 h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
          <Text className="text-base font-bold text-secondary">{initials}</Text>
        </View>
        <Text className="text-base font-bold text-foreground" numberOfLines={2}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

export default TaxCard;
