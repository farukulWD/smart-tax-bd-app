import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IOrder } from '@/src/services/orderApi';
import { formatAmount, formatDate } from './utils';

const formatStatus = (status: string) =>
  status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export const OrderDetailModal = ({
  selectedOrder,
  onClose,
  onStartPayment,
}: {
  selectedOrder: IOrder | null;
  onClose: () => void;
  onStartPayment: (id: string) => void;
}) => (
  <Modal
    visible={!!selectedOrder}
    animationType="slide"
    transparent
    statusBarTranslucent
    onRequestClose={onClose}>
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between border-b border-border px-4 pb-3">
        <Text className="text-lg font-bold text-foreground">Order Details</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        {selectedOrder && (
          <View className="gap-4">
            <View className="rounded-3xl border border-border bg-card p-5">
              <Text className="mb-3 text-base font-bold text-foreground">Personal Information</Text>
              <View className="gap-2">
                <Text className="text-sm text-mutedForeground">
                  Name:{' '}
                  <Text className="font-semibold text-foreground">
                    {selectedOrder.personal_information?.name || '\u2014'}
                  </Text>
                </Text>
                <Text className="text-sm text-mutedForeground">
                  Email:{' '}
                  <Text className="font-semibold text-foreground">
                    {selectedOrder.personal_information?.email || '\u2014'}
                  </Text>
                </Text>
                <Text className="text-sm text-mutedForeground">
                  Phone:{' '}
                  <Text className="font-semibold text-foreground">
                    {selectedOrder.personal_information?.phone || '\u2014'}
                  </Text>
                </Text>
              </View>
            </View>

            <View className="rounded-3xl border border-border bg-card p-5">
              <Text className="mb-3 text-base font-bold text-foreground">Order Info</Text>
              <View className="gap-2">
                <Text className="text-sm text-mutedForeground">
                  Tax Year:{' '}
                  <Text className="font-semibold text-foreground">
                    {selectedOrder.tax_year || '\u2014'}
                  </Text>
                </Text>
                <Text className="text-sm text-mutedForeground">
                  Status:{' '}
                  <Text className="font-semibold text-foreground">
                    {formatStatus(selectedOrder.status)}
                  </Text>
                </Text>
                <Text className="text-sm text-mutedForeground">
                  Fee:{' '}
                  <Text className="font-semibold text-foreground">
                    {formatAmount(selectedOrder.fee_amount)}
                  </Text>
                </Text>
                <Text className="text-sm text-mutedForeground">
                  Total:{' '}
                  <Text className="font-semibold text-foreground">
                    {formatAmount(selectedOrder.total_amount)}
                  </Text>
                </Text>
                <Text className="text-sm text-mutedForeground">
                  Created:{' '}
                  <Text className="font-semibold text-foreground">
                    {formatDate(selectedOrder.createdAt)}
                  </Text>
                </Text>
              </View>
            </View>

            {selectedOrder.source_of_income?.length > 0 && (
              <View className="rounded-3xl border border-border bg-card p-5">
                <Text className="mb-3 text-base font-bold text-foreground">Source of Income</Text>
                <View className="flex-row flex-wrap gap-1.5">
                  {selectedOrder.source_of_income.map((src) => (
                    <View key={src} className="rounded-lg bg-muted px-3 py-1.5">
                      <Text className="text-xs text-mutedForeground">{src}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
      {selectedOrder && selectedOrder.status === 'payment_pending' && (
        <View className="mx-4 gap-2">
          <TouchableOpacity
            onPress={() => {
              const id = selectedOrder._id;
              onClose();
              if (id) onStartPayment(id);
            }}
            activeOpacity={0.8}
            className="flex-row items-center justify-center gap-2 rounded-2xl bg-primary py-4">
            <Text className="text-base font-bold text-white">Start Payment</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.7}
        className="flex-row items-center justify-center py-3">
        <Text className="text-sm font-semibold text-mutedForeground">Close</Text>
      </TouchableOpacity>
    </SafeAreaView>
  </Modal>
);
