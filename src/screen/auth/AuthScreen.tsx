import React, { useEffect, useState } from 'react';
import { NavigatorScreenParams } from '@react-navigation/native';
import { AppStackParamList } from '@/src/navigation/AppStack';
import { SCREEN_NAME, TAuth } from '@/src/types/authTypes';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import VerifyOTPScreen from './VerifyOTPScreen';

type props = {
  route: NavigatorScreenParams<AppStackParamList>;
};

const AuthScreen = ({ route }: props) => {
  const initialScreen = route?.params?.screen;
  const [screen, setScreen] = useState<TAuth>(SCREEN_NAME.SIGNIN);

  useEffect(() => {
    if (initialScreen) {
      setScreen(initialScreen as TAuth);
    }
    return () => {
      setScreen(SCREEN_NAME.SIGNIN);
    };
  }, [initialScreen]);

  if (screen === SCREEN_NAME.SIGNIN) {
    return <SignInScreen setScreen={setScreen} />;
  }

  if (screen === SCREEN_NAME.SIGNUP) {
    return <SignUpScreen setScreen={setScreen} />;
  }

  if (screen === SCREEN_NAME.FORGOT_PASSWORD) {
    return <ForgotPasswordScreen setScreen={setScreen} />;
  }
  if (screen === SCREEN_NAME.VERIFY_USER) {
    return <VerifyOTPScreen setScreen={setScreen} />;
  }

  return <SignInScreen setScreen={setScreen} />;
};

export default AuthScreen;
