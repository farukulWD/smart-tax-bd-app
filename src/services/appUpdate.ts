import { Linking, Platform, TurboModuleRegistry } from 'react-native';
import type SpInAppUpdates from 'sp-react-native-in-app-updates';
import type {
  AndroidInAppUpdateExtras,
  AndroidNeedsUpdateResponse,
  CheckOptions,
} from 'sp-react-native-in-app-updates';
import { logger } from '@/src/utils/logger';

/**
 * Google Play listing for Smart Tax BD.
 *
 * Keep this in sync with `expo.android.package` in `app.json` and the
 * `applicationId` in `android/app/build.gradle`.
 */
export const ANDROID_PACKAGE_NAME = 'com.smarttaxbd';
export const PLAY_STORE_MARKET_URL = `market://details?id=${ANDROID_PACKAGE_NAME}`;
export const PLAY_STORE_WEB_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`;

/**
 * Mirrors `com.google.android.play.core.install.model.UpdateAvailability`.
 *
 * Declared locally (instead of importing the package enum) so that simply
 * importing this service never touches the native module. Expo Go and web can
 * load the app without crashing.
 */
export enum PlayUpdateAvailability {
  Unknown = 0,
  Unavailable = 1,
  Available = 2,
  DeveloperTriggered = 3,
}

export type PlayUpdateInfo = {
  availability: PlayUpdateAvailability;
  availableVersionCode: number;
  isImmediateUpdateAllowed: boolean;
  isFlexibleUpdateAllowed: boolean;
  updatePriority: number;
  packageName?: string;
  totalBytes?: number;
  stalenessDays?: number;
};

/** Google Play's binder calls should be fast; never leave the UI waiting forever. */
const CHECK_TIMEOUT_MS = 10_000;
const START_TIMEOUT_MS = 15_000;

type InAppUpdatesModule = typeof import('sp-react-native-in-app-updates');

let cachedModule: InAppUpdatesModule | null | undefined;
let cachedInstance: SpInAppUpdates | null = null;
let inFlightCheck: Promise<PlayUpdateInfo | null> | null = null;
let inFlightStart: Promise<void> | null = null;

const withTimeout = <T>(task: Promise<T>, timeoutMs: number, label: string): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`${label} timed out after ${timeoutMs}ms`)),
      timeoutMs
    );

    task.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });

/**
 * Lazily resolves the native module.
 *
 * `sp-react-native-in-app-updates@2` resolves its TurboModule when imported, so
 * a top-level import would crash Expo Go and any build without the native
 * module. Returning `null` lets the app run normally in those environments.
 */
const getModule = (): InAppUpdatesModule | null => {
  if (cachedModule !== undefined) return cachedModule;

  if (Platform.OS !== 'android') {
    cachedModule = null;
    return cachedModule;
  }

  try {
    if (!TurboModuleRegistry.get('SpInAppUpdates')) {
      cachedModule = null;
      return cachedModule;
    }

    cachedModule = require('sp-react-native-in-app-updates') as InAppUpdatesModule;
  } catch (error) {
    logger.warn('[app-update] Play in-app updates native module unavailable', error);
    cachedModule = null;
  }

  return cachedModule;
};

const getInAppUpdates = (): SpInAppUpdates | null => {
  if (cachedInstance) return cachedInstance;

  const module = getModule();
  if (!module) return null;

  cachedInstance = new module.default(__DEV__);
  return cachedInstance;
};

/** True when this install can talk to Google Play's In-App Updates API. */
export const isPlayInAppUpdateSupported = (): boolean => getInAppUpdates() !== null;

/**
 * Reads Play's update availability for the installed build.
 *
 * Resolves with `null` when the native module is not present (Expo Go, web,
 * iOS). Rejects when Play services return an error so the caller can decide
 * whether the app is allowed to continue.
 */
export const getPlayUpdateInfo = (): Promise<PlayUpdateInfo | null> => {
  if (inFlightCheck) return inFlightCheck;

  const inAppUpdates = getInAppUpdates();
  if (!inAppUpdates) return Promise.resolve(null);

  // We only care about Play's availability flag, so the version comparison is
  // intentionally neutralised. This keeps the logic independent of versionName.
  const options: CheckOptions = {
    curVersion: '0.0.0',
    customVersionComparator: () => 1,
  };

  const task = withTimeout(
    inAppUpdates.checkNeedsUpdate(options),
    CHECK_TIMEOUT_MS,
    'checkNeedsUpdate'
  )
    .then((response) => {
      const other = (response as AndroidNeedsUpdateResponse).other as AndroidInAppUpdateExtras & {
        dayStaleness?: number;
      };

      return {
        availability: other.updateAvailability as unknown as PlayUpdateAvailability,
        availableVersionCode: other.versionCode,
        isImmediateUpdateAllowed: other.isImmediateUpdateAllowed,
        isFlexibleUpdateAllowed: other.isFlexibleUpdateAllowed,
        updatePriority: other.updatePriority,
        packageName: other.packageName,
        totalBytes: other.totalBytes,
        stalenessDays: other.dayStaleness,
      } satisfies PlayUpdateInfo;
    })
    .finally(() => {
      inFlightCheck = null;
    });

  inFlightCheck = task;
  return task;
};

/**
 * Starts (or resumes) Google Play's native full-screen immediate update flow.
 *
 * Resolves once Play's update UI has been launched. Play downloads and installs
 * the update itself, then restarts the app.
 */
export const startPlayImmediateUpdate = (): Promise<void> => {
  if (inFlightStart) return inFlightStart;

  const inAppUpdates = getInAppUpdates();
  const module = getModule();

  if (!inAppUpdates || !module) {
    return Promise.reject(new Error('Google Play in-app updates are unavailable'));
  }

  const updateType = module.IAUUpdateKind.IMMEDIATE;

  const task = withTimeout(
    inAppUpdates.startUpdate({ updateType }),
    START_TIMEOUT_MS,
    'startUpdate'
  ).finally(() => {
    inFlightStart = null;
  });

  inFlightStart = task;
  return task;
};

/** Opens the Play Store listing, falling back to the web listing. */
export const openPlayStoreListing = async (): Promise<void> => {
  if (Platform.OS !== 'android') return;

  try {
    await Linking.openURL(PLAY_STORE_MARKET_URL);
  } catch (error) {
    logger.warn('[app-update] market:// listing failed, falling back to https', error);
    await Linking.openURL(PLAY_STORE_WEB_URL);
  }
};
