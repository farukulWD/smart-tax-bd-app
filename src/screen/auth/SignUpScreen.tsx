import React, { Dispatch, SetStateAction, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Eye, EyeOff, Mail, Phone } from 'lucide-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Input } from '@/components/ui/input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Checkbox } from '@/components/ui/checkbox';
import { SCREEN_NAME, TAuth } from '@/src/types/authTypes';
import { Colors } from '@/src/context/ThemeProvider';
import { z } from 'zod';
import { useForm, Controller, Control, FieldPath, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterMutation } from '@/src/services/auth';
import { globalErrorHandler } from '@/src/services/globalErrorHandler';
import { toast } from '@/src/utils/ToastConfig';
import { useTranslation } from 'react-i18next';

// ─── Schema ───────────────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
    mobile: z
      .string()
      .regex(/^01[3-9]\d{8}$/, {
        message: 'Enter a valid Bangladeshi mobile number (e.g. 01712345678)',
      }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

// ─── FormField ────────────────────────────────────────────────────────────────

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  render: (props: {
    field: {
      onChange: (...event: unknown[]) => void;
      onBlur: () => void;
      value: unknown;
    };
  }) => React.ReactElement;
}

function FormField<T extends FieldValues>({
  control,
  name,
  render,
}: FormFieldProps<T>): React.ReactElement {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }): React.ReactElement => render({ field })}
    />
  );
}

// ─── FormItem ─────────────────────────────────────────────────────────────────

const FormItem = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <View className="gap-1">{children}</View>
);

// ─── FormControl ─────────────────────────────────────────────────────────────

const FormControl = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <View>{children}</View>
);

// ─── FormMessage ─────────────────────────────────────────────────────────────

const FormMessage = ({ message }: { message?: string }): React.ReactElement | null => {
  if (!message) return null;
  return <Text className="ml-1 text-xs text-red-500">{message}</Text>;
};

// ─── SignUpScreen ─────────────────────────────────────────────────────────────

const SignUpScreen = ({
  setScreen,
  setAuthMobile,
}: {
  setScreen: Dispatch<SetStateAction<TAuth>>;
  setAuthMobile: Dispatch<SetStateAction<string>>;
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...payload } = data;
      const res = await register(payload).unwrap();
      if (res) {
        console.log('res.data', JSON.stringify(res.data, null, 2));
        toast.success(t('auth.otpSent'));
        setAuthMobile(data.mobile || res.data.mobile);
        form.reset();
        setScreen(SCREEN_NAME.VERIFY_USER);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      globalErrorHandler(error);
    }
  };

  const inputClass = 'h-12 w-full rounded-lg border border-border bg-card px-4 text-foreground';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-background">
          {/* Header */}
          <View className="items-center px-4 pb-6 pt-8">
            <Text variant="h3">{t('auth.softwareSlogan')}</Text>
            <Text className="text-mutedForeground">{t('auth.createAccountSlogan')}</Text>
          </View>

          {/* Form */}
          <View className="mb-6 gap-4 px-5">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className={inputClass}
                      placeholder={t('auth.fullNamePlaceholder')}
                      placeholderTextColor={Colors.mutedForeground}
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

            {/* Phone */}
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className={inputClass}
                      placeholder={t('auth.mobilePlaceholder')}
                      placeholderTextColor={Colors.mutedForeground}
                      value={field.value as string}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      keyboardType="phone-pad"
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
                  <FormControl>
                    <Input
                      className={inputClass}
                      placeholder={t('auth.emailPlaceholder')}
                      placeholderTextColor={Colors.mutedForeground}
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
                  <FormControl>
                    <View className="relative justify-center">
                      <Input
                        className={inputClass}
                        placeholder={t('auth.passwordPlaceholder')}
                        placeholderTextColor={Colors.mutedForeground}
                        value={field.value as string}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword((p) => !p)}
                        className="absolute right-3"
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        {showPassword ? (
                          <Eye size={20} color={Colors.mutedForeground} />
                        ) : (
                          <EyeOff size={20} color={Colors.mutedForeground} />
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
                  <FormControl>
                    <View className="relative justify-center">
                      <Input
                        className={inputClass}
                        placeholder={t('auth.confirmPasswordPlaceholder')}
                        placeholderTextColor={Colors.mutedForeground}
                        value={field.value as string}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword((p) => !p)}
                        className="absolute right-3"
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        {showConfirmPassword ? (
                          <Eye size={20} color={Colors.mutedForeground} />
                        ) : (
                          <EyeOff size={20} color={Colors.mutedForeground} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </FormControl>
                  <FormMessage message={form.formState.errors.confirmPassword?.message} />
                </FormItem>
              )}
            />

            {/* Terms & Conditions */}
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <View className="flex-row items-start gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value as boolean}
                        onCheckedChange={field.onChange}
                        className="mt-0.5 border-border"
                      />
                    </FormControl>
                    <Text className="flex-1 text-sm leading-5 text-mutedForeground">
                      {t('auth.termsAndConditions')}
                    </Text>
                  </View>
                  <FormMessage message={form.formState.errors.terms?.message} />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <TouchableOpacity
              className="mb-4 w-full items-center rounded-lg bg-green-600 py-4"
              onPress={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              activeOpacity={0.8}>
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-center text-base font-bold text-white">
                  {t('auth.createAccountButton')}
                </Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View className="mb-6 flex-row items-center justify-center">
              <Text className="text-sm text-gray-600">{t('auth.signUpLink')} </Text>
              <TouchableOpacity onPress={() => setScreen(SCREEN_NAME.SIGNIN)}>
                <Text className="text-sm font-semibold text-green-600">
                  {t('auth.signUpLinkAction')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Contact Info */}
            <View className="mb-4 items-center gap-2">
              <View className="flex-row items-center">
                <Mail size={16} color={Colors.mutedForeground} />
                <Text className="ml-2 text-sm text-mutedForeground">support@smarttaxbd.com.bd</Text>
              </View>
              <View className="flex-row items-center">
                <Phone size={16} color={Colors.mutedForeground} />
                <Text className="ml-2 text-sm text-mutedForeground">01409-991225</Text>
              </View>
            </View>

            {/* Footer */}
            <View className="mb-6 px-4">
              <Text className="text-center text-xs leading-5 text-mutedForeground">
                {t('auth.copyright')}
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
