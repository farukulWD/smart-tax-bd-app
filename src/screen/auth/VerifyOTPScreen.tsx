import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, Phone } from 'lucide-react-native';
import { SCREEN_NAME, TAuth, TVerifyPurpose } from '@/src/types/authTypes';
import { Colors } from '@/src/context/ThemeProvider';
import { goBack } from '@/src/utils/NavigationUtils';
import { toast } from '@/src/utils/commonFunction';
import {
  useVerifyRegisterOtpMutation,
  useResendRegisterOtpMutation,
  useVerifyForgotOtpMutation,
  useForgotPasswordMutation,
} from '@/src/services/auth';
import { useTranslation } from 'react-i18next';

const RESEND_COOLDOWN = 240; // 4 minutes

const VerifyOTPScreen = ({
  setScreen,
  mobile,
  verifyType,
}: {
  setScreen: Dispatch<SetStateAction<TAuth>>;
  mobile: string;
  verifyType: TVerifyPurpose;
}) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const [verifyRegisterOtp, { isLoading: isVerifyingRegister }] =
    useVerifyRegisterOtpMutation();
  const [resendRegisterOtp, { isLoading: isResendingRegister }] =
    useResendRegisterOtpMutation();
  const [verifyForgotOtp, { isLoading: isVerifyingForgot }] =
    useVerifyForgotOtpMutation();
  const [forgotPassword, { isLoading: isResendingForgot }] =
    useForgotPasswordMutation();

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
    if (text && !/^\d+$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
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
      } else {
        const res = await verifyForgotOtp({ mobile, otp: otpCode }).unwrap();
        toast.success(res?.message ?? t('auth.otpVerified'));
      }
      setOtp(['', '', '', '', '', '']);
      setTimer(RESEND_COOLDOWN);
      setScreen(SCREEN_NAME.SIGNIN);
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
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      toast.success(t('auth.otpSent'));
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message ?? t('auth.resendFail'));
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-6">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => {
              goBack();
            }}
            className="mb-8 mt-12">
            <ArrowLeft size={24} color={Colors.foreground} />
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-8">
            <Text className="mb-3 text-3xl font-bold text-foreground">
              {t('auth.verifyOtpTitle')}
            </Text>
            <Text className="text-base leading-6 text-mutedForeground">
              {t('auth.verifyOtpDesc')}
              {'\n'}
              <Text className="font-semibold text-mutedForeground">
                {mobile || t('auth.mobileNumberDefault')}
              </Text>
            </Text>
          </View>

          {/* OTP Input Boxes */}
          <View className="mb-8">
            <View className="mb-4 flex-row justify-between">
              {otp.map((digit, index) => (
                <View
                  key={index}
                  className={`h-14 w-14 items-center justify-center rounded-xl border-2 ${
                    digit ? 'border-green-600 bg-green-50' : 'border-border bg-accent'
                  }`}>
                  <TextInput
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    className="h-full w-full text-center text-2xl font-bold text-foreground"
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(key, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Timer and Resend */}
          <View className="mb-8">
            {timer > 0 ? (
              <View className="flex-row items-center justify-center">
                <Text className="text-sm text-mutedForeground">
                  {t('auth.resendCodeIn')}{' '}
                  <Text className="font-semibold text-green-600">
                    {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                  </Text>
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center justify-center">
                <Text className="text-sm text-mutedForeground">{t('auth.didNotReceiveCode')} </Text>
                <TouchableOpacity onPress={handleResend} disabled={isResending}>
                  {isResending ? (
                    <ActivityIndicator color={Colors.primary} size="small" />
                  ) : (
                    <Text className="text-sm font-semibold text-green-600">{t('auth.resend')}</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            onPress={handleVerify}
            disabled={!isOtpComplete || isVerifying}
            className={`mb-6 rounded-xl py-4 ${
              isOtpComplete && !isVerifying ? 'bg-green-600' : 'bg-accent'
            }`}>
            {isVerifying ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-center text-base font-semibold text-white">
                {t('auth.verifyOtpButton')}
              </Text>
            )}
          </TouchableOpacity>

          {/* Help Text */}
          <View className="mb-6 rounded-xl border border-border bg-accent p-4">
            <Text className="text-center text-sm leading-5 text-accentForeground">
              {t('auth.verifyOtpHelp')}
            </Text>
          </View>

          {/* Spacer */}
          <View className="flex-1" />

          {/* Bottom Info */}
          <View className="items-center pb-8">
            <View className="mb-2 flex-row items-center">
              <Phone size={16} color={Colors.mutedForeground} />
              <Text className="ml-2 text-sm text-mutedForeground">support@smarttaxbd.com.bd</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerifyOTPScreen;
