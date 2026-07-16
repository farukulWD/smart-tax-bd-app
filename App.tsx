import './global.css';
import './src/localization/i18n';

import { PortalHost } from '@rn-primitives/portal';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Provider } from 'react-redux';
import { persistor, store } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import ThemedApp from './src/theme/ThemedApp';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <KeyboardProvider>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <PortalHost />
            <ThemedApp />
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </KeyboardProvider>
  );
}
