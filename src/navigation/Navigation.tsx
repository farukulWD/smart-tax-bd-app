//Navigation.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './AppStack';
import { navigationRef } from '../utils/NavigationUtils';

const Navigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <AppStack />
    </NavigationContainer>
  );
};

export default Navigation;
