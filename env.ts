export const ENV: 'production' | 'dev' | 'local' = 'production';

const CONFIG = {
  production: {
    BASE_URL: 'https://api.smarttaxbd.com/api/v1',
  },
  dev: {
    BASE_URL: 'https://api.dev.smarttaxbd.com/api/v1',
  },
  local: {
    BASE_URL: 'http://192.168.0.101:5000/api/v1',
  },
};

export default CONFIG[ENV];
