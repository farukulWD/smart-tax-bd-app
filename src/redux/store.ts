//src/redux/store.ts

import { configureStore, Middleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { rootReducer } from './rootReducer';
import { baseApi } from '../services/baseApi';
import { logout } from './slices/authSlice';
import { cancelInFlightRefresh } from '../services/axios/axiosBaseQuery';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// The cache must be cleared *after* the logout reducer runs. Clearing it first
// wipes the cache while isLoggedIn is still true, so ProtectedScreen has not yet
// swapped its children out and every still-subscribed query refetches at once —
// each refetch 401s, dispatches logout again, and the cycle repeats forever.
const resetApiOnLogout: Middleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  if ((action as { type: string }).type === logout.type) {
    storeAPI.dispatch(baseApi.util.resetApiState());
    cancelInFlightRefresh();
    // redux-persist only writes on its own throttle, so the previous user's
    // token and profile can still be sitting in AsyncStorage if the app is
    // killed right after signing out. flush() writes the cleared state now.
    persistor?.flush();
  }
  return result;
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(baseApi.middleware)
      .concat(resetApiOnLogout),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
