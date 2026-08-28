import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
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
const BOXES = Array.from({ length: OTP_LENGTH }, (_, i) => i);

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
  // One string, not six pieces of state: the code lives in a single hidden
  // TextInput so paste, SMS autofill and backspace are handled by the platform.
  const [otp, setOtp] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [timer, setTimer] = useState(RESEND_COOLDOWN);
  const inputRef = useRef<TextInput>(null);

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

  const handleOtpChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    // A paste lands after whatever is already in the field, so an overflow means
    // the tail is the pasted code — keep that and drop the stale prefix.
    setOtp(digits.length > OTP_LENGTH ? digits.slice(-OTP_LENGTH) : digits);
  };

  const handleVerify = async () => {
    try {
      if (verifyType === 'register') {
        await verifyRegisterOtp({ mobile, otp }).unwrap();
        toast.success(t('auth.otpVerified'));
        setOtp('');
        setTimer(RESEND_COOLDOWN);
        setScreen(SCREEN_NAME.SIGNIN);
      } else {
        const res = await verifyForgotOtp({ mobile, otp }).unwrap();
        setResetToken(res.data.resetToken);
        setOtp('');
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
      setOtp('');
      inputRef.current?.focus();
      toast.success(t('auth.otpSent'));
    } catch (error) {
      globalErrorHandler(error);
    }
  };

  const isOtpComplete = otp.length === OTP_LENGTH;
  const activeIndex = Math.min(otp.length, OTP_LENGTH - 1);

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

          {/* OTP boxes — display only; the real field is the hidden input on top */}
          <View className="gap-2">
            <Text className="text-center text-sm font-medium text-foreground">
              {t('auth.verificationCodeLabel')}
            </Text>

            <Pressable
              onPress={() => inputRef.current?.focus()}
              className="relative flex-row items-center justify-center gap-2">
              {BOXES.map((index) => {
                const digit = otp[index] ?? '';
                const isActive = isFocused && index === activeIndex;

                return (
                  <View
                    key={index}
                    className={`h-14 flex-1 items-center justify-center rounded-xl border-2 ${
                      isActive
                        ? 'border-primary bg-primary/5'
                        : digit
                          ? 'border-primary/40 bg-card'
                          : 'border-border bg-card'
                    }`}>
                    <Text
                      className="text-2xl font-bold leading-7 text-foreground"
                      style={{ includeFontPadding: false }}>
                      {digit}
                    </Text>
                  </View>
                );
              })}

              <TextInput
                ref={inputRef}
                value={otp}
                onChangeText={handleOtpChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                keyboardType="number-pad"
                // Room for a paste that arrives on top of typed digits; the
                // handler trims back down to OTP_LENGTH.
                maxLength={OTP_LENGTH * 2}
                textContentType="oneTimeCode"
                autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
                importantForAutofill="yes"
                autoFocus
                caretHidden
                // Invisible but still hit-testable: long-press anywhere on the
                // row opens the system Paste menu.
                style={{ opacity: 0 }}
                className="absolute left-0 top-0 h-full w-full text-center text-2xl"
              />
            </Pressable>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerifyOTPScreen;
