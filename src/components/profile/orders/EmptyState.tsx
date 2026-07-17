import { View, Text, TouchableOpacity } from 'react-native';
import { ClipboardList } from 'lucide-react-native';
import { FilterStatus } from './types';

const formatStatus = (status: string) =>
  status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export const EmptyState = ({
  filter,
  onCreateOrder,
}: {
  filter: FilterStatus;
  onCreateOrder: () => void;
}) => (
  <View className="flex-1 items-center justify-center gap-3 px-8 py-16">
    <View className="mb-2 h-16 w-16 items-center justify-center rounded-full bg-muted">
      <ClipboardList size={28} color="hsl(0, 0%, 60%)" />
    </View>
    <Text className="text-center text-base font-bold text-foreground">No orders found</Text>
    <Text className="text-center text-sm text-mutedForeground">
      {filter === 'all'
        ? "You haven't placed any tax orders yet."
        : `No ${formatStatus(filter)} orders to show.`}
    </Text>
    {filter === 'all' && (
      <TouchableOpacity
        onPress={onCreateOrder}
        className="mt-2 rounded-2xl bg-primary px-6 py-3"
        activeOpacity={0.85}>
        <Text className="font-semibold text-primaryForeground">Create Order</Text>
      </TouchableOpacity>
    )}
  </View>
);
