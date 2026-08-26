import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logout, setToken } from '../redux/slices/authSlice';
import { restoreSession } from '../services/axios/axiosBaseQuery';
import { clearRefreshToken, getRefreshToken } from '../services/auth/refreshTokenStore';

/**
 * Settles the session once, right after redux-persist rehydrates, so protected
 * screens do not fire their first queries against an already-expired token.
 *
 * Runs once per launch — subsequent expiries are handled per-request by
 * axiosBaseQuery.
 */
const useSessionBootstrap = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    (async () => {
      if (!token) {
        // The persisted Redux state is wiped on uninstall but the iOS Keychain
        // is not, so a reinstall can still find a refresh token here. Dropping
        // it keeps uninstall a real sign-out on both platforms.
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
