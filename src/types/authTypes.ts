export type TAuth = 'SignIn' | 'SignUp' | 'ForgotPassword' | 'VerifyUser';

export const SCREEN_NAME = {
  SIGNIN: 'SignIn' as TAuth,
  SIGNUP: 'SignUp' as TAuth,
  FORGOT_PASSWORD: 'ForgotPassword' as TAuth,
  VERIFY_USER: 'VerifyUser' as TAuth,
};

type UserRole = 'user' | 'admin' | string;
type UserStatus = 'active' | 'inactive' | 'blocked' | string;

export interface IUser {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  isDeleted: boolean;
  isMobileVerify: boolean;
  isEmailVerify: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  accessToken: string;
}

export interface ILoginData {
  accessToken: string;
  user: IUser;
}

export interface ILoginResponse {
  success: boolean;
  message: string;
  data: ILoginData;
}
