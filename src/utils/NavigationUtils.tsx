import {
  createNavigationContainerRef,
  CommonActions,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/AppStack';
import { logger } from './logger';

export const navigationRef = createNavigationContainerRef();
export const useAppNavigation = () => useNavigation<NativeStackNavigationProp<AppStackParamList>>();

export async function navigate(routeName: string, params?: object) {
  navigationRef.isReady();
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.navigate(routeName, params));
  }
}

export async function replace(routeName: string, params?: object) {
  navigationRef.isReady();
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(routeName, params));
  }
}

export async function resetAndNavigate(routeName: string) {
  navigationRef.isReady();
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName }],
      })
    );
  }
}

type StackParams = {
  screen?: string;
  params?: Record<string, any>;
};

export function navigateToStack(stackName: string, options?: StackParams) {
  navigate('BottomTabNavigator', {
    screen: stackName,
    params: options?.screen
      ? {
          screen: options.screen,
          params: options.params,
        }
      : options?.params,
  });
}

export async function goBack() {
  if (navigationRef.isReady()) {
    if (navigationRef.canGoBack()) {
      navigationRef.dispatch(CommonActions.goBack());
    } else {
      navigationRef.dispatch(
        CommonActions.navigate({
          name: 'BottomTabNavigator',
          params: { screen: 'HomeStack', params: { screen: 'Home' } },
        })
      );
    }
  } else {
    logger.warn('Navigation ref is not ready');
  }
}

export async function push(routeName: string, params?: object) {
  navigationRef.isReady();
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(routeName, params));
  }
}

export async function prepareNavigation() {
  navigationRef.isReady();
}
