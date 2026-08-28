import { useEffect } from 'react';
import { Alert, NativeModules, Platform, TurboModuleRegistry } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { AndroidNeedsUpdateResponse, StatusUpdateEvent } from 'sp-react-native-in-app-updates';
import { logger } from '@/src/utils/logger';

const loadInAppUpdates = () => {
  if (Platform.OS !== 'android') return null;
  if (!TurboModuleRegistry.get('SpInAppUpdates') || !NativeModules.RNDeviceInfo) return null;

  try {
    return require('sp-react-native-in-app-updates');
  } catch {
    return null;
  }
};

const useAppUpdate = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const module = loadInAppUpdates();
    if (!module) return;

    const { default: SpInAppUpdates, IAUInstallStatus, IAUUpdateKind } = module;
    const inAppUpdates = new SpInAppUpdates(__DEV__);

    const onStatusUpdate = (event: StatusUpdateEvent) => {
      if (event.status !== IAUInstallStatus.DOWNLOADED) return;

      Alert.alert(t('appUpdate.readyTitle'), t('appUpdate.readyMessage'), [
        { text: t('appUpdate.later'), style: 'cancel' },
        { text: t('appUpdate.restart'), onPress: () => inAppUpdates.installUpdate() },
      ]);
    };

    const checkForUpdate = async () => {
      try {
        const result = (await inAppUpdates.checkNeedsUpdate({
          curVersion: '0.0.0',
          customVersionComparator: () => 1,
        })) as AndroidNeedsUpdateResponse;

        if (!result?.shouldUpdate || !result?.other?.isFlexibleUpdateAllowed) return;

        inAppUpdates.addStatusUpdateListener(onStatusUpdate);
        await inAppUpdates.startUpdate({ updateType: IAUUpdateKind.FLEXIBLE });
      } catch (error) {
        logger.log('in-app update check failed', error);
      }
    };

    checkForUpdate();

    return () => inAppUpdates.removeStatusUpdateListener(onStatusUpdate);
  }, [t]);
};

export default useAppUpdate;
