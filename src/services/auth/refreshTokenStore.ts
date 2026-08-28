import * as SecureStore from 'expo-secure-store';
import { logger } from '@/src/utils/logger';

const REFRESH_TOKEN_KEY = 'smarttax.refreshToken';

export const saveRefreshToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    logger.log('[secure-store] failed to save refresh token', error);
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    logger.log('[secure-store] failed to read refresh token', error);
    return null;
  }
};

export const clearRefreshToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    logger.log('[secure-store] failed to clear refresh token', error);
  }
};
