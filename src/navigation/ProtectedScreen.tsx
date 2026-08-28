import { ReactNode } from 'react';
import { useAppSelector } from '../redux/hooks';
import AuthScreen from '../screen/auth/AuthScreen';
import { SCREEN_NAME } from '../types/authTypes';

type Props = {
  children: ReactNode;
};

export default function ProtectedScreen({ children }: Props) {
  const token = useAppSelector((state) => state.auth.token);

  if (!token) {
    return <AuthScreen initialScreen={SCREEN_NAME.SIGNIN} />;
  }

  return <>{children}</>;
}
