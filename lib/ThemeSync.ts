// ThemeSync.tsx
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { setMode } from './utils';

export function ThemeSync() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    setMode(colorScheme === 'dark' ? 'dark' : 'light');
  }, [colorScheme]);

  return null;
}
