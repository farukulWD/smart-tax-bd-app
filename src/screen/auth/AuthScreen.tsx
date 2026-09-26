import { useEffect, useState } from 'react';
import { SCREEN_NAME, TAuth, TVerifyPurpose } from '@/src/types/authTypes';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import VerifyOTPScreen from './VerifyOTPScreen';
import ResetPasswordScreen from './ResetPasswordScreen';

const AuthScreen = ({ initialScreen }: { initialScreen: TAuth }) => {
  const [screen, setScreen] = useState<TAuth>(SCREEN_NAME.SIGNIN);
  const [authMobile, setAuthMobile] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [verifyType, setVerifyType] = useState<TVerifyPurpose>('register');
  const [prevScreen, setPrevScreen] = useState<TAuth>(SCREEN_NAME.SIGNIN);

  useEffect(() => {
    if (initialScreen) {
      setScreen(initialScreen as TAuth);
    }
    return () => {
      setScreen(SCREEN_NAME.SIGNIN);
    };
  }, [initialScreen]);

  // Set during render, not in an effect: VerifyOTPScreen must mount with the
  // right purpose, since an SMS already received is autofilled and submitted
  // on its first render.
  if (screen !== prevScreen) {
    if (screen === SCREEN_NAME.VERIFY_USER) {
      setVerifyType(prevScreen === SCREEN_NAME.FORGOT_PASSWORD ? 'forgotPassword' : 'register');
    }
    setPrevScreen(screen);
  }

  if (screen === SCREEN_NAME.SIGNIN) {
    return <SignInScreen setScreen={setScreen} />;
  }

  if (screen === SCREEN_NAME.SIGNUP) {
    return <SignUpScreen setAuthMobile={setAuthMobile} setScreen={setScreen} />;
  }

  if (screen === SCREEN_NAME.FORGOT_PASSWORD) {
    return <ForgotPasswordScreen setScreen={setScreen} setAuthMobile={setAuthMobile} />;
  }
  if (screen === SCREEN_NAME.VERIFY_USER) {
    return (
      <VerifyOTPScreen
        setScreen={setScreen}
        mobile={authMobile}
        verifyType={verifyType}
        setResetToken={setResetToken}
      />
    );
  }

  if (screen === SCREEN_NAME.RESET_PASSWORD) {
    return <ResetPasswordScreen setScreen={setScreen} resetToken={resetToken} />;
  }

  return <SignInScreen setScreen={setScreen} />;
};

export default AuthScreen;
