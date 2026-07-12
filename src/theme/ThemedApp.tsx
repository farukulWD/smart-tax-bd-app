import { useEffect } from 'react';
import { View } from 'react-native';
import { useColorScheme, vars } from 'nativewind';
import { darkColors, lightColors } from './colors';
import { useAppSelector } from '../redux/hooks';
import Navigation from '../navigation/Navigation';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { createToastConfig } from '../utils/ToastConfig';

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
        'color-background': colors.background,
        'color-foreground': colors.foreground,
        'color-card': colors.card,
        'color-cardForeground': colors.cardForeground,
        'color-popover': colors.popover,
        'color-popoverForeground': colors.popoverForeground,
        'color-primary': colors.primary,
        'color-primaryForeground': colors.primaryForeground,
        'color-secondary': colors.secondary,
        'color-secondaryForeground': colors.secondaryForeground,
        'color-muted': colors.muted,
        'color-mutedForeground': colors.mutedForeground,
        'color-accent': colors.accent,
        'color-accentForeground': colors.accentForeground,
        'color-destructive': colors.destructive,
        'color-destructiveForeground': colors.destructiveForeground,
        'color-border': colors.border,
        'color-input': colors.input,
        'color-ring': colors.ring,
      })}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor="transparent" />
      <Navigation />
      <Toast config={createToastConfig(colors)} />
    </View>
  );
};

export default ThemedApp;
