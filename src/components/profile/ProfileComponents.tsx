import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

export type ProfileStat = { label: string; value: number; icon: React.ReactNode; accent: string };

export const StatCard = ({ stat }: { stat: ProfileStat }) => (
  <View className="flex-1 items-center gap-1 rounded-2xl border border-border bg-card px-3 py-3.5">
    <View className={`mb-1 h-9 w-9 items-center justify-center rounded-full ${stat.accent}`}>
      {stat.icon}
    </View>
    <Text className="text-lg font-bold text-foreground">{stat.value}</Text>
    <Text className="text-[11px] text-mutedForeground">{stat.label}</Text>
  </View>
);

export const MenuItem = ({
  icon,
  label,
  description,
  onPress,
  isFirst,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onPress: () => void;
  isFirst?: boolean;
  accent?: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.72}
    className={`flex-row items-center gap-3 px-4 py-3.5 ${!isFirst ? 'border-t border-border' : ''}`}>
    <View
      className={`h-9 w-9 items-center justify-center overflow-hidden rounded-xl ${accent ?? 'bg-muted'}`}>
      {icon}
    </View>
    <View className="flex-1">
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
      {description && <Text className="mt-0.5 text-xs text-mutedForeground">{description}</Text>}
    </View>
    <ChevronRight size={15} color="hsl(0, 0%, 60%)" />
  </TouchableOpacity>
);

export const SectionLabel = ({ label }: { label: string }) => (
  <Text className="mx-4 mb-2 mt-5 text-xs font-bold uppercase tracking-widest text-mutedForeground">
    {label}
  </Text>
);
