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
import { showToast } from '@/src/utils/commonFunction';

// ─── Schema ───────────────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    mobile: z.string().min(11, { message: 'Phone number must be at least 11 characters' }),
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

const SignUpScreen = ({ setScreen }: { setScreen: Dispatch<SetStateAction<TAuth>> }) => {
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
      // Only include email if the user actually typed one —
      // sending an empty string causes a server-side Zod validation error.
      const res = await register(payload).unwrap();
      if (res) {
        showToast({ message: 'Your account created successfully' });
        form.reset();
        setScreen(SCREEN_NAME.SIGNIN);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      globalErrorHandler(error);
    }
  };

  const inputClass =
    'h-12 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 text-base text-card-foreground';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-background">
          {/* Header */}
          <View className="items-center px-4 pb-6 pt-8">
            <Text variant="h3">#1 Tax Software in Bangladesh</Text>
            <Text className="text-mutedForeground">Let's Create your Smart Tax BD account</Text>
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
                      placeholder="Full Name *"
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
                      placeholder="Phone Number *"
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
                      placeholder="Email Address"
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
                        placeholder="Password *"
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
                        placeholder="Confirm Password *"
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
                        className="mt-0.5 border-slate-300"
                      />
                    </FormControl>
                    <Text className="flex-1 text-sm leading-5 text-slate-600">
                      I agree to the{' '}
                      <Text className="font-semibold text-green-600">Terms of Service</Text> and{' '}
                      <Text className="font-semibold text-green-600">Privacy Policy</Text>
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
                <Text className="text-center text-base font-bold text-white">Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View className="mb-6 flex-row items-center justify-center">
              <Text className="text-sm text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={() => setScreen(SCREEN_NAME.SIGNIN)}>
                <Text className="text-sm font-semibold text-green-600">Log In here</Text>
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
