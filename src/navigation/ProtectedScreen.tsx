import { ReactNode } from 'react';
import { useAppSelector } from '../redux/hooks';
import AuthScreen from '../screen/auth/AuthScreen';
import { SCREEN_NAME } from '../types/authTypes';

type Props = {
  children: ReactNode;
};

export default function ProtectedScreen({ children }: Props) {
  const { user } = useAppSelector((state) => state.auth);

  if (!user?.accessToken) {
    return <AuthScreen initialScreen={SCREEN_NAME.SIGNIN} />;
  }

  return <>{children}</>;
}
