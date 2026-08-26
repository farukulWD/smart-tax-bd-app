import env from '@/env';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Treat a token as expired slightly early: one that expires while the request
// is in flight would otherwise come back as a 401 instead of being refreshed
// up front.
const EXPIRY_LEEWAY_SECONDS = 30;

export const isTokenExpired = (token: string) => {
  const decodedToken = jwtDecode<{ exp: number }>(token);
  const currentTime = Date.now() / 1000;
  return decodedToken?.exp < currentTime + EXPIRY_LEEWAY_SECONDS;
};

export const instance = axios.create({
  withCredentials: true,
  baseURL: env.BASE_URL,
  timeout: 60000,
});

instance.defaults.headers['Accept'] = 'application/json';

export const refreshInstance = axios.create({
  withCredentials: true,
  baseURL: env.BASE_URL,
  timeout: 60000,
});

// Logs every response (and failed response) that goes through the app's axios
// clients. Useful for tracing 401s / session-expiry issues from the device.
const attachResponseLogger = (client: typeof instance, label: string) => {
  client.interceptors.response.use(
    (response) => {
      console.log(
        `[${label}] ${response.config.method?.toUpperCase()} ${response.config.url} -> ${response.status}`,
        JSON.stringify(response.data, null, 2)
      );
      return response;
    },
    (error) => {
      console.log(
        `[${label}] ${error?.config?.method?.toUpperCase()} ${error?.config?.url} -> ${
          error?.response?.status ?? 'NO_RESPONSE'
        }`,
        JSON.stringify(error?.response?.data ?? error?.message, null, 2)
      );
      return Promise.reject(error);
    }
  );
};

attachResponseLogger(instance, 'api');
attachResponseLogger(refreshInstance, 'refresh');
