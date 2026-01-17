import { View, Text } from 'react-native';
import React from 'react';
import NoData from '@/src/components/global/NoData';

const DocumentScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <NoData message="No Data added yet." />
    </View>
  );
};

export default DocumentScreen;
