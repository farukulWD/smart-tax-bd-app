import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import networkReducer from './slices/networkSlice';
import { baseApi } from '../services/baseApi';

export const rootReducer = combineReducers({
  auth: authReducer,
  network: networkReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootReducerType = ReturnType<typeof rootReducer>;
