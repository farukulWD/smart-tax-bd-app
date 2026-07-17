import { View, Text, TouchableOpacity } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

export const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <View className="flex-1 items-center justify-center gap-4 px-8">
    <AlertCircle size={40} color="hsl(0, 83%, 49%)" />
    <Text className="text-center text-base font-bold text-foreground">Failed to load orders</Text>
    <Text className="text-center text-sm text-mutedForeground">
      Something went wrong. Please try again.
    </Text>
    <TouchableOpacity onPress={onRetry} className="rounded-2xl bg-primary px-6 py-3">
      <Text className="font-semibold text-primaryForeground">Retry</Text>
    </TouchableOpacity>
  </View>
);
