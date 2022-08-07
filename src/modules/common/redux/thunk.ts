import { get } from 'js-cookie';
import { sha256 } from 'js-sha256';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { v4 as uuidv4 } from 'uuid';
import { some, TOKEN } from '../../../constants';
import { AppState } from '../../../redux/reducers';
import { ACCESS_TOKEN, APP_ID, APP_ID_SOCIAL, APP_KEY, APP_KEY_SOCIAL } from '../../auth/constants';
import { setAuthError, setNetworkError } from './reducer';

// eslint-disable-next-line prefer-const
export function fetchThunk(
  url: string,
  method: 'get' | 'post' | 'delete' | 'put' = 'get',
  body?: string | FormData,
  auth = true,
  fallbackResponse?: some, // if given, will not retry at all and return this
  getBlob = false, // if given, response will return blob type instead of json data
): ThunkAction<Promise<some>, AppState, null, Action<string>> {
  return async (dispatch, getState) => {
    while (true) {
      const controller = new AbortController();
      const { signal } = controller;
      // eslint-disable-next-line prefer-const
      const timestamp = new Date().getTime();
      const timestampCS = timestamp / 1000 - ((timestamp / 1000) % 300);
      const str = `${timestampCS}:${APP_KEY_SOCIAL}`;
      const AppHash = Buffer.from(sha256(str), 'hex').toString('base64');

      setTimeout(() => {
        controller.abort();
      }, 30000);

      let res;
      try {
        let headers;
        if (
          url.includes('/api/tripi') ||
          url.includes('/tripi-social') ||
          url.includes('/assets') ||
          url.includes('/msgs')
        ) {
          headers = {
            'Content-Type': 'application/json',
            'Accept-Language': getState().intl.locale.substring(0, 2),
            'login-token': `${get(ACCESS_TOKEN)}`,
            version: '1.0',
            appId: `${APP_ID_SOCIAL}`,
            appHash: `${AppHash}`,
            timestamp: timestamp.toString(),
            'msg-app': url.includes('/msgs') ? 'social-portal' : undefined,
            'device-id': url.includes('/msgs') ? uuidv4() : undefined,
          };
        } else {
          headers = {
            'Content-Type': 'application/json',
            'Accept-Language': getState().intl.locale.substring(0, 2),
            // 'login-token': `${get(ACCESS_TOKEN)}`,
            version: '1.0',
            appId: `${APP_ID_SOCIAL}`,
            appHash: `${AppHash}`,
            timestamp: timestamp.toString(),
            'device-id': 'deviceIdadasd',
          };
        }

        if (body instanceof FormData) {
          headers = {
            'Content-Type': 'application/json',
            'login-token': `${get(ACCESS_TOKEN)}`,
          };
          delete headers['Content-Type'];
          if (!auth) {
            delete headers['login-token'];
          }
        }

        // if (!auth) {
        //   delete headers['login-token'];
        // }
        if (!auth) {
        }
        res = await fetch(url, {
          method,
          body,
          headers,
          signal,
          cache: 'no-store',
        });
      } catch (_) {}

      if (res !== undefined) {
        if (res.status === 401) {
          dispatch(setAuthError(await res.text()));
          return null;
        }
        if ((res.status >= 400 && res.status <= 500) || (res.code >= 400 && res.code <= 500)) {
          return res.json();
        }
        if (res.status === 200 && res.ok) {
          return !getBlob ? await res.json() : await res.blob();
        }
        return fallbackResponse;
      }
      if (fallbackResponse) {
        return fallbackResponse;
      }

      let hasInternet = true;
      try {
        await fetch('https://tripi.vn', { mode: 'no-cors' });
      } catch (_) {
        hasInternet = false;
      }
      dispatch(setNetworkError(hasInternet ? 'serverProblem' : 'unstableNetwork', true));
      do {
        await new Promise(resolve => setTimeout(resolve, 350));
        if (!getState().common.openErrorDialog) {
          break;
        }
      } while (getState().common.networkErrorMsg);
      if (!getState().common.openErrorDialog) {
        break;
      }
      continue;
    }
    return null;
  };
}
export function fetchThunk2(
  url: string,
  method: 'get' | 'post' | 'delete' | 'put' = 'get',
  body?: string | FormData,
  auth = true,
  fallbackResponse?: some, // if given, will not retry at all and return this
  getBlob = false, // if given, response will return blob type instead of json data
): ThunkAction<Promise<some>, AppState, null, Action<string>> {
  return async (dispatch, getState) => {
    while (true) {
      const controller = new AbortController();
      const { signal } = controller;
      // eslint-disable-next-line prefer-const
      const timestamp = new Date().getTime();
      const timestampCS = timestamp / 1000 - ((timestamp / 1000) % 300);
      const AppHash = Buffer.from(sha256(`${timestampCS}:${APP_KEY}`), 'hex').toString('base64');
      setTimeout(() => {
        controller.abort();
      }, 30000);

      let res;
      try {
        let headers;
        if (url.includes('/api/tripi')) {
          headers = {
            'Content-Type': 'application/json',
            'Accept-Language': getState().intl.locale.substring(0, 2),
            login_token: `${get(TOKEN)}`,
            version: '1.0',
            appId: `${APP_ID}`,
            appHash: `${AppHash}`,
            timestamp: timestamp.toString(),
          };
        } else {
          headers = {
            'Content-Type': 'application/json',
            'Accept-Language': getState().intl.locale.substring(0, 2),
            'login-token': `${get(ACCESS_TOKEN)}`,
            version: '1.0',
            appId: `${APP_ID}`,
            appHash: `${AppHash}`,
            timestamp: timestamp.toString(),
          };
        }

        // if (body instanceof FormData) {
        //   delete headers['Content-Type'];
        // }
        if (!auth) {
          delete headers['login-token'];
        }
        res = await fetch(url, {
          method,
          body,
          headers,
          signal,
          cache: 'no-store',
        });
      } catch (_) {}
      if (res !== undefined) {
        if (res.status === 401) {
          dispatch(setAuthError(await res.text()));
          return null;
        }
        if (res.status === 200 && res.ok) {
          return !getBlob ? await res.json() : await res.blob();
        }
        return fallbackResponse;
      }
      if (fallbackResponse) {
        return fallbackResponse;
      }

      let hasInternet = true;
      try {
        await fetch('https://tripi.vn', { mode: 'no-cors' });
      } catch (_) {
        hasInternet = false;
      }
      dispatch(setNetworkError(hasInternet ? 'serverProblem' : 'unstableNetwork', true));
      do {
        await new Promise(resolve => setTimeout(resolve, 350));
        if (!getState().common.openErrorDialog) {
          break;
        }
      } while (getState().common.networkErrorMsg);
      if (!getState().common.openErrorDialog) {
        break;
      }
      continue;
    }
    return null;
  };
}
