import { View, Text } from 'react-native';
import React from 'react';
import ProtectedScreen from '@/src/navigation/ProtectedScreen';

const CreateTaxOrderScreen = () => {
  return (
    <ProtectedScreen redirectTo={{ screen: 'CreateTaxOrder' }}>
      <View className="flex-1 bg-background">
        <Text>CreateTaxOrderScreen</Text>
      </View>
    </ProtectedScreen>
  );
};

export default CreateTaxOrderScreen;
