import { useState } from 'react';
import { TAuth } from '../types/authTypes';
import { logger } from '@/src/utils/logger';

const useAuthInfo = () => {
  const [authInfo, setAuthInfo] = useState({
    email: '',
    password: '',
    rememberMe: false,
    screen: 'SignIn' as TAuth,
  });

  logger.log('authInfo', JSON.stringify(authInfo, null, 2));
  const handleAuthInfo = (key: string, value: any) => {
    setAuthInfo({ ...authInfo, [key]: value });
  };
  return {
    authInfo,
    handleAuthInfo,
  };
};

export default useAuthInfo;
