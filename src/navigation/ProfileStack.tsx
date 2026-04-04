import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screen/profile/ProfileScreen';
import MyPaymentsScreen from '../screen/profile/MyPaymentsScreen';
import MyOrdersScreen from '../screen/profile/MyOrdersScreen';
import UploadedDocumentsScreen from '../screen/profile/UploadedDocumentsScreen';

export type ProfileStackParamList = {
  Profile: undefined;
  MyPayments: undefined;
  MyOrders: undefined;
  UploadedDocuments: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="MyPayments" component={MyPaymentsScreen} />
      <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
      <Stack.Screen name="UploadedDocuments" component={UploadedDocumentsScreen} />
    </Stack.Navigator>
  );
}
