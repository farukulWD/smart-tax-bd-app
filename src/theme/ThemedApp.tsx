import { useEffect } from 'react';
import { View } from 'react-native';
import { useColorScheme, vars } from 'nativewind';
import { darkColors, lightColors } from './colors';
import { useAppSelector } from '../redux/hooks';
import Navigation from '../navigation/Navigation';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { createToastConfig } from '../utils/ToastConfig';

const hslToRgbChannels = (color: string) => {
  const match = color.match(/^hsla?\((.+)\)$/i);
  if (!match) return color;

  const inner = match[1].replace(/,/g, ' ').trim();
  const parts = inner.split(/\s+/);

  if (parts.length < 3) return color;

  const H = parseFloat(parts[0]) / 360;
  const S = parseFloat(parts[1]) / 100;
  const L = parseFloat(parts[2]) / 100;

  const C = (1 - Math.abs(2 * L - 1)) * S;
  const X = C * (1 - Math.abs(((H * 6) % 2) - 1));
  const m = L - C / 2;

  let r = 0,
    g = 0,
    b = 0;
  const sextant = Math.floor(H * 6);

  switch (sextant) {
    case 0:
      r = C;
      g = X;
      break;
    case 1:
      r = X;
      g = C;
      break;
    case 2:
      g = C;
      b = X;
      break;
    case 3:
      g = X;
      b = C;
      break;
    case 4:
      r = X;
      b = C;
      break;
    case 5:
      r = C;
      b = X;
      break;
    default:
      r = C;
      g = X;
      break;
  }

  const R = Math.round((r + m) * 255);
  const G = Math.round((g + m) * 255);
  const B = Math.round((b + m) * 255);

  return `${R} ${G} ${B}`;
};

const ThemedApp = () => {
  const { theme } = useAppSelector((state) => state.auth);
  const { setColorScheme } = useColorScheme();
  const colors = theme === 'dark' ? darkColors : lightColors;

  useEffect(() => {
    setColorScheme(theme);
  }, [setColorScheme, theme]);

  return (
    <View
      className="flex-1 bg-background"
      style={vars({
        'color-background': hslToRgbChannels(colors.background),
        'color-foreground': hslToRgbChannels(colors.foreground),
        'color-card': hslToRgbChannels(colors.card),
        'color-cardForeground': hslToRgbChannels(colors.cardForeground),
        'color-popover': hslToRgbChannels(colors.popover),
        'color-popoverForeground': hslToRgbChannels(colors.popoverForeground),
        'color-primary': hslToRgbChannels(colors.primary),
        'color-primaryForeground': hslToRgbChannels(colors.primaryForeground),
        'color-secondary': hslToRgbChannels(colors.secondary),
        'color-secondaryForeground': hslToRgbChannels(colors.secondaryForeground),
        'color-muted': hslToRgbChannels(colors.muted),
        'color-mutedForeground': hslToRgbChannels(colors.mutedForeground),
        'color-accent': hslToRgbChannels(colors.accent),
        'color-accentForeground': hslToRgbChannels(colors.accentForeground),
        'color-destructive': hslToRgbChannels(colors.destructive),
        'color-destructiveForeground': hslToRgbChannels(colors.destructiveForeground),
        'color-success': hslToRgbChannels(colors.success),
        'color-successForeground': hslToRgbChannels(colors.successForeground),
        'color-warning': hslToRgbChannels(colors.warning),
        'color-warningForeground': hslToRgbChannels(colors.warningForeground),
        'color-border': hslToRgbChannels(colors.border),
        'color-input': hslToRgbChannels(colors.input),
        'color-ring': hslToRgbChannels(colors.ring),
      })}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor="transparent" />
      <Navigation />
      <Toast config={createToastConfig(colors)} />
    </View>
  );
};

export default ThemedApp;
