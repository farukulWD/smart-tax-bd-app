// src/navigation/BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';

import HomeStack, { type HomeStackParamList } from './HomeStack';
import CustomTabBar from './CustomTabBar';
import ProfileStack, { ProfileStackParamList } from './ProfileStack';
import FAQScreen from '../screen/faq/FAQScreen';
import DocumentStack, { DocumentStackParamList } from './DocumentStack';
import { Colors } from '@/lib/theme';
import { getMode } from '@/lib/utils';

const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

export default function BottomTabNavigator() {
  console.log('BottomTabBar', JSON.stringify(Colors.primary, null, 2));
  console.log('getMode()', JSON.stringify(getMode(), null, 2));
  return (
    <Tab.Navigator
      key={getMode()}
      screenOptions={{ headerShown: false }}
      tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}>
      <Tab.Screen name="HomeStack" component={HomeStack} />
      <Tab.Screen name="DocumentStack" component={DocumentStack} />
      <Tab.Screen name="FAQStack" component={FAQScreen} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} />
    </Tab.Navigator>
  );
}
export type BottomTabNavigatorParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  DocumentStack: NavigatorScreenParams<DocumentStackParamList>;
  FAQStack: undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};
