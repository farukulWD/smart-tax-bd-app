import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { SCREEN_NAME, TAuth } from '@/src/types/authTypes';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { useRegisterMutation } from '@/src/services/auth';
import { globalErrorHandler } from '@/src/services/globalErrorHandler';
import { toast } from '@/src/utils/ToastConfig';

// ─── Schema ───────────────────────────────────────────────────────────────────

const createRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z.string().min(2, { message: t('auth.nameMin') }),
      email: z.string().email({ message: t('auth.emailInvalid') }).optional().or(z.literal('')),
      mobile: z.string().regex(/^01[3-9]\d{8}$/, { message: t('auth.mobileInvalid') }),
      password: z.string().min(6, { message: t('auth.passwordMin') }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.passwordsMismatch'),
      path: ['confirmPassword'],
    });

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;

// ─── SignUpScreen ─────────────────────────────────────────────────────────────

const SignUpScreen = ({
  setScreen,
  setAuthMobile,
}: {
  setScreen: Dispatch<SetStateAction<TAuth>>;
  setAuthMobile: Dispatch<SetStateAction<string>>;
}) => {
  const { t } = useTranslation();
  const { colors } = useThemeColors();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();

  const registerSchema = useMemo(() => createRegisterSchema(t), [t]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...payload } = data;
      const res = await register(payload).unwrap();
      if (res) {
        toast.success(t('auth.otpSent'));
        setAuthMobile(data.mobile || res.data.mobile);
        form.reset();
        setScreen(SCREEN_NAME.VERIFY_USER);
      }
    } catch (error) {
      globalErrorHandler(error);
    }
  };

  const inputClass =
    'h-14 w-full rounded-xl border border-border bg-card px-4 text-base text-foreground';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-6 pt-6">
          {/* Header */}
          <View className="items-center pb-8">
            <Image
              resizeMode="contain"
              className="h-24 w-24"
              source={require('../../../assets/images/logo-small.png')}
            />
            <Text className="mt-5 text-3xl font-bold text-foreground">
              {t('auth.signUpTitle')}
            </Text>
            <Text className="mt-2 text-center text-base text-mutedForeground">
              {t('auth.createAccountDesc')}
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.fullNameLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      className={inputClass}
                      placeholder={t('auth.fullNameHint')}
                      placeholderTextColor={colors.mutedForeground}
                      value={field.value as string}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      autoCapitalize="words"
                    />
                  </FormControl>
                  <FormMessage message={form.formState.errors.name?.message} />
                </FormItem>
              )}
            />

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
                      placeholder={t('auth.mobileHintFull')}
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

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.emailLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      className={inputClass}
                      placeholder={t('auth.emailHint')}
                      placeholderTextColor={colors.mutedForeground}
                      value={field.value as string}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </FormControl>
                  <FormMessage message={form.formState.errors.email?.message} />
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

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.confirmPasswordLabel')}</FormLabel>
                  <FormControl>
                    <View className="relative justify-center">
                      <Input
                        className={inputClass}
                        placeholder={t('auth.confirmPasswordLabel')}
                        placeholderTextColor={colors.mutedForeground}
                        value={field.value as string}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword((p) => !p)}
                        className="absolute right-4"
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        {showConfirmPassword ? (
                          <Eye size={20} color={colors.mutedForeground} />
                        ) : (
                          <EyeOff size={20} color={colors.mutedForeground} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </FormControl>
                  <FormMessage message={form.formState.errors.confirmPassword?.message} />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              onPress={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              className="mt-2 h-14 rounded-xl bg-primary">
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-base font-bold text-white">
                  {t('auth.createAccountButton')}
                </Text>
              )}
            </Button>

            {/* Terms consent */}
            <Text className="px-2 text-center text-xs leading-5 text-mutedForeground">
              {t('auth.termsConsent')}
            </Text>
          </View>
        </View>

        {/* Login Link */}
        <View className="flex-row items-center justify-center pb-8 pt-6">
          <Text className="text-sm text-mutedForeground">{t('auth.alreadyHaveAccount')} </Text>
          <TouchableOpacity
            onPress={() => setScreen(SCREEN_NAME.SIGNIN)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text className="text-sm font-bold text-primary">{t('auth.signInButton')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
