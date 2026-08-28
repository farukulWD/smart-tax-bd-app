import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logout, setToken } from '../redux/slices/authSlice';
import { restoreSession } from '../services/axios/axiosBaseQuery';
import { clearRefreshToken, getRefreshToken } from '../services/auth/refreshTokenStore';

const useSessionBootstrap = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    (async () => {
      if (!token) {
        const orphaned = await getRefreshToken();
        if (orphaned) await clearRefreshToken();
        return;
      }

      const { token: restored, ended } = await restoreSession(token);

      if (ended) {
        dispatch(logout());
        return;
      }

      if (restored && restored !== token) {
        dispatch(setToken(restored));
      }
    })();
  }, [dispatch, token]);
};

export default useSessionBootstrap;
