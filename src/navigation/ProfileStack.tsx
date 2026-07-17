import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screen/profile/ProfileScreen';
import MyPaymentsScreen from '../screen/profile/MyPaymentsScreen';
import MyOrdersScreen from '../screen/profile/MyOrdersScreen';
import AboutUsScreen from '../screen/profile/AboutUsScreen';
import ContactUsScreen from '../screen/profile/ContactUsScreen';
import { useThemeColors } from '../theme/useThemeColors';

export type ProfileStackParamList = {
  Profile: undefined;
  MyPayments: undefined;
  MyOrders: undefined;
  AboutUs: undefined;
  ContactUs: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  const { colors } = useThemeColors();

  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="MyPayments" component={MyPaymentsScreen} />
      <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
    </Stack.Navigator>
  );
}
