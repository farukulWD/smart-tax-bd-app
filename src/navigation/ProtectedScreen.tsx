import { ReactNode } from 'react';
import { useAppSelector } from '../redux/hooks';
import AuthScreen from '../screen/auth/AuthScreen';
import { SCREEN_NAME } from '../types/authTypes';

type Props = {
  children: ReactNode;
};

export default function ProtectedScreen({ children }: Props) {
  // Gate on the live access token, not user.accessToken: the login response
  // deliberately blanks that field and only /users/get-me ever fills it in, so
  // it is a stale mirror of a DB column rather than the current session.
  const token = useAppSelector((state) => state.auth.token);

  if (!token) {
    return <AuthScreen initialScreen={SCREEN_NAME.SIGNIN} />;
  }

  return <>{children}</>;
}
