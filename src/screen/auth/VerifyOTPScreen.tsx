import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MailCheck } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { CONTROL_HEIGHT } from '@/src/constants/ui';
import { SCREEN_NAME, TAuth, TVerifyPurpose } from '@/src/types/authTypes';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { BackButton } from '@/src/components/global/BackButton';
import { toast } from '@/src/utils/ToastConfig';
import { globalErrorHandler } from '@/src/services/globalErrorHandler';
import {
  useVerifyRegisterOtpMutation,
  useResendRegisterOtpMutation,
  useVerifyForgotOtpMutation,
  useForgotPasswordMutation,
} from '@/src/services/auth';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RESEND_COOLDOWN = 240; // 4 minutes
const OTP_LENGTH = 6;
const EMPTY_OTP = Array(OTP_LENGTH).fill('') as string[];

const VerifyOTPScreen = ({
  setScreen,
  mobile,
  verifyType,
  setResetToken,
}: {
  setScreen: Dispatch<SetStateAction<TAuth>>;
  mobile: string;
  verifyType: TVerifyPurpose;
  setResetToken: Dispatch<SetStateAction<string>>;
}) => {
  const { t } = useTranslation();
  const { colors } = useThemeColors();
  const [otp, setOtp] = useState<string[]>(EMPTY_OTP);
  const [timer, setTimer] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const [verifyRegisterOtp, { isLoading: isVerifyingRegister }] = useVerifyRegisterOtpMutation();
  const [resendRegisterOtp, { isLoading: isResendingRegister }] = useResendRegisterOtpMutation();
  const [verifyForgotOtp, { isLoading: isVerifyingForgot }] = useVerifyForgotOtpMutation();
  const [forgotPassword, { isLoading: isResendingForgot }] = useForgotPasswordMutation();

  const isVerifying = verifyType === 'register' ? isVerifyingRegister : isVerifyingForgot;
  const isResending = verifyType === 'register' ? isResendingRegister : isResendingForgot;

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (text: string, index: number) => {
    const digits = text.replace(/\D/g, '');

    if (!digits) {
      setOtp((prev) => {
        const next = [...prev];
        next[index] = '';
        return next;
      });
      return;
    }

    // A single keystroke advances one box; a paste or SMS autofill arrives as the
    // whole code at once and spreads across the remaining boxes. Android delivers
    // one autofill to several boxes, so a full-length code always starts at box 0
    // instead of at the box that happened to receive the event — otherwise the
    // delivery to a later box writes only its own digit and blanks the rest.
    const start = digits.length === OTP_LENGTH ? 0 : index;

    // Functional update: the duplicate autofill events fire before a re-render,
    // so a `[...otp]` copy would be stale on every call after the first.
    setOtp((prev) => {
      const next = [...prev];
      for (let i = 0; i < digits.length && start + i < OTP_LENGTH; i++) {
        next[start + i] = digits[i];
      }
      return next;
    });

    const nextIndex = Math.min(start + digits.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');

    try {
      if (verifyType === 'register') {
        await verifyRegisterOtp({ mobile, otp: otpCode }).unwrap();
        toast.success(t('auth.otpVerified'));
        setOtp(EMPTY_OTP);
        setTimer(RESEND_COOLDOWN);
        setScreen(SCREEN_NAME.SIGNIN);
      } else {
        const res = await verifyForgotOtp({ mobile, otp: otpCode }).unwrap();
        setResetToken(res.data.resetToken);
        setOtp(EMPTY_OTP);
        setTimer(RESEND_COOLDOWN);
        setScreen(SCREEN_NAME.RESET_PASSWORD);
      }
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message ?? t('auth.verifyFail'));
    }
  };

  const handleResend = async () => {
    if (!mobile) {
      toast.error(t('auth.mobileMissing'));
      setScreen(SCREEN_NAME.SIGNUP);
      return;
    }

    try {
      if (verifyType === 'register') {
        await resendRegisterOtp({ mobile }).unwrap();
      } else {
        await forgotPassword({ mobile }).unwrap();
      }
      setTimer(RESEND_COOLDOWN);
      setOtp(EMPTY_OTP);
      inputRefs.current[0]?.focus();
      toast.success(t('auth.otpSent'));
    } catch (error) {
      globalErrorHandler(error);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  const renderBox = (index: number) => (
    <View
      key={index}
      className={`h-10 flex-1 items-center justify-center rounded-xl border-2 ${
        otp[index] ? 'border-primary bg-primary/5' : 'border-border bg-card'
      }`}>
      <TextInput
        ref={(ref) => {
          inputRefs.current[index] = ref;
        }}
        className="h-full w-full text-center text-2xl font-bold text-foreground"
        value={otp[index]}
        onChangeText={(text) => handleOtpChange(text, index)}
        onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(key, index)}
        keyboardType="number-pad"
        // Not 1: iOS autofill and paste deliver all six digits to a single box,
        // and maxLength would clip them before handleOtpChange could spread them.
        maxLength={OTP_LENGTH}
        // Only the first box advertises itself to the autofill/SMS suggestion
        // strip. Marking all six makes the platform deliver the same code to
        // several of them, which fires redundant onChangeText events.
        textContentType={index === 0 ? 'oneTimeCode' : 'none'}
        autoComplete={
          index === 0 ? (Platform.OS === 'android' ? 'sms-otp' : 'one-time-code') : 'off'
        }
        importantForAutofill={index === 0 ? 'yes' : 'no'}
        selectTextOnFocus
        autoFocus={index === 0}
      />
    </View>
  );

  const { bottom } = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background">
      <View className="mx-4 mt-14">
        <BackButton
          onPress={() =>
            setScreen(
              verifyType === 'forgotPassword' ? SCREEN_NAME.FORGOT_PASSWORD : SCREEN_NAME.SIGNUP
            )
          }
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
        <View style={{ marginBottom: bottom }} className="flex-1 justify-start px-6">
          {/* Header */}
          <View className="items-center pb-10">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-muted">
              <MailCheck size={32} color={colors.mutedForeground} />
            </View>
            <Text className="mt-5 text-3xl font-bold text-foreground">
              {t('auth.verificationCodeTitle')}
            </Text>
            <Text className="mt-2 text-center text-base text-mutedForeground">
              {t('auth.verificationCodeDesc')}{' '}
              <Text className="font-semibold text-mutedForeground">
                {mobile || t('auth.mobileNumberDefault')}
              </Text>
            </Text>
          </View>

          {/* OTP boxes — 3 groups of 2 */}
          <View className="gap-1.5">
            <Text className="text-center text-sm font-medium text-foreground">
              {t('auth.verificationCodeLabel')}
            </Text>
            <View className="flex-row items-center justify-center gap-2">
              {[0, 2, 4].map((start) => (
                <View key={start} className="flex-1 flex-row items-center gap-2">
                  {renderBox(start)}
                  {renderBox(start + 1)}
                </View>
              ))}
            </View>
          </View>

          {/* Verify Button */}
          <Button
            onPress={handleVerify}
            disabled={!isOtpComplete || isVerifying}
            className={`mt-6 ${CONTROL_HEIGHT} items-center justify-center rounded-xl ${isOtpComplete ? 'bg-primary' : 'bg-muted'}`}>
            {isVerifying ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text
                className={`text-base font-bold ${
                  isOtpComplete ? 'text-white' : 'text-mutedForeground'
                }`}>
                {t('auth.verifyCodeButton')}
              </Text>
            )}
          </Button>
          <View className="flex-row items-center justify-center pb-20 pt-6">
            {timer > 0 ? (
              <Text className="text-sm text-mutedForeground">
                {t('auth.resendCodeIn')}{' '}
                <Text className="font-semibold text-primary">
                  {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                </Text>
              </Text>
            ) : (
              <>
                <Text className="text-sm text-mutedForeground">{t('auth.didNotGetCode')} </Text>
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={isResending}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  {isResending ? (
                    <ActivityIndicator color={colors.primary} size="small" />
                  ) : (
                    <Text className="text-sm font-bold text-primary">{t('auth.resend')}</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Resend */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerifyOTPScreen;
