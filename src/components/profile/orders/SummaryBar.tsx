import { View, Text } from 'react-native';
import { IOrder } from '@/src/services/orderApi';
import { Button } from '@/components/ui/button';
import { navigate } from '@/src/utils/NavigationUtils';

export const SummaryBar = ({ orders }: { orders: IOrder[] }) => {
  const placed = orders.filter((o) => o.status === 'order_placed').length;
  const inProgress = orders.filter((o) => o.status !== 'order_placed').length;

  return (
    <View className="mx-4 mb-4 rounded-3xl border border-border bg-card p-5">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="mb-1 text-xs text-mutedForeground">Total Orders</Text>
          <Text className="text-2xl font-bold text-foreground">{orders.length}</Text>
          <Text className="mt-1 text-xs text-mutedForeground">{placed} completed</Text>
        </View>

        <View className="items-end gap-2">
          <View className="flex-row items-center gap-2 rounded-full bg-muted px-3 py-2">
            <View className="h-2 w-2 rounded-full bg-primary" />
            <Text className="text-xs font-medium text-mutedForeground">{placed} Placed</Text>
          </View>
          <View className="flex-row items-center gap-2 rounded-full bg-muted px-3 py-2">
            <View className="h-2 w-2 rounded-full bg-warning" />
            <Text className="text-xs font-medium text-mutedForeground">
              {inProgress} In Progress
            </Text>
          </View>
        </View>
      </View>
      <Button
        className="mt-2 rounded-3xl"
        onPress={() => {
          navigate('CreateTaxOrder');
        }}>
        <Text className="font-semibold text-primaryForeground">Create New Order</Text>
      </Button>
    </View>
  );
};
