import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DocumentScreen from '../screen/document/DocumentScreen';

type ParamList = {
  Document: undefined;
};
const DocumentStack = createNativeStackNavigator<ParamList>({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Document: DocumentScreen,
  },
});

export default DocumentStack;
