import { View, Text } from 'react-native';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AppStackParamList } from '@/src/navigation/AppStack';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  return (
    <View className="flex-1 items-center justify-center">
      <Text>HomeScreen</Text>
      <Button
        onPress={() => {
          navigation.navigate('Auth', { screen: 'SignIn' });
        }}
        variant={'outline'}>
        <Text>Navigate to sign in screen</Text>
      </Button>
    </View>
  );
};

export default HomeScreen;
