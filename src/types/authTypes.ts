export type TAuth = 'SignIn' | 'SignUp' | 'ForgotPassword' | 'VerifyUser';

export const SCREEN_NAME = {
  SIGNIN: 'SignIn' as TAuth,
  SIGNUP: 'SignUp' as TAuth,
  FORGOT_PASSWORD: 'ForgotPassword' as TAuth,
  VERIFY_USER: 'VerifyUser' as TAuth,
};
