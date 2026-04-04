import { View, Pressable } from 'react-native';
import React from 'react';
import { useTheme } from '@/src/context/ThemeProvider';
import LucideIcon from './LucideIcon';

const ToggleTheme = () => {
  const { toggleTheme, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View>
      <Pressable onPress={toggleTheme}>
        <LucideIcon name={isDark ? 'Sun' : 'Moon'} className="text-lg text-foreground" />
      </Pressable>
    </View>
  );
};

export default ToggleTheme;
