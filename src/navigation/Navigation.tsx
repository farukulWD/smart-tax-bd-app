import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import AppStack from './AppStack';
import { navigationRef } from '../utils/NavigationUtils';
import { useTheme, COLOR_TOKENS } from '../context/ThemeProvider';

const Navigation = () => {
  const { theme } = useTheme();
  const colors = COLOR_TOKENS[theme];

  const navigationTheme = {
    ...(theme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.background,
    },
  };

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <AppStack />
    </NavigationContainer>
  );
};

export default Navigation;
