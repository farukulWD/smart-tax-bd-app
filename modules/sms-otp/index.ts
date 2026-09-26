import { useEffect, useRef } from 'react';
// Imported from `expo` rather than `expo-modules-core`: pnpm's strict layout
// keeps the latter out of the app's own node_modules, so Metro cannot resolve it.
import { requireOptionalNativeModule } from 'expo';
import { Platform } from 'react-native';
import { logger } from '@/src/utils/logger';

type SmsOtpModule = {
  getAppHash: () => Promise<string | null>;
  startListening: () => Promise<void>;
  takeMessage: () => Promise<string | null>;
  stopListening: () => Promise<void>;
  addListener: (eventName: 'onSmsReceived', listener: () => void) => { remove: () => void };
};

// Android-only module, so it is absent on iOS and in Expo Go. iOS fills the
// code through the keyboard's "From Messages" suggestion instead.
const SmsOtp = requireOptionalNativeModule<SmsOtpModule>('SmsOtp');

if (Platform.OS === 'android' && !SmsOtp) {
  logger.warn('SmsOtp native module missing: rebuild the app to enable OTP autofill.');
}

let appHashPromise: Promise<string | undefined> | undefined;

const getAppHash = () => {
  appHashPromise ??= (SmsOtp?.getAppHash() ?? Promise.resolve(null))
    .then((hash) => hash ?? undefined)
    .catch(() => undefined);
  return appHashPromise;
};

/**
 * Call right before requesting an OTP. Starts waiting for the SMS (Android)
 * and returns the fields to add to the request, so the server puts this
 * build's app hash in the message. Resolves to `{}` where unsupported.
 */
export const prepareSmsOtp = async (): Promise<{ appHash?: string }> => {
  if (!SmsOtp) return {};

  try {
    await SmsOtp.startListening();
  } catch {
    // Without the listener the user types the code.
  }

  const appHash = await getAppHash();
  logger.log('SmsOtp appHash', appHash);
  return appHash ? { appHash } : {};
};

/**
 * Passes the `length`-digit code from the OTP SMS to `onCode`, including one
 * that arrived before the screen mounted. Stops listening on unmount.
 */
export const useSmsOtpListener = (onCode: (code: string) => void, length = 6) => {
  const onCodeRef = useRef(onCode);
  onCodeRef.current = onCode;

  useEffect(() => {
    if (!SmsOtp) return;

    const pattern = new RegExp(`\\b\\d{${length}}\\b`);
    const takeCode = () => {
      SmsOtp.takeMessage()
        .then((message) => {
          const code = message?.match(pattern)?.[0];
          if (code) onCodeRef.current(code);
        })
        .catch(() => {});
    };

    const subscription = SmsOtp.addListener('onSmsReceived', takeCode);
    takeCode();

    return () => {
      subscription.remove();
      SmsOtp.stopListening().catch(() => {});
    };
  }, [length]);
};
