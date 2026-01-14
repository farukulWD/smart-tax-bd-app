import React, { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { SCREEN_NAME, TAuth } from '@/src/types/authTypes';
import { Colors } from '@/src/context/ThemeProvider';
import { goBack } from '@/src/utils/NavigationUtils';

const VerifyOTPScreen = ({ setScreen }: { setScreen: Dispatch<SetStateAction<TAuth>> }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (text: string, index: number) => {
    // Only allow numbers
    if (text && !/^\d+$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // Handle backspace
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join('');
    console.log('Verify OTP:', otpCode);
    setScreen(SCREEN_NAME.SIGNIN);
  };

  const handleResend = () => {
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    console.log('Resend OTP');
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
            <Text className="mb-3 text-3xl font-bold text-foreground">Verify OTP</Text>
            <Text className="text-mutedForeground text-base leading-6">
              We've sent a 6-digit verification code to{'\n'}
              <Text className="text-mutedForeground font-semibold">user@example.com</Text>
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
                <Text className="text-mutedForeground text-sm">
                  Resend code in <Text className="font-semibold text-green-600">{timer}s</Text>
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center justify-center">
                <Text className="text-mutedForeground text-sm">Didn't receive the code? </Text>
                <TouchableOpacity onPress={handleResend}>
                  <Text className="text-sm font-semibold text-green-600">Resend</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            onPress={handleVerify}
            disabled={!isOtpComplete}
            className={`mb-6 rounded-xl py-4 ${isOtpComplete ? 'bg-green-600' : 'bg-accent'}`}>
            <Text className="text-center text-base font-semibold text-white">Verify OTP</Text>
          </TouchableOpacity>

          {/* Help Text */}
          <View className="mb-6 rounded-xl border border-border bg-accent p-4">
            <Text className="text-accentForeground text-center text-sm leading-5">
              💡 Check your email inbox and spam folder for the verification code
            </Text>
          </View>

          {/* Spacer */}
          <View className="flex-1" />

          {/* Bottom Info */}
          <View className="items-center pb-8">
            <View className="mb-2 flex-row items-center">
              <Mail size={16} color={Colors.mutedForeground} />
              <Text className="text-mutedForeground ml-2 text-sm">support@smarttaxbd.com.bd</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerifyOTPScreen;
