import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import AppStack from './AppStack';
import { navigationRef } from '../utils/NavigationUtils';
import { useThemeColors } from '../theme/useThemeColors';

const Navigation = () => {
  const { colors, colorScheme } = useThemeColors();

  const navigationTheme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
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
