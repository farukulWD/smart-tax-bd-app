import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screen/profile/ProfileScreen';

type ParamList = {
  Profile: undefined;
};
const ProfileStack = createNativeStackNavigator<ParamList>({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Profile: ProfileScreen,
  },
});

export default ProfileStack;
