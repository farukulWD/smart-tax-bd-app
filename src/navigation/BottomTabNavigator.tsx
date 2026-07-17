// src/navigation/BottomTabNavigator.tsx
import { View } from 'react-native';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';

import HomeStack, { type HomeStackParamList } from './HomeStack';
import CustomTabBar from './CustomTabBar';
import ProfileStack, { ProfileStackParamList } from './ProfileStack';
import FAQScreen from '../screen/faq/FAQScreen';
import MyOrdersScreen from '../screen/profile/MyOrdersScreen';
import BlogScreen from '../screen/blog/BlogScreen';
import { getMode } from '@/lib/utils';

const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

export default function BottomTabNavigator() {
  return (
    <View className="flex-1 bg-background pb-2">
      <Tab.Navigator
        key={getMode()}
        screenOptions={{ headerShown: false }}
        tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}>
        <Tab.Screen name="HomeStack" component={HomeStack} />
        <Tab.Screen name="FilingStack" component={MyOrdersScreen} />
        <Tab.Screen name="BlogStack" component={BlogScreen} />
        <Tab.Screen name="FAQStack" component={FAQScreen} />
        <Tab.Screen name="ProfileStack" component={ProfileStack} />
      </Tab.Navigator>
    </View>
  );
}
export type BottomTabNavigatorParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  FilingStack: undefined;
  BlogStack: undefined;
  FAQStack: undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};
