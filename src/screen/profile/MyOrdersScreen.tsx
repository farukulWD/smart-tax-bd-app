import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { IOrder, useGetMyOrdersQuery } from '@/src/services/orderApi';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ClipboardList,
  CalendarDays,
  Banknote,
  CircleDot,
} from 'lucide-react-native';
import ScreenHeader from '@/src/components/common/ScreenHeader';
import { showToast } from '@/src/utils/commonFunction';
import { Button } from '@/components/ui/button';
import { navigate } from '@/src/utils/NavigationUtils';

type FilterStatus = 'all' | 'draft' | 'documents_uploaded' | 'order_placed';

const formatAmount = (amount: number) => `৳ ${amount.toLocaleString('en-BD')}`;

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-BD', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatStatus = (status: string) =>
  status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const shortenId = (id: string) => `…${id.slice(-6)}`;

// ─── status config ────────────────────────────────────────────────────────────

const statusConfig: Record<
  string,
  {
    label: string;
    pillBg: string;
    pillText: string;
    borderAccent: string;
    iconColor: string;
    icon: React.ReactNode;
  }
> = {
  draft: {
    label: 'Draft',
    pillBg: 'bg-muted',
    pillText: 'text-mutedForeground',
    borderAccent: 'border-l-border',
    iconColor: 'hsl(0, 0%, 60%)',
    icon: <FileText size={14} color="hsl(0, 0%, 60%)" />,
  },
  documents_uploaded: {
    label: 'Docs Uploaded',
    pillBg: 'bg-primary/15',
    pillText: 'text-primary',
    borderAccent: 'border-l-primary',
    iconColor: 'hsl(125, 70%, 33%)',
    icon: <CheckCircle2 size={14} color="hsl(125, 70%, 33%)" />,
  },
  order_placed: {
    label: 'Order Placed',
    pillBg: 'bg-primary/15',
    pillText: 'text-primary',
    borderAccent: 'border-l-primary',
    iconColor: 'hsl(125, 70%, 33%)',
    icon: <CheckCircle2 size={14} color="hsl(125, 70%, 33%)" />,
  },
  pending_payment: {
    label: 'Pending Payment',
    pillBg: 'bg-yellow-500/15',
    pillText: 'text-yellow-500',
    borderAccent: 'border-l-yellow-500',
    iconColor: 'hsl(48, 96%, 53%)',
    icon: <Clock size={14} color="hsl(48, 96%, 53%)" />,
  },
};

const getStatusConfig = (status: string) =>
  statusConfig[status] ?? {
    label: formatStatus(status),
    pillBg: 'bg-muted',
    pillText: 'text-mutedForeground',
    borderAccent: 'border-l-border',
    iconColor: 'hsl(0, 0%, 60%)',
    icon: <CircleDot size={14} color="hsl(0, 0%, 60%)" />,
  };

// ─── Step indicator ───────────────────────────────────────────────────────────

const StepDots = ({ current }: { current: 1 | 2 | 3 }) => (
  <View className="flex-row items-center gap-1">
    {[1, 2, 3].map((step) => (
      <View
        key={step}
        className={[
          'h-1.5 rounded-full',
          step < current
            ? 'w-4 bg-primary'
            : step === current
              ? 'bg-primary/60 w-4'
              : 'w-2 bg-muted',
        ].join(' ')}
      />
    ))}
    <Text className="ml-1 text-xs text-mutedForeground">Step {current}/3</Text>
  </View>
);

// ─── Summary Bar ──────────────────────────────────────────────────────────────

const SummaryBar = ({ orders }: { orders: IOrder[] }) => {
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

        <View className="gap-2">
          <View className="flex-row items-center gap-2 rounded-xl bg-muted px-3 py-2">
            <View className="h-2 w-2 rounded-full bg-primary" />
            <Text className="text-xs text-mutedForeground">{placed} Placed</Text>
          </View>
          <View className="flex-row items-center gap-2 rounded-xl bg-muted px-3 py-2">
            <View className="h-2 w-2 rounded-full bg-yellow-500" />
            <Text className="text-xs text-mutedForeground">{inProgress} In Progress</Text>
          </View>
        </View>
      </View>
      <Button
        className="mt-2"
        onPress={() => {
          navigate('CreateTaxOrder');
        }}>
        <Text className="font-semibold text-primaryForeground">Create New Order</Text>
      </Button>
    </View>
  );
};

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

const FILTERS: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'documents_uploaded', label: 'Uploaded' },
  { key: 'order_placed', label: 'Placed' },
];

const FilterTabs = ({
  active,
  onChange,
  counts,
}: {
  active: FilterStatus;
  onChange: (f: FilterStatus) => void;
  counts: Record<FilterStatus, number>;
}) => (
  <View className="mb-4 flex-row gap-2 px-4">
    {FILTERS.map((f) => {
      const isActive = active === f.key;
      return (
        <TouchableOpacity
          key={f.key}
          onPress={() => onChange(f.key)}
          activeOpacity={0.75}
          className={[
            'flex-row items-center gap-1.5 rounded-full px-3 py-2',
            isActive ? 'bg-primary' : 'bg-muted',
          ].join(' ')}>
          <Text
            className={`text-xs font-semibold ${
              isActive ? 'text-primaryForeground' : 'text-mutedForeground'
            }`}>
            {f.label}
          </Text>
          <View
            className={`h-4 w-4 items-center justify-center rounded-full ${
              isActive ? 'bg-primaryForeground/20' : 'bg-background'
            }`}>
            <Text
              className={`text-[10px] font-bold ${
                isActive ? 'text-primaryForeground' : 'text-mutedForeground'
              }`}>
              {counts[f.key]}
            </Text>
          </View>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ─── Order Card ───────────────────────────────────────────────────────────────

const OrderCard = ({ item, onPress }: { item: IOrder; onPress: () => void }) => {
  const cfg = getStatusConfig(item.status);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`mx-4 mb-3 border border-l-4 border-border bg-card ${cfg.borderAccent} overflow-hidden rounded-2xl`}>
      <View className="px-4 py-4">
        {/* Top row */}
        <View className="mb-3 flex-row items-start justify-between">
          <View className="mr-3 flex-1">
            <Text className="mb-0.5 text-sm font-bold text-cardForeground" numberOfLines={1}>
              {item.personal_iformation?.name}
            </Text>
            <Text className="text-xs text-mutedForeground" numberOfLines={1}>
              #{item._id ? shortenId(item._id) : '—'} · {item.tax_year}
            </Text>
          </View>

          {/* Status pill */}
          <View className={`flex-row items-center gap-1 rounded-full px-2.5 py-1 ${cfg.pillBg}`}>
            {cfg.icon}
            <Text className={`text-xs font-semibold ${cfg.pillText}`}>{cfg.label}</Text>
          </View>
        </View>

        {/* Info row */}
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

        {/* Income sources */}
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

        {/* Bottom row */}
        <View className="flex-row items-center justify-between">
          <StepDots current={item.current_step} />
          <ChevronRight size={16} color="hsl(0, 0%, 60%)" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({
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

// ─── Error State ──────────────────────────────────────────────────────────────

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
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

// ─── Main Screen ──────────────────────────────────────────────────────────────

const MyOrdersScreen = () => {
  const { top } = useSafeAreaInsets();
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

  const handleOrderPress = (order: IOrder) => {
    // Navigate to order detail — adjust screen name to match your stack
    // navigation.navigate('TaxOrderDetail', { taxId: order._id });
    console.log(order);
    showToast({ message: 'Coming soon...' });
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top }}>
      <ScreenHeader
        className="mb-3"
        title="My Orders"
        description="Manage your tax filing orders"
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="hsl(125, 70%, 33%)" />
          <Text className="text-sm text-mutedForeground">Loading orders…</Text>
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
              <OrderCard item={item} onPress={() => handleOrderPress(item)} />
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
    </View>
  );
};

export default MyOrdersScreen;
