import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { SCREEN_NAME, TAuth } from '@/src/types/authTypes';
import useAuthInfo from '@/src/hook/useAuthInfo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '@/src/components/global/BackButton';
import { Colors } from '@/lib/theme';

const ForgotPasswordScreen = ({ setScreen }: { setScreen: Dispatch<SetStateAction<TAuth>> }) => {
  const { authInfo, handleAuthInfo } = useAuthInfo();
  const handleResetPassword = () => {
    // Handle password reset logic
    setScreen(SCREEN_NAME.VERIFY_USER);
    console.log('Reset password for:', authInfo.email);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
        <View className="flex-1 gap-4 px-6">
          <BackButton
            onPress={() => {
              setScreen(SCREEN_NAME.SIGNIN);
            }}
          />

          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-foreground">Forgot Password?</Text>
            <Text className="text-base leading-6 text-muted-foreground">
              Don't worry! Enter your email address and we'll send you instructions to reset your
              password.
            </Text>
          </View>

          {/* Email Input */}
          <View className="">
            <Text className="text-sm font-medium text-foreground">Email Address</Text>
            <Input
              placeholder="Enter your email"
              value={authInfo.email}
              onChangeText={(t) => {
                handleAuthInfo('email', t);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              className="h-12 rounded-lg border border-border bg-card px-4 text-base text-card-foreground"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity onPress={handleResetPassword} className="rounded-xl bg-green-600 py-4">
            <Text className="text-center text-base font-semibold text-white">Send Reset Link</Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <View className="flex-row items-center justify-center">
            <Text className="text-sm text-muted-foreground">Reme your password? </Text>
            <TouchableOpacity
              onPress={() => {
                setScreen(SCREEN_NAME.SIGNIN);
              }}>
              <Text className="text-sm font-semibold text-green-600">Log In</Text>
            </TouchableOpacity>
          </View>

          {/* Spacer to push content up */}
          <View className="flex-1" />

          {/* Bottom Info */}
          <View className="items-center pb-8">
            <View className="flex-row items-center">
              <Mail size={16} color={Colors.mutedForeground} />
              <Text className="ml-2 text-sm text-muted-foreground">support@smarttaxbd.com.bd</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
