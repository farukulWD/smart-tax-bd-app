import Toast from 'react-native-toast-message';
import { Linking, Share } from 'react-native';
import dayjs from 'dayjs';

interface ToastOptions {
  message?: string;
  color?: string;
  background?: string;
  type?: 'default' | 'success' | 'warning' | 'error';
}

export const showToast = ({ message, color, background, type }: ToastOptions): void => {
  Toast.show({
    type: 'tomatoToast',
    text1: message,
    position: 'bottom',
    props: { color, background, type: type || 'default' },
  });
};
export const showSuccessAlert = ({ message, color, background, type }: ToastOptions): void => {
  Toast.show({
    type: 'successToast',
    text1: message,
    position: 'bottom',
    props: { color, background, type: type || 'default' },
  });
};
export const showWarningToast = ({ message, color, background, type }: ToastOptions): void => {
  Toast.show({
    type: 'warningToast',
    text1: message,
    position: 'bottom',
    props: { color, background, type: type || 'default' },
  });
};
export const showErrorToast = ({ message, color, background, type }: ToastOptions): void => {
  Toast.show({
    type: 'errorToast',
    text1: message,
    position: 'bottom',
    props: { color, background, type: type || 'default' },
  });
};
export const showAlert = ({ message, color, background, type }: ToastOptions): void => {
  Toast.show({
    type: 'warningToast',
    text1: message,
    position: 'bottom',
    props: { color, background, type: type || 'default' },
  });
};

export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;

  // Show first 2 characters, then mask the rest before the @
  const visible = local.slice(0, 2);
  const masked = '*'.repeat(Math.max(1, local.length - 2));

  return `${visible}${masked}@${domain}`;
};

export const handleOpenLink = (url: string) => {
  Linking.openURL(url);
};

export const onShare = async (message: string) => {
  try {
    const result = await Share.share({
      message,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error: any) {
    console.log('error.message', JSON.stringify(error.message, null, 2));
  }
};

export const buildQueryParams = (params: Record<string, any>): string => {
  const parts: string[] = [];

  for (const key in params) {
    const value = params[key];

    // Skip undefined, null, or empty string
    if (value === undefined || value === null || value === '') continue;

    if (Array.isArray(value)) {
      // Repeat key for each array item: status=APPROVED&status=PENDING
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== '') {
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
        }
      });
    } else {
      // Single value
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }

  return parts.length > 0 ? `?${parts.join('&')}` : '';
};

export const generateSimpleUniqueId = () => {
  const timestamp = Date.now().toString(36); // Convert timestamp to base 36
  const randomness = Math.random().toString(36).substring(2); // Get random part
  return `${timestamp}${randomness}`;
};

export const formatDate = (date: string) => {
  const dateTime = dayjs(date).format('MMM DD, YYYY hh:mm A');
  return dateTime;
};
export function withOpacity(hslColor: string, opacityPercent: number): string {
  const match = hslColor.match(/^hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)$/i);

  if (!match) return hslColor;

  let [, h, s, l] = match;

  const hue = Number(h);
  const sat = Number(s) / 100;
  const light = Number(l) / 100;

  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = light - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (hue >= 0 && hue < 60) {
    [r, g, b] = [c, x, 0];
  } else if (hue < 120) {
    [r, g, b] = [x, c, 0];
  } else if (hue < 180) {
    [r, g, b] = [0, c, x];
  } else if (hue < 240) {
    [r, g, b] = [0, x, c];
  } else if (hue < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  const toHex = (value: number): string =>
    Math.round((value + m) * 255)
      .toString(16)
      .padStart(2, '0');

  const alpha = Math.round((Math.max(0, Math.min(100, opacityPercent)) / 100) * 255)
    .toString(16)
    .padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}${alpha}`;
}
export const CURRENT_YEAR = new Date().getFullYear();

export const TAX_YEARS = Array.from({ length: 10 }, (_, i) => {
  const year = CURRENT_YEAR - i;
  return `${year}-${year + 1}`;
});
