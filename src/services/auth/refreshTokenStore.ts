import * as SecureStore from 'expo-secure-store';

/**
 * The refresh token is the long-lived half of the session — it is what keeps a
 * user signed in until they explicitly log out or uninstall — so it lives in
 * the iOS Keychain / Android Keystore rather than alongside the rest of the
 * persisted Redux state in plaintext AsyncStorage.
 *
 * Every call is guarded: SecureStore throws on devices without a usable
 * keystore (and on some Android OEM builds), and a failure to stash a token
 * must never take the login flow down with it.
 */
const REFRESH_TOKEN_KEY = 'smarttax.refreshToken';

export const saveRefreshToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.log('[secure-store] failed to save refresh token', error);
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.log('[secure-store] failed to read refresh token', error);
    return null;
  }
};

export const clearRefreshToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.log('[secure-store] failed to clear refresh token', error);
  }
};
