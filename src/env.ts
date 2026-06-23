export const ENV: 'production' | 'local' = 'production';

const CONFIG = {
  production: {
    BASE_URL: 'https://api.dev.smarttaxbd.com/api/v1',
  },
  local: {
    BASE_URL: 'http://localhost:5001/api/v1',
  },
};

export default CONFIG[ENV];
/*

01991002474
123456aA@
 */
