import { View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import AppText from '@/src/components/common/AppText';
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
        <AppText className="text-lg font-bold text-foreground">Order Details</AppText>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        {selectedOrder && (
          <View className="gap-4">
            <View className="rounded-3xl border border-border bg-card p-5">
              <AppText className="mb-3 text-base font-bold text-foreground">
                Personal Information
              </AppText>
              <View className="gap-2">
                <AppText className="text-sm text-mutedForeground">
                  Name:{' '}
                  <AppText className="font-semibold text-foreground">
                    {selectedOrder.personal_information?.name || '\u2014'}
                  </AppText>
                </AppText>
                <AppText className="text-sm text-mutedForeground">
                  Email:{' '}
                  <AppText className="font-semibold text-foreground">
                    {selectedOrder.personal_information?.email || '\u2014'}
                  </AppText>
                </AppText>
                <AppText className="text-sm text-mutedForeground">
                  Phone:{' '}
                  <AppText className="font-semibold text-foreground">
                    {selectedOrder.personal_information?.phone || '\u2014'}
                  </AppText>
                </AppText>
              </View>
            </View>

            <View className="rounded-3xl border border-border bg-card p-5">
              <AppText className="mb-3 text-base font-bold text-foreground">Order Info</AppText>
              <View className="gap-2">
                <AppText className="text-sm text-mutedForeground">
                  Tax Year:{' '}
                  <AppText className="font-semibold text-foreground">
                    {selectedOrder.tax_year || '\u2014'}
                  </AppText>
                </AppText>
                <AppText className="text-sm text-mutedForeground">
                  Status:{' '}
                  <AppText className="font-semibold text-foreground">
                    {formatStatus(selectedOrder.status)}
                  </AppText>
                </AppText>
                <AppText className="text-sm text-mutedForeground">
                  Fee:{' '}
                  <AppText className="font-semibold text-foreground">
                    {formatAmount(selectedOrder.fee_amount)}
                  </AppText>
                </AppText>
                <AppText className="text-sm text-mutedForeground">
                  Total:{' '}
                  <AppText className="font-semibold text-foreground">
                    {formatAmount(selectedOrder.total_amount)}
                  </AppText>
                </AppText>
                <AppText className="text-sm text-mutedForeground">
                  Created:{' '}
                  <AppText className="font-semibold text-foreground">
                    {formatDate(selectedOrder.createdAt)}
                  </AppText>
                </AppText>
              </View>
            </View>

            {selectedOrder.source_of_income?.length > 0 && (
              <View className="rounded-3xl border border-border bg-card p-5">
                <AppText className="mb-3 text-base font-bold text-foreground">
                  Source of Income
                </AppText>
                <View className="flex-row flex-wrap gap-1.5">
                  {selectedOrder.source_of_income.map((src) => (
                    <View key={src} className="rounded-lg bg-muted px-3 py-1.5">
                      <AppText className="text-xs text-mutedForeground">{src}</AppText>
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
            className="h-12 flex-row items-center justify-center gap-2 rounded-2xl bg-primary">
            <AppText className="text-base font-bold text-white">Start Payment</AppText>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.7}
        className="flex-row items-center justify-center py-3">
        <AppText className="text-sm font-semibold text-mutedForeground">Close</AppText>
      </TouchableOpacity>
    </SafeAreaView>
  </Modal>
);
