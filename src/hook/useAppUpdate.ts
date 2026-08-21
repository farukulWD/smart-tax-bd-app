import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import SpInAppUpdates, {
  IAUInstallStatus,
  IAUUpdateKind,
  type AndroidNeedsUpdateResponse,
  type StatusUpdateEvent,
} from 'sp-react-native-in-app-updates';

const inAppUpdates = new SpInAppUpdates(__DEV__);

/**
 * Offers the latest Play Store build through Google's in-app updates API in
 * FLEXIBLE mode: Play shows its own default popup, the user can accept or
 * decline, and an accepted update downloads in the background while the app
 * stays usable. Once it is downloaded we ask before restarting to install.
 *
 * Android only. Nothing happens on a build that was not installed from the
 * Play Store (local release builds, sideloaded APKs) — that is a Play Core
 * limitation, not a bug.
 */
const useAppUpdate = () => {
  const { t } = useTranslation();

  useEffect(() => {
    if (Platform.OS !== 'android') return;

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
          // Play Core already answers "is there a newer build for *this*
          // install", so the library's semver comparison has nothing useful to
          // do here. Feeding it a dummy version keeps it from reaching for
          // react-native-device-info, and the comparator defers to Play.
          curVersion: '0.0.0',
          customVersionComparator: () => 1,
        })) as AndroidNeedsUpdateResponse;

        if (!result?.shouldUpdate || !result?.other?.isFlexibleUpdateAllowed) return;

        inAppUpdates.addStatusUpdateListener(onStatusUpdate);
        await inAppUpdates.startUpdate({ updateType: IAUUpdateKind.FLEXIBLE });
      } catch (error) {
        // A failed check must never get in the way of using the app.
        if (__DEV__) console.log('in-app update check failed', error);
      }
    };

    checkForUpdate();

    return () => inAppUpdates.removeStatusUpdateListener(onStatusUpdate);
  }, [t]);
};

export default useAppUpdate;
