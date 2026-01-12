import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DocumentScreen from '../screen/document/DocumentScreen';

export type DocumentStackParamList = {
  Document: undefined;
};

const Stack = createNativeStackNavigator<DocumentStackParamList>();

export default function DocumentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Document" component={DocumentScreen} />
    </Stack.Navigator>
  );
}
