import { View, Pressable } from 'react-native';
import { useThemeColors } from '@/src/theme/useThemeColors';
import LucideIcon from './LucideIcon';

const ToggleTheme = () => {
  const { toggleColorScheme, colorScheme } = useThemeColors();
  const isDark = colorScheme === 'dark';

  return (
    <View>
      <Pressable onPress={toggleColorScheme}>
        <LucideIcon name={isDark ? 'Sun' : 'Moon'} className="text-lg text-foreground" />
      </Pressable>
    </View>
  );
};

export default ToggleTheme;
