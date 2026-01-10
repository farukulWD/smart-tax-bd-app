import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { StatusBar } from 'expo-status-bar';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import Navigation from './navigation/Navigation';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { ThemeSync } from '@/lib/ThemeSync';

export default function App() {
  const { colorScheme } = useColorScheme();

  return (
    <KeyboardProvider>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        {/* <ThemeToggle /> */}
        {/* <View className="flex-1 items-center justify-center border bg-background">
        <View className="h-10 w-10 bg-emerald-600" />
        <Button variant={'outline'} size={'lg'}>
          <Text>Hello</Text>
        </Button>
      </View> */}
        <Navigation />
        <PortalHost />
        <ThemeSync />
      </ThemeProvider>
    </KeyboardProvider>
  );
}
const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  console.log('colorScheme', JSON.stringify(colorScheme, null, 2));
  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}
