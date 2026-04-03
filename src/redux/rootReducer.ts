import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { apiService } from '@/src/services/api';

export const rootReducer = combineReducers({
  auth: authReducer,
  [apiService.reducerPath]: apiService.reducer,
});

export type RootReducerType = ReturnType<typeof rootReducer>;
