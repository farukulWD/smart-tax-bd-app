import { View, TouchableOpacity } from 'react-native';
import AppText from '@/src/components/common/AppText';
import { AlertCircle } from 'lucide-react-native';

export const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <View className="flex-1 items-center justify-center gap-4 px-8">
    <AlertCircle size={40} color="hsl(0, 83%, 49%)" />
    <AppText className="text-center text-base font-bold text-foreground">
      Failed to load orders
    </AppText>
    <AppText className="text-center text-sm text-mutedForeground">
      Something went wrong. Please try again.
    </AppText>
    <TouchableOpacity
      onPress={onRetry}
      className="h-12 items-center justify-center rounded-2xl bg-primary px-6">
      <AppText className="font-semibold text-primaryForeground">Retry</AppText>
    </TouchableOpacity>
  </View>
);
