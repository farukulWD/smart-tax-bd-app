import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useAppDispatch } from '../redux/hooks';
import { setNetworkState } from '../redux/slices/networkSlice';

const useNetworkStatus = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      dispatch(
        setNetworkState({
          isConnected: state.isConnected,
          isInternetReachable: state.isInternetReachable,
        })
      );
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      dispatch(
        setNetworkState({
          isConnected: state.isConnected,
          isInternetReachable: state.isInternetReachable,
        })
      );
    });

    return () => unsubscribe();
  }, [dispatch]);
};

export default useNetworkStatus;
