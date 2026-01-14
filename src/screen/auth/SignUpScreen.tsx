import React, { Dispatch, SetStateAction, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Eye, EyeOff, Mail, Phone } from 'lucide-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Input } from '@/components/ui/input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { SCREEN_NAME, TAuth } from '@/src/types/authTypes';
import useAuthInfo from '@/src/hook/useAuthInfo';
import { Colors } from '@/src/context/ThemeProvider';

const SignUpScreen = ({ setScreen }: { setScreen: Dispatch<SetStateAction<TAuth>> }) => {
  const { handleAuthInfo } = useAuthInfo();
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    etin: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });

  const handleInputChange = (field: string, value: string) => {
    if (field === 'email') {
      handleAuthInfo('email', value);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-background">
          {/* Header */}
          <View className="items-center px-4 pb-6 pt-8">
            <Text variant={'h3'}>#1 Tax Software in Bangladesh</Text>
            <Text className="text-mutedForeground">Let's Create your smarttaxbd account</Text>
          </View>

          {/* Form */}
          <View className="gap-3 px-5">
            {/* First Name */}
            <Input
              className="h-12 w-full rounded-lg border border-border bg-card px-4 text-base text-card-foreground"
              placeholder="First Name *"
              placeholderTextColor={Colors.mutedForeground}
              value={formData.firstName}
              onChangeText={(text) => handleInputChange('firstName', text)}
            />

            {/* Last Name */}
            <Input
              className="h-12 w-full rounded-lg border border-border bg-card px-4 text-base text-card-foreground"
              placeholder="Last Name *"
              placeholderTextColor={Colors.mutedForeground}
              value={formData.lastName}
              onChangeText={(text) => handleInputChange('lastName', text)}
            />

            {/* ETIN */}
            <Input
              className="h-12 w-full rounded-lg border border-border bg-card px-4 text-base text-card-foreground"
              placeholder="ETIN *"
              placeholderTextColor={Colors.mutedForeground}
              value={formData.etin}
              onChangeText={(text) => handleInputChange('etin', text)}
              keyboardType="numeric"
            />

            {/* Email */}
            <Input
              className="h-12 w-full rounded-lg border border-border bg-card px-4 text-base text-card-foreground"
              placeholder="Email *"
              placeholderTextColor={Colors.mutedForeground}
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/*Phone  */}
            <Input
              className="h-12 w-full rounded-lg border border-border bg-card px-4 text-base text-card-foreground"
              placeholder="Phone *"
              placeholderTextColor={Colors.mutedForeground}
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              keyboardType="phone-pad"
            />
            {/* Password */}
            <View className="relative justify-center">
              <Input
                className="h-12 w-full rounded-lg border border-border bg-card px-4 text-base text-card-foreground"
                placeholder="Password *"
                placeholderTextColor={Colors.mutedForeground}
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4">
                {showPassword ? (
                  <Eye size={20} color={Colors.mutedForeground} />
                ) : (
                  <EyeOff size={20} color={Colors.mutedForeground} />
                )}
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <View className="relative justify-center">
              <Input
                className="h-12 w-full rounded-lg border border-border bg-card px-4 text-base text-card-foreground"
                placeholder="Confirm Password *"
                placeholderTextColor={Colors.mutedForeground}
                value={formData.confirmPassword}
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4">
                {showConfirmPassword ? (
                  <Eye size={20} color={Colors.mutedForeground} />
                ) : (
                  <EyeOff size={20} color={Colors.mutedForeground} />
                )}
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <TouchableOpacity className="mb-4 w-full rounded-lg bg-green-600 py-4">
              <Text className="text-center text-base font-semibold text-white">Register</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View className="mb-6 flex-row items-center justify-center">
              <Text className="text-sm text-gray-600">Already have an account? </Text>
              <TouchableOpacity
                onPress={() => {
                  setScreen(SCREEN_NAME.SIGNIN);
                }}>
                <Text className="text-sm font-semibold text-green-600">Log In here</Text>
              </TouchableOpacity>
            </View>

            {/* Contact Info */}
            <View className="mb-4 items-center space-y-2">
              <View className="flex-row items-center">
                <Mail size={16} color={Colors.mutedForeground} />
                <Text className="text-mutedForeground ml-2 text-sm">support@smarttaxbd.com.bd</Text>
              </View>
              <View className="flex-row items-center">
                <Phone size={16} color={Colors.mutedForeground} />
                <Text className="text-mutedForeground ml-2 text-sm">01409-991225</Text>
              </View>
            </View>

            {/* Footer */}
            <View className="mb-6 px-4">
              <Text className="text-mutedForeground text-center text-xs leading-5">
                Mobile App is developed by Smart Tax BD Technology Ltd. smarttaxbd.com.bd is
                copyrighted by Bangladesh Copyright and Patent office. Copyright registration number
                is 14748-COPR.
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
