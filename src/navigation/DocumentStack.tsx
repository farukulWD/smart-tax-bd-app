import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewsScreen from '../screen/document/NewsScreen';
import { useThemeColors } from '../theme/useThemeColors';

export type DocumentStackParamList = {
  News: undefined;
};

const Stack = createNativeStackNavigator<DocumentStackParamList>();

export default function DocumentStack() {
  const { colors } = useThemeColors();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="News" component={NewsScreen} />
    </Stack.Navigator>
  );
}
