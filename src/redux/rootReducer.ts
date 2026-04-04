//src/redux/rootReducer.ts

import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { baseApi } from '../services/baseApi';

export const rootReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootReducerType = ReturnType<typeof rootReducer>;
