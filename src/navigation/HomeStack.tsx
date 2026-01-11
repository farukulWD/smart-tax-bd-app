import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/home/HomeScreen';

const HomeStack = createNativeStackNavigator<HomeStackParamList>({
  screenOptions: { headerShown: false },

  screens: {
    Home: {
      screen: HomeScreen,
    },
  },
});

export default HomeStack;

export type HomeStackParamList = {
  Home: undefined;
};
