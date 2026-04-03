export const ENV: 'production' | 'local' = 'production';

const CONFIG = {
  production: {
    BASE_URL: 'http://localhost:5001/api/v1',
  },
  local: {
    BASE_URL: 'http://localhost:5001/api/v1',
  },
};

export default CONFIG[ENV];
