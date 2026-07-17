import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeOff, Eye } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { SCREEN_NAME, TAuth } from '@/src/types/authTypes';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useLoginMutation } from '@/src/services/auth';
import { globalErrorHandler } from '@/src/services/globalErrorHandler';
import { useAppDispatch } from '@/src/redux/hooks';
import { setCredentials } from '@/src/redux/slices/authSlice';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '@/src/navigation/AppStack';
import { navigateToStack, replace } from '@/src/utils/NavigationUtils';
import { useTranslation } from 'react-i18next';
import { BackButton } from '@/src/components/global/BackButton';

// ─── Schema ───────────────────────────────────────────────────────────────────

const createSignInSchema = (t: (key: string) => string) =>
  z.object({
    mobile: z.string().regex(/^01[3-9]\d{8}$/, { message: t('auth.mobileInvalid') }),
    password: z.string().min(6, { message: t('auth.passwordMin') }),
  });

export type SignInFormValues = z.infer<ReturnType<typeof createSignInSchema>>;

// ─── SignInScreen ─────────────────────────────────────────────────────────────

const SignInScreen = ({ setScreen }: { setScreen: Dispatch<SetStateAction<TAuth>> }) => {
  const { t } = useTranslation();
  const { colors } = useThemeColors();
  const route = useRoute<RouteProp<AppStackParamList, 'Auth'>>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const signInSchema = useMemo(() => createSignInSchema(t), [t]);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      mobile: '',
      password: '',
    },
  });

  const handleNavigation = () => {
    if (route?.params?.shouldGoBack) {
      return navigation.goBack();
    }

    if (route.params?.redirectTo) {
      if (route.params?.redirectTo.stack) {
        navigateToStack(route.params.redirectTo.stack, { screen: route.params.redirectTo.stack });
      } else {
        replace(route.params.redirectTo.screen);
      }
    }
  };

  const onSubmit = async (data: SignInFormValues) => {
    try {
      const res = await login({
        mobile: data.mobile,
        password: data.password,
      }).unwrap();

      dispatch(
        setCredentials({
          token: res.data.accessToken,
          user: res.data.user,
        })
      );
      handleNavigation();
    } catch (error) {
      globalErrorHandler(error);
    }
  };

  const inputClass =
    'h-14 w-full rounded-xl border border-border bg-card px-4 text-base text-foreground';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background">
      <View className="mx-4 mt-14">
        <BackButton onPress={() => navigation.goBack()} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-6">
          {/* Logo + Heading */}
          <View className="items-center pb-10">
            <Image
              resizeMode="contain"
              className="h-24 w-24"
              source={require('../../../assets/images/logo-small.png')}
            />
            <Text className="mt-5 text-3xl font-bold text-foreground">{t('auth.welcomeBack')}</Text>
            <Text className="mt-2 text-center text-base text-mutedForeground">
              {t('auth.welcomeBackDesc')}
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            {/* Mobile */}
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.mobileLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      className={inputClass}
                      placeholder={t('auth.mobileHint')}
                      placeholderTextColor={colors.mutedForeground}
                      value={field.value as string}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      keyboardType="number-pad"
                      autoCapitalize="none"
                    />
                  </FormControl>
                  <FormMessage message={form.formState.errors.mobile?.message} />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.passwordLabel')}</FormLabel>
                  <FormControl>
                    <View className="relative justify-center">
                      <Input
                        className={inputClass}
                        placeholder={t('auth.passwordLabel')}
                        placeholderTextColor={colors.mutedForeground}
                        value={field.value as string}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword((p) => !p)}
                        className="absolute right-4"
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        {showPassword ? (
                          <Eye size={20} color={colors.mutedForeground} />
                        ) : (
                          <EyeOff size={20} color={colors.mutedForeground} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </FormControl>
                  <FormMessage message={form.formState.errors.password?.message} />
                </FormItem>
              )}
            />

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => setScreen(SCREEN_NAME.FORGOT_PASSWORD)}
              className="self-end"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text className="text-sm font-semibold text-primary">
                {t('auth.forgotPasswordLink')}
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <Button
              onPress={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              className="mt-2 h-14 rounded-xl bg-primary">
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-base font-bold text-white">{t('auth.signInButton')}</Text>
              )}
            </Button>
          </View>
        </View>

        {/* Create Account */}
        <View className="flex-row items-center justify-center pb-8 pt-6">
          <Text className="text-sm text-mutedForeground">{t('auth.signUpLink')} </Text>
          <TouchableOpacity
            onPress={() => setScreen(SCREEN_NAME.SIGNUP)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text className="text-sm font-bold text-primary">{t('auth.signUpLinkAction')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;
