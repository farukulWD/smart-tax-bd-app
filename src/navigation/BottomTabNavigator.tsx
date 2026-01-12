// src/navigation/BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';

import HomeStack, { type HomeStackParamList } from './HomeStack';
import CustomTabBar from './CustomTabBar';
import ProfileStack, { ProfileStackParamList } from './ProfileStack';
import FAQScreen from '../screen/faq/FAQScreen';
import DocumentStack, { DocumentStackParamList } from './DocumentStack';

const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
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
