import env from '@/src/env';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token: string) => {
  const decodedToken = jwtDecode<{ exp: number }>(token);
  const currentTime = Date.now() / 1000;
  return decodedToken?.exp < currentTime;
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
