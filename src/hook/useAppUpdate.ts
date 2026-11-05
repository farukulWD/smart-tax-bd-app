import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import {
  getPlayUpdateInfo,
  isPlayInAppUpdateSupported,
  openPlayStoreListing,
  PlayUpdateAvailability,
  type PlayUpdateInfo,
  startPlayImmediateUpdate,
} from '@/src/services/appUpdate';
import { logger } from '@/src/utils/logger';

/** Avoids double-checking when Android emits quick active/inactive transitions. */
const FOREGROUND_CHECK_THROTTLE_MS = 1500;

export type AppUpdateError = 'check' | 'start' | 'store' | null;

export type AppUpdateState = {
  /** Sticky once Play positively reports a newer build. Never reset in-session. */
  isUpdateRequired: boolean;
  /** True while Play's immediate flow is being launched. */
  isStarting: boolean;
  /** Play's immediate flow is unavailable; use the store listing instead. */
  requiresStoreFallback: boolean;
  /** An immediate update was already started and may still be downloading. */
  isUpdateInProgress: boolean;
  /** Play's available build number, when known. */
  availableVersionCode?: number;
  error: AppUpdateError;
};

const initialState: AppUpdateState = {
  isUpdateRequired: false,
  isStarting: false,
  requiresStoreFallback: false,
  isUpdateInProgress: false,
  availableVersionCode: undefined,
  error: null,
};

export type UseAppUpdateResult = AppUpdateState & {
  onUpdatePress: () => void;
};

/**
 * Mandatory-update controller.
 *
 * Checks Google Play on launch and every time the app returns to the
 * foreground, then drives Play's immediate update flow. If that flow cannot be
 * used, the app stays blocked behind the custom force-update screen.
 */
const useAppUpdate = (): UseAppUpdateResult => {
  const [state, setState] = useState<AppUpdateState>(initialState);
  const stateRef = useRef<AppUpdateState>(initialState);
  const mountedRef = useRef(true);
  const updateRequiredRef = useRef(false);
  const updateInfoRef = useRef<PlayUpdateInfo | null>(null);
  const checkInFlightRef = useRef(false);
  const startInFlightRef = useRef(false);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const lastForegroundCheckRef = useRef(Date.now());

  const patchState = useCallback((patch: Partial<AppUpdateState>) => {
    const next = { ...stateRef.current, ...patch };
    stateRef.current = next;

    if (mountedRef.current) {
      setState(next);
    }
  }, []);

  const applyUpdateInfo = useCallback(
    (info: PlayUpdateInfo) => {
      updateRequiredRef.current = true;
      updateInfoRef.current = info;

      patchState({
        isUpdateRequired: true,
        availableVersionCode: info.availableVersionCode > 0 ? info.availableVersionCode : undefined,
        isUpdateInProgress: info.availability === PlayUpdateAvailability.DeveloperTriggered,
        error: null,
      });
    },
    [patchState]
  );

  const launchImmediateUpdate = useCallback(
    async (info: PlayUpdateInfo) => {
      if (startInFlightRef.current || AppState.currentState !== 'active') return;

      startInFlightRef.current = true;
      patchState({ isStarting: true, error: null });

      try {
        await startPlayImmediateUpdate();

        // Play's full-screen flow is now on top of the app. It downloads,
        // installs and restarts the app without any further JS input.
        patchState({
          isStarting: false,
          requiresStoreFallback: false,
          isUpdateInProgress: false,
          error: null,
        });
      } catch (error) {
        logger.warn('[app-update] Play immediate update flow could not start', error);

        const isInterrupted =
          info.availability === PlayUpdateAvailability.DeveloperTriggered ||
          stateRef.current.isUpdateInProgress;

        patchState({
          isStarting: false,
          requiresStoreFallback: true,
          isUpdateInProgress: isInterrupted,
          error: isInterrupted ? null : 'start',
        });
      } finally {
        startInFlightRef.current = false;
      }
    },
    [patchState]
  );

  const checkForUpdates = useCallback(async (): Promise<void> => {
    if (checkInFlightRef.current) return;

    // Expo Go, web, iOS and builds without the native module simply continue.
    if (!isPlayInAppUpdateSupported()) return;

    checkInFlightRef.current = true;

    try {
      const info = await getPlayUpdateInfo();
      if (!mountedRef.current || !info) return;

      const updatePending =
        info.availability === PlayUpdateAvailability.Available ||
        info.availability === PlayUpdateAvailability.DeveloperTriggered;

      if (!updatePending) {
        // A confirmed mandatory update is never cleared by a later check.
        // Only installing the update (which restarts the app) unblocks it.
        if (!updateRequiredRef.current) {
          patchState(initialState);
        }
        return;
      }

      applyUpdateInfo(info);

      if (!info.isImmediateUpdateAllowed) {
        patchState({ requiresStoreFallback: true });
        return;
      }

      await launchImmediateUpdate(info);
    } catch (error) {
      logger.warn('[app-update] update check failed', error);

      if (updateRequiredRef.current) {
        // Network/Play services hiccups must not let a confirmed mandatory
        // update be bypassed: stay blocked and offer the Play Store listing.
        patchState({
          isStarting: false,
          requiresStoreFallback: true,
          error: stateRef.current.error ?? 'check',
        });
      }
      // Otherwise fail open so users are not locked out of a working app.
    } finally {
      checkInFlightRef.current = false;
    }
  }, [applyUpdateInfo, launchImmediateUpdate, patchState]);

  const handleUpdatePress = useCallback(async () => {
    if (stateRef.current.isStarting) return;

    const info = updateInfoRef.current;
    const canUseImmediate = Boolean(info?.isImmediateUpdateAllowed);

    if (info && canUseImmediate && !stateRef.current.requiresStoreFallback) {
      await launchImmediateUpdate(info);
      return;
    }

    try {
      await openPlayStoreListing();
    } catch (error) {
      logger.warn('[app-update] could not open the Play Store listing', error);
      patchState({ error: 'store' });
    }
  }, [launchImmediateUpdate, patchState]);

  useEffect(() => {
    mountedRef.current = true;

    const subscription = AppState.addEventListener('change', (nextState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextState;

      if (nextState !== 'active' || previousState === 'active') return;

      const now = Date.now();
      if (now - lastForegroundCheckRef.current < FOREGROUND_CHECK_THROTTLE_MS) return;
      lastForegroundCheckRef.current = now;

      void checkForUpdates();
    });

    void checkForUpdates();

    return () => {
      mountedRef.current = false;
      subscription.remove();
    };
  }, [checkForUpdates]);

  const onUpdatePress = useCallback(() => {
    void handleUpdatePress();
  }, [handleUpdatePress]);

  return { ...state, onUpdatePress };
};

export default useAppUpdate;
