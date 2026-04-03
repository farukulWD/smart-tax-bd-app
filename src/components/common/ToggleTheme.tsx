import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useTheme } from '@/src/context/ThemeProvider';

const ToggleTheme = () => {
  const { toggleTheme } = useTheme();

  return (
    <View>
      <Pressable onPress={toggleTheme}>
        <Text className="text-foreground"> ToggleTheme</Text>
      </Pressable>
    </View>
  );
};

export default ToggleTheme;
