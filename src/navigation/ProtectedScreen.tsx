import React, { ReactNode, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../redux/hooks';

type Props = {
  children: ReactNode;
  redirectTo?: { stack?: string; screen: string };
};

export default function ProtectedScreen({ children, redirectTo }: Props) {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.replace('Auth', { redirectTo });
    }
  }, [isLoggedIn, navigation, redirectTo]);

  if (!isLoggedIn) return null;

  return <>{children}</>;
}
