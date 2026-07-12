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
        '--background': colors.background,
        '--foreground': colors.foreground,
        '--card': colors.card,
        '--card-foreground': colors.cardForeground,
        '--popover': colors.popover,
        '--popover-foreground': colors.popoverForeground,
        '--primary': colors.primary,
        '--primary-foreground': colors.primaryForeground,
        '--secondary': colors.secondary,
        '--secondary-foreground': colors.secondaryForeground,
        '--muted': colors.muted,
        '--muted-foreground': colors.mutedForeground,
        '--accent': colors.accent,
        '--accent-foreground': colors.accentForeground,
        '--destructive': colors.destructive,
        '--destructive-foreground': colors.destructiveForeground,
        '--border': colors.border,
        '--input': colors.input,
        '--ring': colors.ring,
      })}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor="transparent" />
      <Navigation />
      <Toast config={createToastConfig(colors)} />
    </View>
  );
};

export default ThemedApp;
