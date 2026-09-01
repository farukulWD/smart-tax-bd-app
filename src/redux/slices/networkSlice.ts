import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type NetworkState = {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  isOnline: boolean;
};

const initialState: NetworkState = {
  isConnected: null,
  isInternetReachable: null,
  isOnline: true,
};

export const deriveIsOnline = (isConnected: boolean | null, isInternetReachable: boolean | null) =>
  isConnected === true && isInternetReachable !== false;

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetworkState: (
      state,
      action: PayloadAction<{ isConnected: boolean | null; isInternetReachable: boolean | null }>
    ) => {
      state.isConnected = action.payload.isConnected;
      state.isInternetReachable = action.payload.isInternetReachable;
      state.isOnline = deriveIsOnline(action.payload.isConnected, action.payload.isInternetReachable);
    },
  },
});

export const { setNetworkState } = networkSlice.actions;
export default networkSlice.reducer;
