import { View, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal } from 'react-native';
import AppText from '@/src/components/common/AppText';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetTaxOrderByIdQuery, usePlaceManualOrderMutation } from '@/src/services/orderApi';
import { AppStackParamList } from '@/src/navigation/AppStack';
import { CheckCircle2, AlertCircle, ArrowLeft, CreditCard } from 'lucide-react-native';
import ProtectedScreen from '@/src/navigation/ProtectedScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LucideIcon from '@/src/components/common/LucideIcon';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { BackButton } from '@/src/components/global/BackButton';

// ─── helpers ────────────────────────────────────────────────────────────────

const formatBDT = (amount: number) =>
  new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT' }).format(amount);

// ─── sub-components ──────────────────────────────────────────────────────────

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row items-center justify-between border-b border-border py-3">
    <AppText className="text-sm text-mutedForeground">{label}</AppText>
    <View className="rounded-lg bg-muted px-3 py-1">
      <AppText className="text-sm font-semibold text-foreground">{value}</AppText>
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
  const { colors } = useThemeColors();

  const [showBkashModal, setShowBkashModal] = useState(false);

  const { data, isLoading, isError, refetch } = useGetTaxOrderByIdQuery(taxId ?? skipToken);
  const [placeManualOrder, { isLoading: isPlacingOrder }] = usePlaceManualOrderMutation();

  // ── no taxId ──────────────────────────────────────────────────────────────

  if (!taxId) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <AppText className="mb-4 text-sm text-mutedForeground">
          {t('payment.noOrderSelected')}
        </AppText>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateOrder')}
          className="h-10 items-center justify-center rounded-2xl bg-primary px-6">
          <AppText className="font-semibold text-white">{t('payment.createOrder')}</AppText>
        </TouchableOpacity>
      </View>
    );
  }

  // ── loading ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // ── error ─────────────────────────────────────────────────────────────────

  if (isError || !data?.data?.tax_order) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
        <AlertCircle size={40} color={colors.destructive} />
        <AppText className="text-center text-sm text-destructive">
          {t('payment.failedToLoad')}
        </AppText>
        <TouchableOpacity
          onPress={() => refetch()}
          className="h-10 items-center justify-center rounded-2xl bg-primary px-6">
          <AppText className="font-semibold text-white">{t('payment.retry')}</AppText>
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

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <ProtectedScreen>
      <View style={{ paddingTop: top }} className="flex-1 bg-background">
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="mb-6">
            <View className="flex-row items-center gap-3">
              {route.params.canGoBack && <BackButton />}
              <AppText className="text-2xl font-bold tracking-tight text-foreground">
                {t('payment.step3Title')}
              </AppText>
            </View>
            <AppText className="mt-1 text-sm text-mutedForeground">
              {t('payment.step3Description')}
            </AppText>
          </View>

          {/* Card */}
          <View className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            {/* Card header */}
            <View className="border-b border-border px-4 pb-3 pt-5">
              <AppText className="text-base font-bold text-foreground">
                {t('payment.cardTitle')}
              </AppText>
            </View>

            <View className="px-4 pb-4 pt-2">
              {/* Info rows */}
              <InfoRow label={t('payment.orderStatus')} value={order.status} />
              <InfoRow label={t('payment.currentStep')} value={String(order.current_step)} />
              <InfoRow label={t('payment.fee')} value={formatBDT(Number(order.fee_amount || 0))} />

              {/* Payment status banner */}
              {isPaid ? (
                <View className="mt-4 flex-row items-center gap-3 rounded-2xl border border-success/30 bg-success/10 px-4 py-3">
                  <CheckCircle2 size={20} color={colors.success} />
                  <AppText className="flex-1 text-sm font-semibold text-success">
                    {t('payment.paymentSuccessful')}
                  </AppText>
                </View>
              ) : (
                <View className="mt-4 flex-row items-center gap-3 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3">
                  <AlertCircle size={20} color={colors.warning} />
                  <AppText className="flex-1 text-sm font-semibold text-warning">
                    {t('payment.paymentPending')}
                  </AppText>
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
                      className="h-10 flex-row items-center justify-center gap-2 rounded-2xl bg-primary">
                      <CreditCard size={18} color="#fff" />
                      <AppText className="text-base font-bold text-white">
                        {t('payment.startPayment')}
                      </AppText>
                    </TouchableOpacity>

                    {/* Refresh Status */}
                    <TouchableOpacity
                      onPress={() => refetch()}
                      activeOpacity={0.8}
                      className="h-10 flex-row items-center justify-center gap-2 rounded-2xl border border-border bg-muted">
                      <LucideIcon name="RefreshCw" size={16} className="text-mutedForeground" />
                      <AppText className="text-sm font-semibold text-mutedForeground">
                        {t('payment.refreshStatus')}
                      </AppText>
                    </TouchableOpacity>
                  </>
                )}

                {/* Back to Step 2 */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('RequireDocuments', { taxId })}
                  activeOpacity={0.7}
                  className="flex-row items-center justify-center gap-2 py-3">
                  <ArrowLeft size={15} color={colors.primary} />
                  <AppText className="text-sm font-semibold text-primary">
                    {t('payment.backToStep2')}
                  </AppText>
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
              <AppText className="mb-1 text-center text-lg font-bold text-foreground">
                {t('payment.bkashModalTitle')}
              </AppText>
              <AppText className="mb-6 text-center text-sm leading-5 text-mutedForeground">
                {t('payment.bkashModalDescription')}
              </AppText>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setShowBkashModal(false)}
                  className="h-10 flex-1 items-center justify-center rounded-2xl border border-border bg-muted">
                  <AppText className="text-sm font-semibold text-mutedForeground">
                    {t('payment.cancel')}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePlaceManualOrder}
                  disabled={isPlacingOrder}
                  className="h-10 flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-primary">
                  {isPlacingOrder ? <ActivityIndicator size="small" color="#fff" /> : null}
                  <AppText className="text-sm font-bold text-white">{t('payment.ok')}</AppText>
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
