import '@/global.css';

import { PortalHost } from '@rn-primitives/portal';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import Navigation from './navigation/Navigation';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { ThemeSync } from '@/lib/ThemeSync';
import { ThemeProvider } from './context/ThemeProvider';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import { toastConfig } from './utils/ToastConfig';

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
            <Toast config={toastConfig} />
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </KeyboardProvider>
  );
}
