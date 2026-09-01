import { configureStore, Middleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistStore,
  persistReducer,
  createTransform,
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
import { clearRefreshToken } from '../services/auth/refreshTokenStore';

const CACHED_ENDPOINTS = ['getAllTaxTypes', 'getAllFaqs', 'getAllIncomeSources', 'getAllNews'];

const apiCacheTransform = createTransform(
  (inboundState: any) => {
    const queries = inboundState?.queries ?? {};
    const cachedQueries = Object.fromEntries(
      Object.entries(queries).filter(([, entry]: [string, any]) =>
        CACHED_ENDPOINTS.includes(entry?.endpointName)
      )
    );
    return { queries: cachedQueries, mutations: {}, provided: {}, subscriptions: {}, config: inboundState?.config };
  },
  (outboundState) => outboundState,
  { whitelist: [baseApi.reducerPath] }
);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', baseApi.reducerPath],
  transforms: [apiCacheTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const resetApiOnLogout: Middleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  if ((action as { type: string }).type === logout.type) {
    storeAPI.dispatch(baseApi.util.resetApiState());
    cancelInFlightRefresh();
    persistor?.flush();
    void clearRefreshToken();
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

setupListeners(store.dispatch, (dispatch, { onOnline, onOffline }) => {
  return NetInfo.addEventListener((state) => {
    const online = state.isConnected === true && state.isInternetReachable !== false;
    dispatch(online ? onOnline() : onOffline());
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
