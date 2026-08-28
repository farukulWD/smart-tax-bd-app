import { TaxTypeItem } from '@/src/types/publicTypes';
import { Image, Pressable, View } from 'react-native';
import AppText from '@/src/components/common/AppText';
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

const isIconUrl = (icon?: string) => !!icon && /^https?:\/\//.test(icon);

const TaxCard = ({ item }: { item: TaxTypeItem }) => {
  const { locale } = useLocale();
  const title = item.title[locale as keyof typeof item.title] || item.title.en;
  const initials = getInitials(item.title.en);

  return (
    <Pressable
      onPress={() => navigate('CreateTaxOrder', { taxType: item.value })}
      className="flex-1">
      <View className="min-h-28 flex-1 items-center justify-center rounded-2xl border border-border bg-card p-2">
        <View className="mb-2 h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-secondary/10">
          {isIconUrl(item.icon) ? (
            <Image
              source={{ uri: item.icon }}
              className="h-6 w-6"
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          ) : (
            <AppText className="text-xs font-bold text-secondary">{initials}</AppText>
          )}
        </View>
        <AppText
          className="text-center text-xs font-semibold text-foreground"
          numberOfLines={3}
          ellipsizeMode="tail">
          {title}
        </AppText>
      </View>
    </Pressable>
  );
};

export default TaxCard;
