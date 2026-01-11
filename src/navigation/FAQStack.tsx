import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FAQScreen from '../screen/faq/FAQScreen';

type ParamList = {
  FAQ: undefined;
};
const FAQStack = createNativeStackNavigator<ParamList>({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    FAQ: FAQScreen,
  },
});

export default FAQStack;
