// src/navigation/BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import HomeStack, { type HomeStackParamList } from './HomeStack';
import CustomTabBar from './CustomTabBar';
import ProfileStack from './ProfileStack';
import FAQScreen from '../screen/faq/FAQScreen';
import DocumentStack from './DocumentStack';

// If you will add other stacks later, type them similarly and use NavigatorScreenParams<ThatStackParamList>
export type BottomTabNavigatorParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  DocumentStack: undefined;
  FAQStack: undefined;
  ProfileStack: undefined;
  // SearchStack: undefined;
  // CategoryStack: undefined;
  // CartStack: undefined;
};

const BottomTabNavigator = createBottomTabNavigator<BottomTabNavigatorParamList>({
  screenOptions: { headerShown: false },
  tabBar: (props: BottomTabBarProps) => <CustomTabBar {...props} />,
  screens: {
    HomeStack: HomeStack,
    DocumentStack: DocumentStack,
    FAQStack: FAQScreen,
    ProfileStack: ProfileStack,

    // Add these when you create them:
    // SearchStack: SearchStack,
    // CategoryStack: CategoryStack,
    // CartStack: CartStack,
  },
});

export default BottomTabNavigator;
