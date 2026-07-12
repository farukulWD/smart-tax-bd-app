import { useMemo } from 'react';
import { darkColors, lightColors } from './colors';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { toggleLocalTheme } from '../redux/slices/authSlice';

export const useThemeColors = () => {
  const { theme } = useAppSelector((state) => state.auth);
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
  };
};
