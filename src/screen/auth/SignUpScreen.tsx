import { Dispatch, SetStateAction, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Image, TextInput } from 'react-native';
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
import { CONTROL_HEIGHT, INPUT_CLASS } from '@/src/constants/ui';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { SCREEN_NAME, TAuth } from '@/src/types/authTypes';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { useRegisterMutation } from '@/src/services/auth';
import { globalErrorHandler } from '@/src/services/globalErrorHandler';
import { toast } from '@/src/utils/ToastConfig';
import { normalizeEmail, normalizeMobile, trimLeading } from '@/src/utils/commonFunction';

const createRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(2, { message: t('auth.nameMin') }),
      email: z
        .string()
        .trim()
        .toLowerCase()
        .refine((value) => value === '' || z.string().email().safeParse(value).success, {
          message: t('auth.emailInvalid'),
        }),
      mobile: z
        .string()
        .trim()
        .regex(/^01[3-9]\d{8}$/, { message: t('auth.mobileInvalid') }),
      password: z
        .string()
        .trim()
        .min(4, { message: t('auth.passwordMin') }),
      confirmPassword: z.string().trim(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.passwordsMismatch'),
      path: ['confirmPassword'],
    });

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;

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

  const mobileRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

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

  const buildRegisterPayload = (data: RegisterFormValues) => {
    const name = data.name.trim().replace(/\s+/g, ' ');
    const mobile = normalizeMobile(data.mobile);
    const email = normalizeEmail(data.email ?? '');
    const password = data.password.trim();

    return email ? { name, mobile, password, email } : { name, mobile, password };
  };

  const onSubmit = async (data: RegisterFormValues) => {
    const payload = buildRegisterPayload(data);

    const check = registerSchema.safeParse({
      ...payload,
      email: payload.email ?? '',
      confirmPassword: payload.password,
    });
    if (!check.success) {
      toast.error(check.error.issues[0].message);
      return;
    }

    try {
      const res = await register(payload).unwrap();
      if (res) {
        toast.success(t('auth.otpSent'));
        setAuthMobile(payload.mobile || res?.data?.mobile || '');
        form.reset();
        setScreen(SCREEN_NAME.VERIFY_USER);
      }
    } catch (error) {
      globalErrorHandler(error);
    }
  };

  const inputClass = INPUT_CLASS;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-6 pt-6">
          <View className="items-center pb-8">
            <Image
              resizeMode="contain"
              className="h-24 w-24"
              source={require('../../../assets/images/logo-small.png')}
            />
            <Text className="mt-5 text-3xl font-bold text-foreground">{t('auth.signUpTitle')}</Text>
            <Text className="mt-2 text-center text-base text-mutedForeground">
              {t('auth.createAccountDesc')}
            </Text>
          </View>

          <View className="gap-4">
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
                      onChangeText={(text) => field.onChange(trimLeading(text))}
                      onBlur={() => {
                        field.onChange((field.value as string).trim());
                        field.onBlur();
                      }}
                      autoCapitalize="words"
                      returnKeyType="next"
                      submitBehavior="submit"
                      onSubmitEditing={() => mobileRef.current?.focus()}
                    />
                  </FormControl>
                  <FormMessage message={form.formState.errors.name?.message} />
                </FormItem>
              )}
            />

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
                      ref={mobileRef}
                      value={field.value as string}
                      onChangeText={(text) => field.onChange(normalizeMobile(text))}
                      onBlur={field.onBlur}
                      keyboardType="number-pad"
                      autoCapitalize="none"
                      returnKeyType="next"
                      submitBehavior="submit"
                      onSubmitEditing={() => emailRef.current?.focus()}
                    />
                  </FormControl>
                  <FormMessage message={form.formState.errors.mobile?.message} />
                </FormItem>
              )}
            />

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
                      ref={emailRef}
                      value={field.value as string}
                      onChangeText={(text) => field.onChange(normalizeEmail(text))}
                      onBlur={field.onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                      submitBehavior="submit"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                  </FormControl>
                  <FormMessage message={form.formState.errors.email?.message} />
                </FormItem>
              )}
            />

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
                        ref={passwordRef}
                        value={field.value as string}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        returnKeyType="next"
                        submitBehavior="submit"
                        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
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
                        ref={confirmPasswordRef}
                        value={field.value as string}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        returnKeyType="done"
                        onSubmitEditing={form.handleSubmit(onSubmit)}
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

            <Button
              onPress={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              className={`mt-2 ${CONTROL_HEIGHT} items-center justify-center rounded-xl bg-primary`}>
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-base font-bold text-white">
                  {t('auth.createAccountButton')}
                </Text>
              )}
            </Button>

            <Text className="px-2 text-center text-xs leading-5 text-mutedForeground">
              {t('auth.termsConsent')}
            </Text>
          </View>
        </View>

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
