import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '@/src/navigation/AppStack';
import { useAppDispatch } from '@/src/redux/hooks';
import { setCredentials, setUser } from '@/src/redux/slices/authSlice';
import { useLazyGetUserInfoQuery } from '@/src/services/auth';
import { saveRefreshToken } from '@/src/services/auth/refreshTokenStore';
import { ILoginData } from '@/src/types/authTypes';
import { navigateToStack, replace } from '@/src/utils/NavigationUtils';
import { logger } from '@/src/utils/logger';

/**
 * Stores a fresh session (sign-in or verified sign-up), loads the profile and
 * leaves the Auth screen the way its route params ask.
 */
const useCompleteLogin = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'Auth'>>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [fetchUserInfo, { isFetching: isFetchingUser }] = useLazyGetUserInfoQuery();

  const handleNavigation = () => {
    if (route?.params?.shouldGoBack) {
      return navigation.goBack();
    }

    if (route.params?.redirectTo) {
      if (route.params?.redirectTo.stack) {
        navigateToStack(route.params.redirectTo.stack, { screen: route.params.redirectTo.stack });
      } else {
        replace(route.params.redirectTo.screen);
      }
      return;
    }

    // e.g. sign-up opened from the profile tab without params: leave Auth
    // rather than stay on it while logged in.
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const completeLogin = async ({ accessToken, refreshToken, user }: ILoginData) => {
    dispatch(setCredentials({ token: accessToken, user }));

    await saveRefreshToken(refreshToken);

    try {
      const profile = await fetchUserInfo().unwrap();
      if (profile?.data) {
        dispatch(setUser(profile.data));
      }
    } catch (profileError) {
      logger.log('profileError', JSON.stringify(profileError, null, 2));
    }

    handleNavigation();
  };

  return { completeLogin, isFetchingUser };
};

export default useCompleteLogin;
