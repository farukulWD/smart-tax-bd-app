import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthScreen from '../screen/auth/AuthScreen';
import BottomTabNavigator from './BottomTabNavigator';
import PackagesScreen from '../screen/home/PackageScreen';
import NewsDetailsScreen from '../screen/home/NewsDetailsScreen';
import CreateTaxOrderScreen from '../screen/order/CreateTaxOrderScreen';
import RequireDocumentsScreen from '../screen/order/RequireDocumentsScreen';
import OrderPaymentStatusScreen from '../screen/order/OrderPaymentStatusScreen';
import OrderPaymentScreen from '../screen/order/OrderPaymentScreen';

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
  RequireDocuments: { taxId: string; redirectTo?: { stack: string; screen: string } };
  OrderPaymentStatus: { taxId: string; redirectTo?: { stack: string; screen: string } };
  OrderPayment: { gatewayUrl: string; redirectTo?: { stack: string; screen: string } };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
      <Stack.Screen name="Packages" component={PackagesScreen} />
      <Stack.Screen name="NewsDetails" component={NewsDetailsScreen} />
      <Stack.Screen name="CreateTaxOrder" component={CreateTaxOrderScreen} />
      <Stack.Screen name="RequireDocuments" component={RequireDocumentsScreen} />
      <Stack.Screen name="OrderPaymentStatus" component={OrderPaymentStatusScreen} />
      <Stack.Screen name="OrderPayment" component={OrderPaymentScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  );
}
