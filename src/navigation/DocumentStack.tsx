import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewsScreen from '../screen/document/NewsScreen';

export type DocumentStackParamList = {
  News: undefined;
};

const Stack = createNativeStackNavigator<DocumentStackParamList>();

export default function DocumentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="News" component={NewsScreen} />
    </Stack.Navigator>
  );
}
