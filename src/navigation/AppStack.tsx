import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthScreen from '../screen/auth/AuthScreen';
import BottomTabNavigator from './BottomTabNavigator';
import PackagesScreen from '../screen/home/PackageScreen';
import NewsDetailsScreen from '../screen/home/NewsDetailsScreen';
import CreateTaxOrderScreen from '../screen/protected/CreateTaxOrderScreen';

export type AppStackParamList = {
  BottomTabNavigator: undefined;
  Auth:
    | {
        screen: 'SignIn' | 'SignUp' | 'ForgotPassword';
        shouldGoBack?: boolean;
        redirectTo?: { stack: string; screen: string };
      }
    | undefined;
  Packages: undefined;
  NewsDetails: { newsId: string };
  CreateTaxOrder: { taxTypeId: string; redirectTo: { stack: string; screen: string } };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
      <Stack.Screen name="Packages" component={PackagesScreen} />
      <Stack.Screen name="NewsDetails" component={NewsDetailsScreen} />
      <Stack.Screen name="CreateTaxOrder" component={CreateTaxOrderScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  );
}
