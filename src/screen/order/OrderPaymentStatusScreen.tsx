import { View, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal } from 'react-native';
import AppText from '@/src/components/common/AppText';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetTaxOrderByIdQuery, usePlaceManualOrderMutation } from '@/src/services/orderApi';
import { useApplyCouponMutation, useRemoveCouponMutation } from '@/src/services/couponApi';
import { Input } from '@/components/ui/input';
import { getApiErrorMessage } from '@/src/services/globalErrorHandler';
import { toast } from '@/src/utils/ToastConfig';
import { AppStackParamList } from '@/src/navigation/AppStack';
import {
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  CreditCard,
  TicketPercent,
  X,
} from 'lucide-react-native';
import ProtectedScreen from '@/src/navigation/ProtectedScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LucideIcon from '@/src/components/common/LucideIcon';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { BackButton } from '@/src/components/global/BackButton';
import { getStatusConfig } from '@/src/components/profile/orders/statusConfig';
import { getAppliedCoupon, getPayableFeeAmount } from '@/src/components/profile/orders/utils';

const formatBDT = (amount: number) =>
  new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT' }).format(amount);

const InfoRow = ({
  label,
  value,
  pillBg = 'bg-muted',
  pillText = 'text-foreground',
  icon,
}: {
  label: string;
  value: string;
  pillBg?: string;
  pillText?: string;
  icon?: React.ReactNode;
}) => (
  <View className="flex-row items-center justify-between border-b border-border py-3">
    <AppText className="text-sm text-mutedForeground">{label}</AppText>
    <View className={`flex-row items-center gap-1.5 rounded-lg px-3 py-1 ${pillBg}`}>
      {icon}
      <AppText className={`text-sm font-semibold ${pillText}`}>{value}</AppText>
    </View>
  </View>
);

const OrderPaymentStatusScreen = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'OrderPaymentStatus'>>();
  const navigation = useNavigation<any>();
  const taxId = route.params?.taxId;
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();
  const { colors } = useThemeColors();

  const [showBkashModal, setShowBkashModal] = useState(false);
  const [couponInput, setCouponInput] = useState('');

  const { data, isLoading, isError, refetch } = useGetTaxOrderByIdQuery(taxId ?? skipToken);
  const [placeManualOrder, { isLoading: isPlacingOrder }] = usePlaceManualOrderMutation();
  const [applyCoupon, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();
  const [removeCoupon, { isLoading: isRemovingCoupon }] = useRemoveCouponMutation();

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

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

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

  const order = data.data.tax_order;
  const appliedCoupon = getAppliedCoupon(order.applied_coupon);
  const subtotal = Number(order.fee_amount || 0);
  const discount = Number(appliedCoupon?.discount_amount || 0);
  const payableFee = getPayableFeeAmount(order);
  const isPaid = payableFee <= 0 || order.status === 'order_placed';
  const isCouponBusy = isApplyingCoupon || isRemovingCoupon;
  const statusConfig = getStatusConfig(order.status, colors, t);

  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;
    try {
      await applyCoupon({ taxId, code }).unwrap();
      setCouponInput('');
      toast.success(t('payment.couponApplied'));
    } catch (error) {
      toast.error(getApiErrorMessage(error) || t('payment.couponApplyFailed'));
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon(taxId).unwrap();
      toast.success(t('payment.couponRemoved'));
    } catch (error) {
      toast.error(getApiErrorMessage(error) || t('payment.couponRemoveFailed'));
    }
  };

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

  return (
    <ProtectedScreen>
      <View style={{ paddingTop: top }} className="flex-1 bg-background">
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}>
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

          <View className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <View className="border-b border-border px-4 pb-3 pt-5">
              <AppText className="text-base font-bold text-foreground">
                {t('payment.cardTitle')}
              </AppText>
            </View>

            <View className="px-4 pb-4 pt-2">
              <InfoRow
                label={t('payment.orderStatus')}
                value={statusConfig.label}
                pillBg={statusConfig.pillBg}
                pillText={statusConfig.pillText}
                icon={statusConfig.icon}
              />
              <InfoRow label={t('payment.currentStep')} value={String(order.current_step)} />

              {!isPaid && (
                <View className="py-3">
                  {appliedCoupon ? (
                    <View className="flex-row items-center justify-between gap-2 rounded-2xl border border-success/30 bg-success/10 px-4 py-3">
                      <View className="flex-1 flex-row items-center gap-2">
                        <TicketPercent size={18} color={colors.success} />
                        <AppText className="text-sm font-semibold text-success">
                          {appliedCoupon.code}
                        </AppText>
                      </View>
                      <TouchableOpacity
                        onPress={handleRemoveCoupon}
                        disabled={isCouponBusy}
                        activeOpacity={0.7}
                        className="flex-row items-center gap-1">
                        {isRemovingCoupon ? (
                          <ActivityIndicator size="small" color={colors.success} />
                        ) : (
                          <X size={16} color={colors.success} />
                        )}
                        <AppText className="text-sm font-semibold text-success">
                          {t('payment.removeCoupon')}
                        </AppText>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="flex-row items-center gap-2">
                      <Input
                        value={couponInput}
                        onChangeText={setCouponInput}
                        placeholder={t('payment.couponPlaceholder')}
                        autoCapitalize="characters"
                        editable={!isCouponBusy}
                        className="flex-1"
                      />
                      <TouchableOpacity
                        onPress={handleApplyCoupon}
                        disabled={isCouponBusy || !couponInput.trim()}
                        activeOpacity={0.8}
                        className={`h-10 flex-row items-center justify-center gap-2 rounded-2xl border border-border bg-muted px-4 ${
                          isCouponBusy || !couponInput.trim() ? 'opacity-50' : ''
                        }`}>
                        {isApplyingCoupon ? (
                          <ActivityIndicator size="small" color={colors.primary} />
                        ) : null}
                        <AppText className="text-sm font-semibold text-primary">
                          {t('payment.applyCoupon')}
                        </AppText>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

              <InfoRow label={t('payment.subtotal')} value={formatBDT(subtotal)} />
              {discount > 0 && (
                <InfoRow
                  label={
                    appliedCoupon?.code
                      ? `${t('payment.discount')} (${appliedCoupon.code})`
                      : t('payment.discount')
                  }
                  value={`−${formatBDT(discount)}`}
                  pillBg="bg-success/10"
                  pillText="text-success"
                />
              )}
              <InfoRow label={t('payment.total')} value={formatBDT(payableFee)} />

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

              <View className="mt-5 gap-3">
                {!isPaid && (
                  <>
                    <TouchableOpacity
                      onPress={() => setShowBkashModal(true)}
                      activeOpacity={0.8}
                      className="h-10 flex-row items-center justify-center gap-2 rounded-2xl bg-primary">
                      <CreditCard size={18} color="#fff" />
                      <AppText className="text-base font-bold text-white">
                        {t('payment.startPayment')}
                      </AppText>
                    </TouchableOpacity>

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

                <TouchableOpacity
                  onPress={() => navigation.popTo('RequireDocuments', { taxId })}
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
