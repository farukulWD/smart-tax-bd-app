import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useTheme } from '@/src/context/ThemeProvider';
import LucideIcon from './LucideIcon';

const ToggleTheme = () => {
  const { toggleTheme } = useTheme();

  return (
    <View>
      <Pressable onPress={toggleTheme}>
        <LucideIcon name="Moon" className="text-lg text-destructive" />
      </Pressable>
    </View>
  );
};

export default ToggleTheme;
