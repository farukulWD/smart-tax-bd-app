import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewsScreen from '../screen/document/NewsScreen';
import { useTheme, COLOR_TOKENS } from '../context/ThemeProvider';

export type DocumentStackParamList = {
  News: undefined;
};

const Stack = createNativeStackNavigator<DocumentStackParamList>();

export default function DocumentStack() {
  const { theme } = useTheme();
  const colors = COLOR_TOKENS[theme];

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
