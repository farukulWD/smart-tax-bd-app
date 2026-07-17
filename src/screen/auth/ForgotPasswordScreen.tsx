import { Dispatch, SetStateAction, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { KeyRound } from 'lucide-react-native';
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
import { useForgotPasswordMutation } from '@/src/services/auth';
import { globalErrorHandler } from '@/src/services/globalErrorHandler';
import { toast } from '@/src/utils/ToastConfig';
import { BackButton } from '@/src/components/global/BackButton';

const createForgotPasswordSchema = (t: (key: string) => string) =>
  z.object({
    mobile: z.string().regex(/^01[3-9]\d{8}$/, { message: t('auth.mobileInvalid') }),
  });

type ForgotPasswordFormValues = z.infer<ReturnType<typeof createForgotPasswordSchema>>;

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

  const forgotPasswordSchema = useMemo(() => createForgotPasswordSchema(t), [t]);

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
        toast.success(res?.message ?? t('auth.otpSent'));
        setScreen(SCREEN_NAME.VERIFY_USER);
      }
    } catch (error) {
      globalErrorHandler(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background">
      <View className="mx-4 mt-14">
        <BackButton onPress={() => setScreen(SCREEN_NAME.SIGNIN)} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <View className="items-center pb-10">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-muted">
              <KeyRound size={32} color={colors.mutedForeground} />
            </View>
            <Text className="mt-5 text-3xl font-bold text-foreground">
              {t('auth.forgotPasswordTitle')}
            </Text>
            <Text className="mt-2 text-center text-base leading-6 text-mutedForeground">
              {t('auth.forgotPasswordDesc')}
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.mobileLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      className="h-14 w-full rounded-xl border border-border bg-card px-4 text-base text-foreground"
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

            <Button
              onPress={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              className="mt-2 h-14 rounded-xl bg-primary">
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-base font-bold text-white">{t('auth.sendOtpButton')}</Text>
              )}
            </Button>
          </View>
        </View>

        {/* Back to Login */}
        <View className="flex-row items-center justify-center pb-8 pt-6">
          <Text className="text-sm text-mutedForeground">{t('auth.rememberedIt')} </Text>
          <TouchableOpacity
            onPress={() => setScreen(SCREEN_NAME.SIGNIN)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text className="text-sm font-bold text-primary">{t('auth.signInButton')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
