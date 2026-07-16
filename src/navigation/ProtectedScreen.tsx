import { ReactNode } from 'react';
import { useAppSelector } from '../redux/hooks';
import AuthScreen from '../screen/auth/AuthScreen';

type Props = {
  children: ReactNode;
};

export default function ProtectedScreen({ children }: Props) {
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  if (!isLoggedIn) {
    return <AuthScreen initialScreen={'SignIn'} />;
  }

  return <>{children}</>;
}
