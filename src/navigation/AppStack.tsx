import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthScreen from '../screen/auth/AuthScreen';
import BottomTabNavigator from './BottomTabNavigator';
import PackagesScreen from '../screen/home/PackageScreen';

export type AppStackParamList = {
  BottomTabNavigator: undefined;
  Auth: { screen: 'SignIn' | 'SignUp' | 'ForgotPassword' } | undefined;
  Packages: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const useIsSignedIn = () => true; // replace with real auth state

export default function AppStack() {
  const isSignedIn = useIsSignedIn();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isSignedIn ? (
        <>
          <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
          <Stack.Screen name="Packages" component={PackagesScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
}
