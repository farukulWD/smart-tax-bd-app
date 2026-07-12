import React, { Dispatch, SetStateAction } from 'react';
import { View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Input } from '@/components/ui/input';
import { Phone } from 'lucide-react-native';
import { SCREEN_NAME, TAuth } from '@/src/types/authTypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '@/src/components/global/BackButton';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { Text } from '@/components/ui/text';
import { z } from 'zod';
import { useForm, Controller, Control, FieldPath, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForgotPasswordMutation } from '@/src/services/auth';
import { toast } from '@/src/utils/commonFunction';
import { useTranslation } from 'react-i18next';

const forgotPasswordSchema = z.object({
  mobile: z.string().min(1, { message: 'Mobile number is required' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

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

const FormItem = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <View className="gap-1">{children}</View>
);

const FormControl = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <View>{children}</View>
);

const FormMessage = ({ message }: { message?: string }): React.ReactElement | null => {
  if (!message) return null;
  return <Text className="ml-1 text-xs text-red-500">{message}</Text>;
};

// ─── ForgotPasswordScreen ─────────────────────────────────────────────────────

const ForgotPasswordScreen = ({
  setScreen,
  setAuthMobile,
}: {
  setScreen: Dispatch<SetStateAction<TAuth>>;
  setAuthMobile: Dispatch<SetStateAction<string>>;
}) => {
  const { t } = useTranslation();
  const { colors } = useThemeColors();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      mobile: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      const res = await forgotPassword({ mobile: data.mobile }).unwrap();
      if (res) {
        setAuthMobile(data.mobile);
        toast.success(res?.message ?? 'OTP sent to your mobile number');
        setScreen(SCREEN_NAME.VERIFY_USER);
      }
    } catch (error) {
      console.error('Forgot password failed:', error);
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message ?? 'Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
        <View className="flex-1 gap-4 px-6">
          {/* Back */}
          <BackButton onPress={() => setScreen(SCREEN_NAME.SIGNIN)} />

          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-foreground">
              {t('auth.forgotPasswordTitle')}
            </Text>
            <Text className="text-base leading-6 text-mutedForeground">
              {t('auth.forgotPasswordDesc')}
            </Text>
          </View>

          {/* Mobile Field */}
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <Text className="text-sm font-medium text-foreground">{t('auth.mobileLabel')}</Text>
                <FormControl>
                  <Input
                    placeholder={t('auth.mobilePlaceholder')}
                    value={field.value as string}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    keyboardType="phone-pad"
                    className="text-card-foreground h-12 rounded-lg border border-border bg-card px-4 text-base"
                  />
                </FormControl>
                <FormMessage message={t(form.formState.errors.mobile?.message || '')} />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <TouchableOpacity
            onPress={form.handleSubmit(onSubmit)}
            disabled={isLoading}
            activeOpacity={0.8}
            className="items-center rounded-xl bg-green-600 py-4">
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-center text-base font-semibold text-white">
                {t('auth.sendOtpButton')}
              </Text>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <View className="flex-row items-center justify-center">
            <Text className="text-sm text-mutedForeground">{t('auth.rememberPassword')} </Text>
            <TouchableOpacity onPress={() => setScreen(SCREEN_NAME.SIGNIN)}>
              <Text className="text-sm font-semibold text-green-600">{t('auth.signInTitle')}</Text>
            </TouchableOpacity>
          </View>

          {/* Spacer */}
          <View className="flex-1" />

          {/* Bottom Info */}
          <View className="items-center pb-8">
            <View className="flex-row items-center">
              <Phone size={16} color={colors.mutedForeground} />
              <Text className="ml-2 text-sm text-mutedForeground">support@smarttaxbd.com.bd</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
