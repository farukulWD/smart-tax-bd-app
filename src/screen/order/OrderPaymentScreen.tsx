import { useRef, useState } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import AppText from '@/src/components/common/AppText';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '@/src/navigation/AppStack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProtectedScreen from '@/src/navigation/ProtectedScreen';
import { WebView } from 'react-native-webview';
import { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { navigateToStack } from '@/src/utils/NavigationUtils';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { getApiErrorMessage } from '@/src/services/globalErrorHandler';
import { usePaymentClosedMutation, usePaymentSuccessMutation } from '@/src/services/paymentApi';

type PaymentResult = 'success' | 'failed' | 'cancelled';

type ReturnUrl = { result: PaymentResult; transactionId: string };

const RESULT_BY_PATH: Record<string, PaymentResult> = {
  success: 'success',
  fail: 'failed',
  cancel: 'cancelled',
};

// The server sends EPS return URLs of the form
// `<client>/(success|fail|cancel)?tran_id=…`, and EPS appends its own fields.
// Only a URL with that exact last path segment and a `tran_id` counts, so EPS's
// own pages can never be mistaken for a result. Parsed by hand because React
// Native's URL implementation is incomplete.
const parseReturnUrl = (url: string): ReturnUrl | null => {
  const [beforeQuery, query = ''] = url.split('#')[0].split('?');
  const lastSegment = beforeQuery.replace(/\/+$/, '').split('/').pop() ?? '';
  const result = RESULT_BY_PATH[lastSegment.toLowerCase()];
  if (!result) return null;

  const match = query.match(/(?:^|&)tran_id=([^&]+)/);
  if (!match) return null;
  return { result, transactionId: decodeURIComponent(match[1]) };
};

const ResultModal = ({
  visible,
  result,
  message,
  transactionId,
  onGoToOrders,
  onViewPayments,
}: {
  visible: boolean;
  result: PaymentResult | null;
  message: string | null;
  transactionId: string | null;
  onGoToOrders: () => void;
  onViewPayments: () => void;
}) => {
  const { colors } = useThemeColors();
  const { t } = useTranslation();

  if (!result) return null;

  const config = {
    success: {
      icon: <CheckCircle2 size={56} color={colors.success} />,
      iconBg: 'bg-success/10',
      title: t('payment.resultSuccessTitle'),
      message: t('payment.resultSuccessMessage'),
      primaryBg: 'bg-success',
    },
    failed: {
      icon: <XCircle size={56} color={colors.destructive} />,
      iconBg: 'bg-destructive/10',
      title: t('payment.resultFailedTitle'),
      message: t('payment.resultFailedMessage'),
      primaryBg: 'bg-destructive',
    },
    cancelled: {
      icon: <AlertTriangle size={56} color={colors.warning} />,
      iconBg: 'bg-warning/10',
      title: t('payment.resultCancelledTitle'),
      message: t('payment.resultCancelledMessage'),
      primaryBg: 'bg-primary',
    },
  }[result];

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View className="flex-1 items-center justify-center bg-background px-6">
        <View className="w-full items-center rounded-3xl border border-border bg-card px-6 py-8">
          <View
            className={`h-24 w-24 rounded-full ${config.iconBg} mb-5 items-center justify-center`}>
            {config.icon}
          </View>

          <AppText className="mb-3 text-center text-xl font-bold text-foreground">
            {config.title}
          </AppText>

          <AppText className="mb-5 text-center text-sm leading-5 text-mutedForeground">
            {message || config.message}
          </AppText>

          {transactionId && (
            <View className="mb-6 w-full rounded-xl border border-border bg-muted px-4 py-2.5">
              <AppText className="text-center text-xs text-foreground">
                {t('payment.transactionId')}{' '}
                <AppText className="font-semibold text-primary">{transactionId}</AppText>
              </AppText>
            </View>
          )}

          <TouchableOpacity
            onPress={onGoToOrders}
            activeOpacity={0.85}
            className={`h-10 w-full justify-center ${config.primaryBg} mb-3 items-center rounded-2xl`}>
            <AppText className="text-base font-bold text-white">{t('payment.goToOrders')}</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onViewPayments}
            activeOpacity={0.75}
            className="h-10 w-full items-center justify-center rounded-2xl border border-border bg-muted">
            <AppText className="text-base font-semibold text-foreground">
              {t('payment.viewPayments')}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const OrderPaymentScreen = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'OrderPayment'>>();
  const navigation = useNavigation<any>();
  const gatewayUrl = route.params?.gatewayUrl;
  const taxId = route.params?.taxId;
  const { top } = useSafeAreaInsets();
  const { colors } = useThemeColors();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const resultHandled = useRef(false);

  const [paymentSuccess] = usePaymentSuccessMutation();
  const [paymentClosed] = usePaymentClosedMutation();

  const goToOrders = () => navigateToStack('ProfileStack', { screen: 'MyOrders' });
  const goToPayments = () => navigateToStack('ProfileStack', { screen: 'MyPayments' });
  const goHome = () => navigateToStack('HomeStack', { screen: 'Home' });

  // The redirect URL only says where EPS sent the user. The server asks EPS
  // for the real outcome, and that answer is what the user sees.
  const handleReturn = async ({ result, transactionId: tranId }: ReturnUrl) => {
    if (resultHandled.current) return;
    resultHandled.current = true;
    setTransactionId(tranId);

    if (result !== 'success') {
      paymentClosed({ tran_id: tranId, status: result === 'failed' ? 'fail' : 'cancel' });
      setPaymentResult(result);
      return;
    }

    setIsVerifying(true);
    try {
      await paymentSuccess({ tran_id: tranId }).unwrap();
      // Confirmed: go straight to the order-placed screen.
      if (taxId) {
        navigation.replace('OrderSuccess', { taxId });
        return;
      }
      setPaymentResult('success');
    } catch (error) {
      setResultMessage(getApiErrorMessage(error) || t('payment.notVerified'));
      setPaymentResult('failed');
    } finally {
      setIsVerifying(false);
    }
  };

  // Stops the WebView before it loads our return page, so the website never
  // renders inside the app and only the app talks to the server.
  const handleShouldStartLoad = (request: ShouldStartLoadRequest) => {
    const returnUrl = parseReturnUrl(request.url);
    if (!returnUrl) return true;
    handleReturn(returnUrl);
    return false;
  };

  if (!gatewayUrl) {
    return (
      <ProtectedScreen>
        <View
          style={{ paddingTop: top }}
          className="flex-1 items-center justify-center gap-4 bg-background px-6">
          <AppText className="text-center text-sm text-destructive">
            {t('payment.noPaymentUrl')}
          </AppText>
          <TouchableOpacity
            onPress={goHome}
            className="h-10 items-center justify-center rounded-2xl bg-primary px-6">
            <AppText className="font-semibold text-white">{t('payment.goHome')}</AppText>
          </TouchableOpacity>
        </View>
      </ProtectedScreen>
    );
  }

  const showOverlay = isLoading || isVerifying;

  return (
    <ProtectedScreen>
      <View style={{ flex: 1, paddingTop: top }} className="bg-background">
        <View className="flex-1">
          {!paymentResult && !isVerifying && (
            <WebView
              source={{ uri: gatewayUrl }}
              onShouldStartLoadWithRequest={handleShouldStartLoad}
              // Fallback for redirects that skip onShouldStartLoadWithRequest
              // on some Android versions.
              onNavigationStateChange={(navState) => {
                const returnUrl = parseReturnUrl(navState.url || '');
                if (returnUrl) handleReturn(returnUrl);
              }}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              javaScriptEnabled
              domStorageEnabled
            />
          )}

          {showOverlay && (
            <View className="absolute inset-0 items-center justify-center gap-3 bg-background">
              <ActivityIndicator size="large" color={colors.primary} />
              <AppText className="text-sm text-foreground">
                {isVerifying ? t('payment.verifying') : t('payment.loadingGateway')}
              </AppText>
            </View>
          )}

          {hasError && !paymentResult && (
            <View className="absolute inset-0 items-center justify-center gap-4 bg-background px-6">
              <XCircle size={40} color={colors.destructive} />
              <AppText className="text-base font-bold text-foreground">
                {t('payment.gatewayLoadFailedTitle')}
              </AppText>
              <AppText className="text-center text-sm text-mutedForeground">
                {t('payment.gatewayLoadFailedMessage')}
              </AppText>
              <TouchableOpacity
                onPress={goHome}
                className="h-10 items-center justify-center rounded-2xl bg-primary px-6">
                <AppText className="font-semibold text-white">{t('payment.goHome')}</AppText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ResultModal
        visible={!!paymentResult}
        result={paymentResult}
        message={resultMessage}
        transactionId={transactionId}
        onGoToOrders={goToOrders}
        onViewPayments={goToPayments}
      />
    </ProtectedScreen>
  );
};

export default OrderPaymentScreen;
