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
import { IPayment, useGetMyPaymentsQuery } from '@/src/services/paymentApi';
import {
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Receipt,
} from 'lucide-react-native';
import ScreenHeader from '@/src/components/common/ScreenHeader';

// ─── types ────────────────────────────────────────────────────────────────────

type FilterStatus = 'all' | 'completed' | 'pending' | 'failed';

// ─── helpers ──────────────────────────────────────────────────────────────────

const formatAmount = (amount: number) => `৳ ${amount.toLocaleString('en-BD')}`;

const formatPaymentFor = (paymentFor: string) =>
  paymentFor
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const shortenId = (id: string) => `…${id.slice(-8)}`;

// ─── status config (uses only green/amber/destructive semantic tokens) ────────

const statusConfig = {
  completed: {
    label: 'Completed',
    pillBg: 'bg-primary/15',
    pillText: 'text-primary',
    borderAccent: 'border-l-primary',
    amountText: 'text-primary',
  },
  pending: {
    label: 'Pending',
    pillBg: 'bg-yellow-500/15',
    pillText: 'text-yellow-500',
    borderAccent: 'border-l-yellow-500',
    amountText: 'text-foreground',
  },
  failed: {
    label: 'Failed',
    pillBg: 'bg-destructive/15',
    pillText: 'text-destructive',
    borderAccent: 'border-l-destructive',
    amountText: 'text-destructive',
  },
};

// ─── Summary Bar ──────────────────────────────────────────────────────────────

const SummaryBar = ({ payments }: { payments: IPayment[] }) => {
  const completed = payments.filter((p) => p.status === 'completed');
  const pending = payments.filter((p) => p.status === 'pending');
  const totalPaid = completed.reduce((s, p) => s + p.amount, 0);

  return (
    <View className="mx-4 mb-4 flex-row items-center justify-between rounded-3xl border border-border bg-card p-5">
      <View>
        <Text className="mb-1 text-xs text-mutedForeground">Total Paid</Text>
        <Text className="text-2xl font-bold text-primary">{formatAmount(totalPaid)}</Text>
        <Text className="mt-1 text-xs text-mutedForeground">{completed.length} transactions</Text>
      </View>

      <View className="gap-2">
        <View className="flex-row items-center gap-2 rounded-xl bg-muted px-3 py-2">
          <View className="h-2 w-2 rounded-full bg-primary" />
          <Text className="text-xs text-mutedForeground">{completed.length} Completed</Text>
        </View>
        <View className="flex-row items-center gap-2 rounded-xl bg-muted px-3 py-2">
          <View className="h-2 w-2 rounded-full bg-yellow-500" />
          <Text className="text-xs text-mutedForeground">{pending.length} Pending</Text>
        </View>
      </View>
    </View>
  );
};

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

const FILTERS: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'completed', label: 'Completed' },
  { key: 'pending', label: 'Pending' },
  { key: 'failed', label: 'Failed' },
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

// ─── Payment Card ─────────────────────────────────────────────────────────────

const PaymentCard = ({ item }: { item: IPayment }) => {
  const cfg = statusConfig[item.status] ?? statusConfig.pending;
  return (
    <View
      className={`mx-4 mb-3 border border-l-4 border-border bg-card ${cfg.borderAccent} overflow-hidden rounded-2xl`}>
      <View className="px-4 py-4">
        {/* Top row */}
        <View className="mb-3 flex-row items-start justify-between">
          <View className="mr-3 flex-1">
            <Text className="mb-0.5 text-sm font-bold text-cardForeground">
              {formatPaymentFor(item.paymentFor)}
            </Text>
            <Text className="text-xs text-mutedForeground" numberOfLines={1}>
              Order {shortenId(item.orderId)}
            </Text>
          </View>

          <Text className={`text-base font-bold ${cfg.amountText}`}>
            {formatAmount(item.amount)}
          </Text>
        </View>

        {/* Bottom row */}
        <View className="flex-row items-center justify-between">
          {/* Transaction ID */}
          <View className="mr-2 flex-1 flex-row items-center gap-1.5">
            <Receipt size={11} color="hsl(0, 0%, 60%)" />
            <Text className="text-xs text-mutedForeground" numberOfLines={1}>
              {item.transaction_id ? shortenId(item.transaction_id) : '—'}
            </Text>
          </View>

          {/* Status pill */}
          <View className={`flex-row items-center gap-1 rounded-full px-2.5 py-1 ${cfg.pillBg}`}>
            {item.status === 'completed' && <CheckCircle2 size={13} color="hsl(125, 70%, 33%)" />}
            {item.status === 'pending' && <Clock size={13} color="hsl(48, 96%, 53%)" />}
            {item.status === 'failed' && <XCircle size={13} color="hsl(0, 83%, 49%)" />}
            <Text className={`text-xs font-semibold ${cfg.pillText}`}>{cfg.label}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ filter }: { filter: FilterStatus }) => (
  <View className="flex-1 items-center justify-center gap-3 px-8 py-16">
    <View className="mb-2 h-16 w-16 items-center justify-center rounded-full bg-muted">
      <CreditCard size={28} color="hsl(0, 0%, 60%)" />
    </View>
    <Text className="text-center text-base font-bold text-foreground">No payments found</Text>
    <Text className="text-center text-sm text-mutedForeground">
      {filter === 'all' ? "You haven't made any payments yet." : `No ${filter} payments to show.`}
    </Text>
  </View>
);

// ─── Error State ──────────────────────────────────────────────────────────────

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <View className="flex-1 items-center justify-center gap-4 px-8">
    <AlertCircle size={40} color="hsl(0, 83%, 49%)" />
    <Text className="text-center text-base font-bold text-foreground">Failed to load payments</Text>
    <Text className="text-center text-sm text-mutedForeground">
      Something went wrong. Please try again.
    </Text>
    <TouchableOpacity onPress={onRetry} className="rounded-2xl bg-primary px-6 py-3">
      <Text className="font-semibold text-primaryForeground">Retry</Text>
    </TouchableOpacity>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const MyPaymentsScreen = () => {
  const { top } = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterStatus>('all');

  const { data, isLoading, error, refetch, isFetching } = useGetMyPaymentsQuery();

  const payments: IPayment[] = data?.data ?? [];
  const filtered = filter === 'all' ? payments : payments.filter((p) => p.status === filter);

  const counts: Record<FilterStatus, number> = {
    all: payments.length,
    completed: payments.filter((p) => p.status === 'completed').length,
    pending: payments.filter((p) => p.status === 'pending').length,
    failed: payments.filter((p) => p.status === 'failed').length,
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top }}>
      {/* Header */}

      <ScreenHeader
        className="mb-2"
        title="My Payments"
        description="Track all your transaction history"
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="hsl(125, 70%, 33%)" />
          <Text className="text-sm text-mutedForeground">Loading payments…</Text>
        </View>
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          {payments.length > 0 && <SummaryBar payments={payments} />}

          <FilterTabs active={filter} onChange={setFilter} counts={counts} />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <PaymentCard item={item} />}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState filter={filter} />}
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

export default MyPaymentsScreen;
