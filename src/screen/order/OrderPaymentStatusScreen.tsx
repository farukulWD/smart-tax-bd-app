import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
  Modal,
} from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  useGetTaxOrderByIdQuery,
  useInitTaxStepThreePaymentMutation,
  usePlaceManualOrderMutation,
} from '@/src/services/orderApi';
import { AppStackParamList } from '@/src/navigation/AppStack';
import { CheckCircle2, AlertCircle, ArrowLeft, CreditCard } from 'lucide-react-native';
import ProtectedScreen from '@/src/navigation/ProtectedScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LucideIcon from '@/src/components/common/LucideIcon';

// ─── helpers ────────────────────────────────────────────────────────────────

const formatBDT = (amount: number) =>
  new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT' }).format(amount);

// ─── sub-components ──────────────────────────────────────────────────────────

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row items-center justify-between border-b border-border py-3">
    <Text className="text-sm text-gray-400">{label}</Text>
    <View className="rounded-lg bg-gray-100 px-3 py-1">
      <Text className="text-sm font-semibold text-gray-700">{value}</Text>
    </View>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const OrderPaymentStatusScreen = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'OrderPaymentStatus'>>();
  const navigation = useNavigation<any>();
  const taxId = route.params?.taxId;
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();

  const [showBkashModal, setShowBkashModal] = useState(false);

  const { data, isLoading, isError, refetch } = useGetTaxOrderByIdQuery(taxId ?? skipToken);
  const [initTaxStepThreePayment, { isLoading: isStartingPayment }] =
    useInitTaxStepThreePaymentMutation();
  const [placeManualOrder, { isLoading: isPlacingOrder }] = usePlaceManualOrderMutation();

  // ── no taxId ──────────────────────────────────────────────────────────────

  if (!taxId) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-6">
        <Text className="mb-4 text-sm text-gray-400">{t('payment.noOrderSelected')}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateOrder')}
          className="rounded-2xl bg-indigo-600 px-6 py-3">
          <Text className="font-semibold text-white">{t('payment.createOrder')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── loading ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  // ── error ─────────────────────────────────────────────────────────────────

  if (isError || !data?.data?.tax_order) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-gray-50 px-6">
        <AlertCircle size={40} color="#ef4444" />
        <Text className="text-center text-sm text-red-500">
          {t('payment.failedToLoad')}
        </Text>
        <TouchableOpacity onPress={() => refetch()} className="rounded-2xl bg-indigo-600 px-6 py-3">
          <Text className="font-semibold text-white">{t('payment.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── data ──────────────────────────────────────────────────────────────────

  const order = data.data.tax_order;
  const isPaid = Number(order.fee_amount || 0) <= 0 || order.status === 'order_placed';

  const handlePlaceManualOrder = async () => {
    try {
      await placeManualOrder(taxId).unwrap();
      setShowBkashModal(false);
      navigation.replace('OrderSuccess', { taxId });
    } catch (error: any) {
      setShowBkashModal(false);
      const message =
        error?.data?.message || error?.data?.error || error?.message || 'Failed to place order';
      Alert.alert('Error', message);
    }
  };

  const handleStartPayment = async () => {
    try {
      const res = await initTaxStepThreePayment(taxId).unwrap();
      const gatewayUrl = res?.data?.gatewayPageURL;
      if (!gatewayUrl) {
        Alert.alert('Error', 'Payment link was not found');
        return;
      }
      const supported = await Linking.canOpenURL(gatewayUrl);
      if (supported) {
        // await Linking.openURL(gatewayUrl);
        navigation.navigate('OrderPayment', { gatewayUrl });
      } else {
        Alert.alert('Error', 'Cannot open payment gateway URL');
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.data?.error ||
        error?.message ||
        'Payment initialization failed';
      Alert.alert('Payment failed', message);
    }
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <ProtectedScreen>
      <View style={{ paddingTop: top }} className="flex-1 bg-background">
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold tracking-tight text-foreground">
              {t('payment.step3Title')}
            </Text>
            <Text className="mt-1 text-sm text-mutedForeground">
              {t('payment.step3Description')}
            </Text>
          </View>

          {/* Card */}
          <View className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            {/* Card header */}
            <View className="border-b border-border px-4 pb-3 pt-5">
              <Text className="text-base font-bold text-foreground">{t('payment.cardTitle')}</Text>
            </View>

            <View className="px-4 pb-4 pt-2">
              {/* Info rows */}
              <InfoRow label={t('payment.orderStatus')} value={order.status} />
              <InfoRow label={t('payment.currentStep')} value={String(order.current_step)} />
              <InfoRow label={t('payment.fee')} value={formatBDT(Number(order.fee_amount || 0))} />

              {/* Payment status banner */}
              {isPaid ? (
                <View className="mt-4 flex-row items-center gap-3 rounded-2xl border border-green-200 bg-green-50/10 px-4 py-3">
                  <CheckCircle2 size={20} color="#16a34a" />
                  <Text className="flex-1 text-sm font-semibold text-green-700">
                    {t('payment.paymentSuccessful')}
                  </Text>
                </View>
              ) : (
                <View className="mt-4 flex-row items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/10 px-4 py-3">
                  <AlertCircle size={20} color="#d97706" />
                  <Text className="flex-1 text-sm font-semibold text-amber-700">
                    {t('payment.paymentPending')}
                  </Text>
                </View>
              )}

              {/* Action buttons */}
              <View className="mt-5 gap-3">
                {!isPaid && (
                  <>
                    {/* Start Payment */}
                    <TouchableOpacity
                      onPress={() => setShowBkashModal(true)}
                      activeOpacity={0.8}
                      className="flex-row items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4">
                      <CreditCard size={18} color="#fff" />
                      <Text className="text-base font-bold text-white">{t('payment.startPayment')}</Text>
                    </TouchableOpacity>

                    {/* Refresh Status */}
                    <TouchableOpacity
                      onPress={() => refetch()}
                      activeOpacity={0.8}
                      className="flex-row items-center justify-center gap-2 rounded-2xl border border-border bg-muted py-4">
                      <LucideIcon name="RefreshCw" size={16} className="text-mutedForeground" />
                      <Text className="text-sm font-semibold text-mutedForeground">{t('payment.refreshStatus')}</Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* Back to Step 2 */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('RequireDocuments', { taxId })}
                  activeOpacity={0.7}
                  className="flex-row items-center justify-center gap-2 py-3">
                  <ArrowLeft size={15} color="#6366f1" />
                  <Text className="text-sm font-semibold text-indigo-600">{t('payment.backToStep2')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* bKash manual payment modal */}
        <Modal
          visible={showBkashModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowBkashModal(false)}>
          <View className="flex-1 items-center justify-center bg-black/50 px-6">
            <View className="w-full rounded-3xl bg-card px-6 pb-6 pt-8 shadow-lg">
              <Text className="mb-1 text-center text-lg font-bold text-foreground">
                {t('payment.bkashModalTitle')}
              </Text>
              <Text className="mb-6 text-center text-sm leading-5 text-mutedForeground">
                {t('payment.bkashModalDescription')}
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setShowBkashModal(false)}
                  className="flex-1 items-center rounded-2xl border border-border bg-muted py-3.5">
                  <Text className="text-sm font-semibold text-mutedForeground">{t('payment.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePlaceManualOrder}
                  disabled={isPlacingOrder}
                  className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5">
                  {isPlacingOrder ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : null}
                  <Text className="text-sm font-bold text-white">{t('payment.ok')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ProtectedScreen>
  );
};

export default OrderPaymentStatusScreen;
