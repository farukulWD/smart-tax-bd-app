import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screen/auth/AuthScreen';
import BottomTabNavigator from './BottomTabNavigator';

const useIsSignedIn = () => {
  return true;
};

const useIsSignedOut = () => {
  return !useIsSignedIn();
};

const AppStack = createNativeStackNavigator<AppStackParamList>({
  screenOptions: { headerShown: false },
  screens: {
    BottomTabNavigator: {
      screen: BottomTabNavigator,
    },
    Auth: {
      screen: AuthScreen,
      options: {
        headerShown: false,
      },
    },
  },
});

export default AppStack;

export type AppStackParamList = {
  BottomTabNavigator: undefined;
  Auth: { screen: 'SignIn' | 'SignUp' | 'ForgotPassword' };
};
