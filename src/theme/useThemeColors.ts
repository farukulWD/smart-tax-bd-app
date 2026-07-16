import { useMemo } from 'react';
import { darkColors, lightColors } from './colors';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { toggleLocalTheme } from '../redux/slices/authSlice';

export const useThemeColors = () => {
  const { theme, insets } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const isDark = theme === 'dark';

  const themeToggle = () => {
    dispatch(toggleLocalTheme());
  };

  const colors = useMemo(() => (isDark ? darkColors : lightColors), [isDark]);

  return {
    colors,
    colorScheme: theme,
    isDark,
    toggleColorScheme: themeToggle,
    top: insets?.top || 0,
    bottom: insets?.bottom || 0,
  };
};
