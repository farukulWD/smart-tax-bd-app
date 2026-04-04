import React, { useRef, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Modal, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '@/src/navigation/AppStack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProtectedScreen from '@/src/navigation/ProtectedScreen';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react-native';
import { navigateToStack } from '@/src/utils/NavigationUtils';

// ─── types ───────────────────────────────────────────────────────────────────

type PaymentResult = 'success' | 'failed' | 'cancelled' | null;

const SUCCESS_PATTERNS = ['/success', '/payment-success', 'status=VALID', 'status=VALIDATED'];
const FAIL_PATTERNS = ['/fail', '/payment-fail', 'status=FAILED', 'status=INVALID'];
const CANCEL_PATTERNS = ['/cancel', '/payment-cancel', 'status=CANCELLED'];

const matchesAny = (url: string, patterns: string[]) =>
  patterns.some((p) => url.toLowerCase().includes(p.toLowerCase()));

const extractTransactionId = (url: string): string | null => {
  try {
    const params = new URL(url).searchParams;
    return params.get('tran_id') || params.get('transaction_id') || params.get('val_id') || null;
  } catch {
    return null;
  }
};

// ─── Result Modal ─────────────────────────────────────────────────────────────

const ResultModal = ({
  visible,
  result,
  transactionId,
  onGoToOrders,
  onViewPayments,
}: {
  visible: boolean;
  result: PaymentResult;
  transactionId: string | null;
  onGoToOrders: () => void;
  onViewPayments: () => void;
}) => {
  if (!result) return null;

  const config = {
    success: {
      icon: <CheckCircle2 size={56} color="#16a34a" />,
      iconBg: 'bg-green-50',
      title: 'Payment Successful',
      message: 'Your payment was completed successfully. Your order has been placed.',
      primaryBg: 'bg-green-600',
    },
    failed: {
      icon: <XCircle size={56} color="#dc2626" />,
      iconBg: 'bg-red-50',
      title: 'Payment Failed',
      message: 'Your payment could not be processed. Please try again from your orders.',
      primaryBg: 'bg-red-500',
    },
    cancelled: {
      icon: <AlertTriangle size={56} color="#f97316" />,
      iconBg: 'bg-orange-50',
      title: 'Payment Cancelled',
      message: 'You cancelled the payment. You can try again from your orders.',
      primaryBg: 'bg-green-600',
    },
  }[result];

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      {/* Backdrop */}
      <View className="flex-1 items-center justify-center bg-background px-6">
        {/* Card */}
        <View className="w-full items-center rounded-3xl border border-border bg-card px-6 py-8">
          {/* Icon circle */}
          <View
            className={`h-24 w-24 rounded-full ${config.iconBg} mb-5 items-center justify-center`}>
            {config.icon}
          </View>

          {/* Title */}
          <Text className="mb-3 text-center text-xl font-bold text-foreground">{config.title}</Text>

          {/* Message */}
          <Text className="mb-5 text-center text-sm leading-5 text-mutedForeground">
            {config.message}
          </Text>

          {/* Transaction ID */}
          {transactionId && (
            <View className="mb-6 w-full rounded-xl border border-border bg-muted px-4 py-2.5">
              <Text className="text-center text-xs text-foreground">
                Transaction ID:{' '}
                <Text className="font-semibold text-indigo-600">{transactionId}</Text>
              </Text>
            </View>
          )}

          {/* Go To Orders */}
          <TouchableOpacity
            onPress={onGoToOrders}
            activeOpacity={0.85}
            className={`w-full ${config.primaryBg} mb-3 items-center rounded-2xl py-4`}>
            <Text className="text-base font-bold text-white">Go To Orders</Text>
          </TouchableOpacity>

          {/* View Payments */}
          <TouchableOpacity
            onPress={onViewPayments}
            activeOpacity={0.75}
            className="w-full items-center rounded-2xl border border-border bg-muted py-4">
            <Text className="text-base font-semibold text-foreground">View Payments</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const OrderPaymentScreen = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'OrderPayment'>>();
  const gatewayUrl = route.params?.gatewayUrl;
  const { top } = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const resultHandled = useRef(false);

  const goHome = () => {
    setModalVisible(false);
    navigateToStack('HomeStack', { screen: 'Home' });
  };

  const showResult = (result: PaymentResult, url: string) => {
    if (resultHandled.current) return;
    resultHandled.current = true;
    setTransactionId(extractTransactionId(url));
    setPaymentResult(result);
    setModalVisible(true);
  };

  const handleNavigationChange = (navState: WebViewNavigation) => {
    const url = navState.url || '';
    if (matchesAny(url, SUCCESS_PATTERNS)) showResult('success', url);
    else if (matchesAny(url, FAIL_PATTERNS)) showResult('failed', url);
    else if (matchesAny(url, CANCEL_PATTERNS)) showResult('cancelled', url);
  };

  if (!gatewayUrl) {
    return (
      <ProtectedScreen redirectTo={{ screen: 'CreateTaxOrder' }}>
        <View
          style={{ paddingTop: top }}
          className="flex-1 items-center justify-center gap-4 bg-background px-6">
          <Text className="text-center text-sm text-red-500">No payment URL found.</Text>
          <TouchableOpacity onPress={goHome} className="rounded-2xl bg-indigo-600 px-6 py-3">
            <Text className="font-semibold text-white">Go to Home</Text>
          </TouchableOpacity>
        </View>
      </ProtectedScreen>
    );
  }

  return (
    <ProtectedScreen redirectTo={{ screen: 'CreateTaxOrder' }}>
      <View style={{ flex: 1, paddingTop: top }} className="bg-background">
        <View className="flex-1">
          {!modalVisible && (
            <WebView
              source={{ uri: gatewayUrl }}
              onNavigationStateChange={handleNavigationChange}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              javaScriptEnabled
              domStorageEnabled
              mixedContentMode="compatibility"
            />
          )}

          {/* Loading overlay */}
          {isLoading && (
            <View className="absolute inset-0 items-center justify-center gap-3 bg-background">
              <ActivityIndicator size="large" color="#6366f1" />
              <Text className="text-sm text-foreground">Loading payment gateway…</Text>
            </View>
          )}

          {/* Error overlay */}
          {hasError && (
            <View className="absolute inset-0 items-center justify-center gap-4 bg-background px-6">
              <XCircle size={40} color="#ef4444" />
              <Text className="text-base font-bold text-foreground">Failed to load</Text>
              <Text className="text-center text-sm text-mutedForeground">
                Could not load the payment gateway. Please check your connection.
              </Text>
              <TouchableOpacity onPress={goHome} className="rounded-2xl bg-indigo-600 px-6 py-3">
                <Text className="font-semibold text-white">Go to Home</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Result Modal */}
      <ResultModal
        visible={modalVisible}
        result={paymentResult}
        transactionId={transactionId}
        onGoToOrders={goHome}
        onViewPayments={goHome}
      />
    </ProtectedScreen>
  );
};

export default OrderPaymentScreen;
