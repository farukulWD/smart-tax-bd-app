//Navigation.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './AppStack';
import { navigationRef } from '../utils/NavigationUtils';
import { NAV_THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';

const Navigation = () => {
  const { colorScheme } = useColorScheme();

  return (
    <NavigationContainer theme={NAV_THEME[colorScheme ?? 'light']} ref={navigationRef}>
      <AppStack />
    </NavigationContainer>
  );
};

export default Navigation;
