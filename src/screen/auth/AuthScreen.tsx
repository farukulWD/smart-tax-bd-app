import { useEffect, useState } from 'react';
import { AppStackParamList } from '@/src/navigation/AppStack';
import { SCREEN_NAME, TAuth } from '@/src/types/authTypes';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import VerifyOTPScreen from './VerifyOTPScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<AppStackParamList, 'Auth'>;

const AuthScreen = ({ route }: Props) => {
  const initialScreen = route?.params?.screen;
  const [screen, setScreen] = useState<TAuth>(SCREEN_NAME.SIGNIN);
  const [authMobile, setAuthMobile] = useState('');

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
    return <ForgotPasswordScreen setScreen={setScreen} setAuthMobile={setAuthMobile} />;
  }
  if (screen === SCREEN_NAME.VERIFY_USER) {
    return <VerifyOTPScreen setScreen={setScreen} mobile={authMobile} />;
  }

  return <SignInScreen setScreen={setScreen} />;
};

export default AuthScreen;
