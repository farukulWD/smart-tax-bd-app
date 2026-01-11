import { RootStackParamList } from "@/navigation/AppStack";
import { createNavigationContainerRef, CommonActions, StackActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export const navigationRef = createNavigationContainerRef();
export const useAppNavigation = () => useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
  navigate("BottomTabNavigator", {
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
    // Check if canGoBack is true
    if (navigationRef.canGoBack()) {
      navigationRef.dispatch(CommonActions.goBack());
    } else {
      // Fallback: Navigate to default screen (e.g., Drawer > BottomTabNavigator > HomeStack)
      navigationRef.dispatch(
        CommonActions.navigate({
          name: "BottomTabNavigator",
          params: { screen: "HomeStack", params: { screen: "Home" } },
        })
      );
    }
  } else {
    console.warn("Navigation ref is not ready");
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
