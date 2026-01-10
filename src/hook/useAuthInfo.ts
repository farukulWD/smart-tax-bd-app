import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { TAuth } from '../types/authTypes';

const useAuthInfo = () => {
  const [authInfo, setAuthInfo] = useState({
    email: '',
    password: '',
    rememberMe: false,
    screen: 'SignIn' as TAuth,
  });

  console.log('authInfo', JSON.stringify(authInfo, null, 2));
  const handleAuthInfo = (key: string, value: any) => {
    setAuthInfo({ ...authInfo, [key]: value });
  };
  return {
    authInfo,
    handleAuthInfo,
  };
};

export default useAuthInfo;
