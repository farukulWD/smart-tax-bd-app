import { useEffect } from 'react';
import { View } from 'react-native';
import { useColorScheme, vars } from 'nativewind';
import { darkColors, lightColors } from './colors';
import { useAppSelector } from '../redux/hooks';
import Navigation from '../navigation/Navigation';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { createToastConfig } from '../utils/ToastConfig';

const hslToChannels = (color: string) => {
  const match = color.match(/^hsla?\((.+)\)$/i);
  return match ? match[1].replace(/,/g, '').trim() : color;
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
        'color-background': hslToChannels(colors.background),
        'color-foreground': hslToChannels(colors.foreground),
        'color-card': hslToChannels(colors.card),
        'color-cardForeground': hslToChannels(colors.cardForeground),
        'color-popover': hslToChannels(colors.popover),
        'color-popoverForeground': hslToChannels(colors.popoverForeground),
        'color-primary': hslToChannels(colors.primary),
        'color-primaryForeground': hslToChannels(colors.primaryForeground),
        'color-secondary': hslToChannels(colors.secondary),
        'color-secondaryForeground': hslToChannels(colors.secondaryForeground),
        'color-muted': hslToChannels(colors.muted),
        'color-mutedForeground': hslToChannels(colors.mutedForeground),
        'color-accent': hslToChannels(colors.accent),
        'color-accentForeground': hslToChannels(colors.accentForeground),
        'color-destructive': hslToChannels(colors.destructive),
        'color-destructiveForeground': hslToChannels(colors.destructiveForeground),
        'color-border': hslToChannels(colors.border),
        'color-input': hslToChannels(colors.input),
        'color-ring': hslToChannels(colors.ring),
      })}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor="transparent" />
      <Navigation />
      <Toast config={createToastConfig(colors)} />
    </View>
  );
};

export default ThemedApp;
