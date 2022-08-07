import axios from 'axios';
// import { get } from 'js-cookie';
// import { sha256 } from 'js-sha256';
import JSONbig from 'json-bigint';
import { some } from '../../../../constants';
// import { configs } from '../../constants/config';
// import { some, UUID, ACCESS_TOKEN } from '../../constants/constant';
// import { isEmpty } from './helpers';

// const timeStamp = new Date().getTime();
// const AppHash = Buffer.from(
//   sha256(`${timeStamp / 1000 - ((timeStamp / 1000) % 300)}:${configs().APP_KEY}`),
//   'hex',
// ).toString('base64');

const request = axios.create({
  baseURL: '',
  headers: {
    'accept-language': 'vi',
    'Content-Type': 'application/json',
    // 'login-token': `${get(ACCESS_TOKEN) || localStorage.getItem(ACCESS_TOKEN) || ''}`,
    // 'device-id': `${localStorage.getItem(UUID) || ''}`,
    // version: configs().VERSION,
    // appHash: AppHash,
    // appId: configs().APP_ID,
  },
});

request.interceptors.request.use(
  (config: some) => {
    const tempConfig: some = {
      ...config,
      headers: {
        ...config.headers,
        // 'login-token': `${get(ACCESS_TOKEN) || localStorage.getItem(ACCESS_TOKEN) || ''}`,
        // 'device-id': `${localStorage.getItem(UUID) || ''}`,
      },
    };
    if (tempConfig?.url.includes('/account/login')) {
      delete tempConfig?.headers['device-id'];
      delete tempConfig?.headers['login-token'];
    }
    return {
      ...tempConfig,
      headers: {
        ...tempConfig?.headers,
      },
    };
  },
  error => Promise.reject(error),
);

request.interceptors.response.use(
  response => {
    const res = JSONbig.parse(response?.request?.response);
    if (res.code === 3003) {
      // eslint-disable-next-line no-alert
      window.alert(
        'Hệ thống yêu cầu cài đặt thời gian chính xác để thực hiện tính năng chat hỗ trợ. Quý khách vui lòng mở phần Cài đặt của thiết bị này và chuyển Ngày Giờ sang chế độ Tự động',
      );
    }
    return res;
  },
  error => {
    return Promise.reject(error.response);
  },
);

const api = (options: some) => {
  return request({
    baseURL: '',
    ...options,
    headers: { ...options.headers },
  });
};

export default api;
