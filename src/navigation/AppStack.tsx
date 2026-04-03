import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthScreen from '../screen/auth/AuthScreen';
import BottomTabNavigator from './BottomTabNavigator';
import PackagesScreen from '../screen/home/PackageScreen';
import NewsDetailsScreen from '../screen/home/NewsDetailsScreen';
import { useAppSelector } from '../redux/hooks';

export type AppStackParamList = {
  BottomTabNavigator: undefined;
  Auth: { screen: 'SignIn' | 'SignUp' | 'ForgotPassword' } | undefined;
  Packages: undefined;
  NewsDetails: { newsId: string };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
          <Stack.Screen name="Packages" component={PackagesScreen} />
          <Stack.Screen name="NewsDetails" component={NewsDetailsScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
}
