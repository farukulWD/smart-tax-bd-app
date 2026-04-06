import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screen/profile/ProfileScreen';
import MyPaymentsScreen from '../screen/profile/MyPaymentsScreen';
import MyOrdersScreen from '../screen/profile/MyOrdersScreen';
import UploadedDocumentsScreen from '../screen/profile/UploadedDocumentsScreen';
import AboutUsScreen from '../screen/profile/AboutUsScreen';
import ContactUsScreen from '../screen/profile/ContactUsScreen';

export type ProfileStackParamList = {
  Profile: undefined;
  MyPayments: undefined;
  MyOrders: undefined;
  UploadedDocuments: undefined;
  AboutUs: undefined;
  ContactUs: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="MyPayments" component={MyPaymentsScreen} />
      <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
      <Stack.Screen name="UploadedDocuments" component={UploadedDocumentsScreen} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
    </Stack.Navigator>
  );
}
