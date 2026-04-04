import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screen/profile/ProfileScreen';
import MyPaymentsScreen from '../screen/profile/MyPaymentsScreen';

export type ProfileStackParamList = {
  Profile: undefined;
  MyPayments: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="MyPayments" component={MyPaymentsScreen} />
    </Stack.Navigator>
  );
}
