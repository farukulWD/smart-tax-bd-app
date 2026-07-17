import { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IOrder, useGetMyOrdersQuery } from '@/src/services/orderApi';
import ScreenHeader from '@/src/components/common/ScreenHeader';
import ProtectedScreen from '@/src/navigation/ProtectedScreen';
import { FilterStatus } from '@/src/components/profile/orders/types';
import { SummaryBar } from '@/src/components/profile/orders/SummaryBar';
import { FilterTabs } from '@/src/components/profile/orders/FilterTabs';
import { OrderCard } from '@/src/components/profile/orders/OrderCard';
import { EmptyState } from '@/src/components/profile/orders/EmptyState';
import { ErrorState } from '@/src/components/profile/orders/ErrorState';
import { OrderDetailModal } from '@/src/components/profile/orders/OrderDetailModal';

const MyOrdersScreen = () => {
  const navigation = useNavigation<any>();
  const [filter, setFilter] = useState<FilterStatus>('all');

  const { data, isLoading, error, refetch, isFetching } = useGetMyOrdersQuery(undefined);
  const orders: IOrder[] = data?.data ?? [];
  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const counts: Record<FilterStatus, number> = {
    all: orders.length,
    draft: orders.filter((o) => o.status === 'draft').length,
    documents_uploaded: orders.filter((o) => o.status === 'documents_uploaded').length,
    order_placed: orders.filter((o) => o.status === 'order_placed').length,
  };

  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  return (
    <ProtectedScreen>
      <View className="flex-1 bg-background">
        <ScreenHeader className="mb-3" title="My Orders" showBack={navigation.canGoBack()} />

        {isLoading ? (
          <View className="flex-1 items-center justify-center gap-3">
            <ActivityIndicator size="large" color="hsl(125, 70%, 33%)" />
            <Text className="text-sm text-mutedForeground">Loading orders\u2026</Text>
          </View>
        ) : error ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <>
            {orders.length > 0 && <SummaryBar orders={orders} />}

            <FilterTabs active={filter} onChange={setFilter} counts={counts} />

            <FlatList
              data={filtered}
              keyExtractor={(item) => item._id ?? Math.random().toString()}
              renderItem={({ item }) => (
                <OrderCard item={item} onPress={() => setSelectedOrder(item)} />
              )}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <EmptyState
                  filter={filter}
                  onCreateOrder={() => navigation.navigate('CreateTaxOrder')}
                />
              }
              refreshControl={
                <RefreshControl
                  refreshing={isFetching && !isLoading}
                  onRefresh={refetch}
                  tintColor="hsl(125, 70%, 33%)"
                />
              }
            />
          </>
        )}

        <OrderDetailModal
          selectedOrder={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStartPayment={(id) =>
            navigation.navigate('OrderPaymentStatus', { taxId: id, canGoBack: true })
          }
        />
      </View>
    </ProtectedScreen>
  );
};

export default MyOrdersScreen;
