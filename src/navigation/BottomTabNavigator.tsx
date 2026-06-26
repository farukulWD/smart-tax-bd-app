// src/navigation/BottomTabNavigator.tsx
import { View } from 'react-native';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';

import HomeStack, { type HomeStackParamList } from './HomeStack';
import CustomTabBar from './CustomTabBar';
import ProfileStack, { ProfileStackParamList } from './ProfileStack';
import FAQScreen from '../screen/faq/FAQScreen';
import DocumentStack, { DocumentStackParamList } from './DocumentStack';
import { getMode } from '@/lib/utils';

const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

export default function BottomTabNavigator() {
  return (
    <View className="flex-1 bg-background">
      <Tab.Navigator
        key={getMode()}
        screenOptions={{ headerShown: false }}
        tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}>
      <Tab.Screen name="HomeStack" component={HomeStack} />
      <Tab.Screen name="DocumentStack" component={DocumentStack} />
      <Tab.Screen name="FAQStack" component={FAQScreen} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} />
    </Tab.Navigator>
    </View>
  );
}
export type BottomTabNavigatorParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  DocumentStack: NavigatorScreenParams<DocumentStackParamList>;
  FAQStack: undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};
