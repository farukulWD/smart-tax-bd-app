import { IUser } from '@/src/types/authTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  token: string | null;
  user: IUser | null;
  isLoggedIn: boolean;
  theme: 'dark' | 'light';
  insets: {
    top: number;
    bottom: number;
    right: number;
    left: number;
  };
};

const initialState: AuthState = {
  token: null,
  user: null,
  isLoggedIn: false,
  theme: 'light',
  insets: {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: IUser }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    removeToken: (state) => {
      state.token = null;
    },
    toggleLocalTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setInsets: (state, action) => {
      state.insets = action.payload;
    },
  },
});

export const { setCredentials, logout, setToken, removeToken, toggleLocalTheme, setInsets } =
  authSlice.actions;
export default authSlice.reducer;
