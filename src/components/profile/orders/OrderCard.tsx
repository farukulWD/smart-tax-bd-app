import { View, Text, TouchableOpacity } from 'react-native';
import { CalendarDays, Banknote, ChevronRight } from 'lucide-react-native';
import { IOrder } from '@/src/services/orderApi';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { getStatusConfig } from './statusConfig';
import { formatDate, formatAmount, shortenId } from './utils';
import { StepDots } from './StepDots';

export const OrderCard = ({ item, onPress }: { item: IOrder; onPress: () => void }) => {
  const { colors } = useThemeColors();
  const cfg = getStatusConfig(item.status, colors);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`mx-4 mb-3 border border-l-4 border-border bg-card ${cfg.borderAccent} overflow-hidden rounded-2xl`}>
      <View className="px-4 py-4">
        <View className="mb-3 flex-row items-start justify-between">
          <View className="mr-3 flex-1">
            <Text className="mb-0.5 text-sm font-bold text-cardForeground" numberOfLines={1}>
              {item.personal_information?.name}
            </Text>
            <Text className="text-xs text-mutedForeground" numberOfLines={1}>
              #{item._id ? shortenId(item._id) : '\u2014'} \u00B7 {item.tax_year}
            </Text>
          </View>

          <View className={`flex-row items-center gap-1 rounded-full px-2.5 py-1 ${cfg.pillBg}`}>
            {cfg.icon}
            <Text className={`text-xs font-semibold ${cfg.pillText}`}>{cfg.label}</Text>
          </View>
        </View>

        <View className="mb-3 flex-row items-center gap-4">
          <View className="flex-row items-center gap-1">
            <CalendarDays size={12} color="hsl(0, 0%, 60%)" />
            <Text className="text-xs text-mutedForeground">{formatDate(item.createdAt)}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Banknote size={12} color="hsl(0, 0%, 60%)" />
            <Text className="text-xs text-mutedForeground">{formatAmount(item.fee_amount)}</Text>
          </View>
        </View>

        {item.source_of_income?.length > 0 && (
          <View className="mb-3 flex-row flex-wrap gap-1.5">
            {item.source_of_income.slice(0, 2).map((src) => (
              <View key={src} className="rounded-lg bg-muted px-2 py-0.5">
                <Text className="text-xs text-mutedForeground" numberOfLines={1}>
                  {src}
                </Text>
              </View>
            ))}
            {item.source_of_income.length > 2 && (
              <View className="rounded-lg bg-muted px-2 py-0.5">
                <Text className="text-xs text-mutedForeground">
                  +{item.source_of_income.length - 2}
                </Text>
              </View>
            )}
          </View>
        )}

        <View className="flex-row items-center justify-between">
          <StepDots current={item.current_step} />
          <ChevronRight size={16} color="hsl(0, 0%, 60%)" />
        </View>
      </View>
    </TouchableOpacity>
  );
};
