import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import '@/global.css';

import { PortalHost } from '@rn-primitives/portal';
import { StatusBar } from 'expo-status-bar';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import Navigation from './navigation/Navigation';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { ThemeSync } from '@/lib/ThemeSync';
import { ThemeProvider } from './context/ThemeProvider';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

export default function App() {
  const { colorScheme } = useColorScheme();

  return (
    <KeyboardProvider>
      <ThemeProvider>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Navigation />
            <PortalHost />
            <ThemeSync />
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </KeyboardProvider>
  );
}
