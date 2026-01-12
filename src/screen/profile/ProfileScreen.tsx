import { View, Text } from 'react-native';
import React from 'react';
import { Button } from '@/components/ui/button';
import { navigate } from '@/src/utils/NavigationUtils';

const ProfileScreen = () => {
  return (
    <View className="flex-1 items-center justify-center gap-3">
      <Button
        onPress={() => {
          navigate('Auth', { screen: 'SignIn' });
        }}
        className=""
        variant={'outline'}>
        <Text>Login Screen</Text>
      </Button>
      <Button
        onPress={() => {
          navigate('Auth', { screen: 'SignUp' });
        }}
        className=""
        variant={'outline'}>
        <Text>SignUp Screen</Text>
      </Button>
      <Button
        onPress={() => {
          navigate('Auth', { screen: 'ForgotPassword' });
        }}
        className=""
        variant={'outline'}>
        <Text>Forgot Password Screen</Text>
      </Button>
      <Button
        onPress={() => {
          navigate('Auth', { screen: 'VerifyUser' });
        }}
        className=""
        variant={'outline'}>
        <Text>Verify User Screen</Text>
      </Button>
    </View>
  );
};

export default ProfileScreen;
