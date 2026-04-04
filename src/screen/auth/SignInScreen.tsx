import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Input } from '@/components/ui/input';
import { EyeOff, Eye, Home, Mail, Phone } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { SCREEN_NAME, TAuth } from '@/src/types/authTypes';
import { Colors } from '@/src/context/ThemeProvider';
import { useLoginMutation } from '@/src/services/auth';
import { useAppDispatch } from '@/src/redux/hooks';
import { setCredentials } from '@/src/redux/slices/authSlice';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '@/src/navigation/AppStack';
import { replace } from '@/src/utils/NavigationUtils';

const SignInScreen = ({ setScreen }: { setScreen: Dispatch<SetStateAction<TAuth>> }) => {
  const route = useRoute<RouteProp<AppStackParamList, 'Auth'>>();
  const [mobile, setMobile] = useState('01991002474');
  const [password, setPassword] = useState('123456aA@');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation();
  console.log('route', JSON.stringify(route, null, 2));

  const [login, { isLoading }] = useLoginMutation();

  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    try {
      const res = await login({
        mobile,
        password,
      }).unwrap();

      dispatch(
        setCredentials({
          token: res.data.accessToken,
          user: res.data.user,
        })
      );
      route?.params?.shouldGoBack && navigation.goBack();
      if (route.params?.redirectTo) {
        replace(route.params.redirectTo.screen);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-card">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-5">
          {/* Logo Section */}
          <View className="items-center pb-8 pt-16">
            <View className="h-28 w-28 items-center justify-center overflow-hidden rounded-full">
              <Image
                resizeMode="contain"
                className="h-full w-full"
                source={require('../../../assets/images/logo-small.png')}
              />
            </View>
            <Text className="text-base text-foreground">Easy | Accurate | Secure</Text>
          </View>

          {/* Form Section */}
          <View className="gap-3">
            {/* Mobile Input */}

            <Input
              placeholder="Enter your mobile number..."
              value={mobile}
              onChangeText={setMobile}
              keyboardType="number-pad"
              placeholderClassName="text-mutedForeground"
              autoCapitalize="none"
              className="h-12 w-full rounded-lg border border-border bg-card px-4 text-base text-foreground"
            />

            {/* Password Input */}
            <View className="relative justify-center">
              <Input
                className="h-12 w-full rounded-lg border border-border bg-card px-4 text-base text-foreground"
                placeholder="Password *"
                placeholderClassName="text-mutedForeground"
                value={password}
                onChangeText={setPassword}
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

            {/* Remember Me Checkbox */}
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                className="flex-row items-center">
                <View
                  className={`mr-2 h-6 w-6 items-center justify-center rounded border-2 ${
                    rememberMe ? 'border-green-600 bg-green-600' : 'border-border bg-accent'
                  }`}>
                  {rememberMe && <Text className="text-xs text-foreground">✓</Text>}
                </View>
                <Text className="text-base text-mutedForeground">Remember me</Text>
              </TouchableOpacity>
              {/* Forgot Password Link */}
              <TouchableOpacity
                onPress={() => {
                  setScreen(SCREEN_NAME.FORGOT_PASSWORD);
                }}
                className="items-center">
                <Text className="text-sm text-green-600">Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              className="h-12 flex-row items-center justify-center rounded-xl bg-green-600">
              <Home size={20} color="white" />
              <Text className="ml-2 text-center text-base font-semibold text-white">
                {isLoading ? 'Signing...' : 'Log In'}
              </Text>
            </TouchableOpacity>
            <View>
              {/* Create Account Link */}
              <View className="flex-row items-center justify-center">
                <Text className="text-sm text-mutedForeground">New to Smart Tax BD? </Text>
                <TouchableOpacity
                  onPress={() => {
                    setScreen(SCREEN_NAME.SIGNUP);
                  }}>
                  <Text className="text-sm font-semibold text-green-600">Create Account</Text>
                </TouchableOpacity>
              </View>

              {/* 100% Accurate Badge */}
              <View className="my-1 h-20 w-20 self-center overflow-hidden rounded-full">
                <Image
                  className="h-full w-full resize"
                  source={require('../../../assets/images/accuracy.jpg')}
                />
              </View>

              {/* Contact Info */}
              <View className="items-center">
                <View className="flex-row items-center">
                  <Mail size={16} color={Colors.mutedForeground} />
                  <Text className="ml-2 text-sm text-mutedForeground">
                    support@smarttaxbd.com.bd
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Phone size={16} color={Colors.mutedForeground} />
                  <Text className="ml-2 text-sm text-mutedForeground">01409-991225</Text>
                </View>
              </View>
            </View>

            {/* Footer Text */}
            <View className="px-2">
              <Text className="text-center text-xs leading-5 text-mutedForeground">
                Mobile App is developed by Smart Tax BD Technology Ltd. smarttaxbd.com.bd is
                copyrighted by Bangladesh Copyright and Patent office. Copyright registration number
                is 14748-COPR.
              </Text>
            </View>

            {/* Made in Bangladesh */}
            <View className="mb-2 flex-row items-center justify-center">
              <Text className="mr-2 text-sm text-mutedForeground">Made in</Text>
              <View className="h-6 w-6 items-center justify-center rounded bg-green-600">
                <View className="h-3 w-3 rounded-full bg-red-600" />
              </View>
            </View>

            {/* Terms & Conditions */}
            <TouchableOpacity className="mb-8 items-center">
              <Text className="text-sm text-green-600 underline">Terms & Conditions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;
