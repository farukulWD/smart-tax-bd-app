import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/home/HomeScreen';
import AuthScreen from '../screen/auth/AuthScreen';

const useIsSignedIn = () => {
  return true;
};

const useIsSignedOut = () => {
  return !useIsSignedIn();
};

const AppStack = createNativeStackNavigator<AppStackParamList>({
  screenOptions: { headerShown: false },
  screens: {
    Home: {
      screen: HomeScreen,
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
  Home: undefined;
  Auth: { screen: 'SignIn' | 'SignUp' | 'ForgotPassword' };
};
