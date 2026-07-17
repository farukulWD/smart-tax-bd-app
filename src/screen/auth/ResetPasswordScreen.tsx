import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Eye, EyeOff, Lock } from 'lucide-react-native';
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
import { useResetPasswordMutation } from '@/src/services/auth';
import { globalErrorHandler } from '@/src/services/globalErrorHandler';
import { toast } from '@/src/utils/ToastConfig';
import { BackButton } from '@/src/components/global/BackButton';

const createResetPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      newPassword: z.string().min(6, { message: t('auth.passwordMin') }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('auth.passwordsMismatch'),
      path: ['confirmPassword'],
    });

export type ResetPasswordFormValues = z.infer<ReturnType<typeof createResetPasswordSchema>>;

const ResetPasswordScreen = ({
  setScreen,
  resetToken,
}: {
  setScreen: Dispatch<SetStateAction<TAuth>>;
  resetToken: string;
}) => {
  const { t } = useTranslation();
  const { colors } = useThemeColors();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const resetPasswordSchema = useMemo(() => createResetPasswordSchema(t), [t]);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await resetPassword({ resetToken, newPassword: data.newPassword }).unwrap();
      toast.success(t('auth.passwordResetSuccess'));
      form.reset();
      setScreen(SCREEN_NAME.SIGNIN);
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
              <Lock size={32} color={colors.mutedForeground} />
            </View>
            <Text className="mt-5 text-3xl font-bold text-foreground">
              {t('auth.resetPasswordTitle')}
            </Text>
            <Text className="mt-2 text-center text-base text-mutedForeground">
              {t('auth.resetPasswordDesc')}
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.newPasswordLabel')}</FormLabel>
                  <FormControl>
                    <View className="relative justify-center">
                      <Input
                        className={inputClass}
                        placeholder={t('auth.newPasswordLabel')}
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
                  <FormMessage message={form.formState.errors.newPassword?.message} />
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

            <Button
              onPress={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              className="mt-2 h-14 rounded-xl bg-primary">
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-base font-bold text-white">
                  {t('auth.resetPasswordButton')}
                </Text>
              )}
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;
