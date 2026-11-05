import { useEffect } from 'react';
import { ActivityIndicator, BackHandler, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUpCircle } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useLocale } from '@/src/localization/useLocale';
import { useThemeColors } from '@/src/theme/useThemeColors';
import type { AppUpdateError } from '@/src/hook/useAppUpdate';

type ForceUpdateScreenProps = {
  availableVersionCode?: number;
  isStarting: boolean;
  isUpdateInProgress: boolean;
  error: AppUpdateError;
  onUpdate: () => void;
};

/**
 * Full-screen, non-dismissible fallback shown whenever a mandatory update is
 * pending. Rendered in place of the navigator, so no app route can be reached.
 */
const ForceUpdateScreen = ({
  availableVersionCode,
  isStarting,
  isUpdateInProgress,
  error,
  onUpdate,
}: ForceUpdateScreenProps) => {
  const { t } = useLocale();
  const { colors } = useThemeColors();

  // The Android hardware back button must never dismiss a mandatory update.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => subscription.remove();
  }, []);

  const errorTitle = error === 'store' ? t('appUpdate.storeErrorTitle') : t('appUpdate.errorTitle');
  const errorMessage =
    error === 'store' ? t('appUpdate.openStoreError') : t('appUpdate.errorMessage');

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={['top', 'bottom']}
      accessibilityViewIsModal>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View className="flex-1 items-center justify-center px-6 py-10">
          <View className="w-full max-w-md items-center">
            <View className="mb-7 h-24 w-24 items-center justify-center rounded-full bg-primary/10">
              <ArrowUpCircle size={48} color={colors.primary} strokeWidth={1.75} />
            </View>

            <Text
              className="text-center text-3xl font-extrabold leading-tight tracking-tight text-foreground"
              accessibilityRole="header">
              {t('appUpdate.requiredTitle')}
            </Text>

            <Text className="mt-4 text-center text-base leading-7 text-mutedForeground">
              {t('appUpdate.requiredMessage')}
            </Text>

            {availableVersionCode ? (
              <View className="mt-5 rounded-full border border-border bg-muted px-4 py-1.5">
                <Text className="text-xs font-semibold uppercase tracking-widest text-mutedForeground">
                  {t('appUpdate.buildAvailable', { build: availableVersionCode })}
                </Text>
              </View>
            ) : null}

            {error ? (
              <View
                className="mt-6 w-full rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3"
                accessibilityRole="alert"
                accessibilityLiveRegion="polite">
                <Text className="text-center text-sm font-semibold text-destructive">
                  {errorTitle}
                </Text>
                <Text className="mt-1 text-center text-sm leading-6 text-destructive">
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            <View className="mt-8 w-full">
              <Button
                size="lg"
                className="h-12 w-full rounded-xl"
                onPress={onUpdate}
                disabled={isStarting}
                accessibilityLabel={t('appUpdate.updateNow')}>
                {isStarting ? (
                  <>
                    <ActivityIndicator size="small" color={colors.primaryForeground} />
                    <Text className="text-base font-semibold">{t('appUpdate.starting')}</Text>
                  </>
                ) : (
                  <Text className="text-base font-semibold">{t('appUpdate.updateNow')}</Text>
                )}
              </Button>
            </View>

            <Text
              className="mt-4 text-center text-sm leading-6 text-mutedForeground"
              accessibilityLiveRegion="polite">
              {isUpdateInProgress ? t('appUpdate.inProgressMessage') : t('appUpdate.storeHint')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForceUpdateScreen;
