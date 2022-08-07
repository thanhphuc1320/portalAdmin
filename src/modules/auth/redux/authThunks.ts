import { push } from 'connected-react-router';
import 'firebase/app';
import 'firebase/messaging';
import { get, remove, set } from 'js-cookie';
import { batch } from 'react-redux';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { API_PATHS } from '../../../configs/API';
import { some, SUCCESS_CODE } from '../../../constants';
import firebase from '../../../firebase/firebaseConfig';
import { AppState, clearStoreAfterLogout } from '../../../redux/reducers';
import { setUserData } from '../../account/redux/accountReducer';
import { ACCESS_TOKEN, USER_DATA } from '../../auth/constants';
import { fetchThunk } from '../../common/redux/thunk';
import { inAction, out, setAuthenticating, setValidatingToken } from './authReducer';

export interface ILoginData {
  email: string;
  password: string;
}

export const defaultLoginData: ILoginData = {
  email: '0854328940',
  password: '123456',
};
export interface IFirstLoginData {
  username: string;
  password: string;
  confirmPassword: string;
}

export const defaultFirstLoginData: IFirstLoginData = {
  username: '',
  password: '',
  confirmPassword: '',
};
export interface IChangePasswordData {
  password: string;
  confirmPassword: string;
}

export const defaultChangePasswordData: IChangePasswordData = {
  password: '',
  confirmPassword: '',
};
export interface IRegisterData {
  companyName: string;
  companySize: number | null;
  contactPersonName: string;
  email: string;
  phone: string;
  referenceContactPhone: string;
}

export const defaultRegisterData: IRegisterData = {
  companyName: '',
  companySize: null,
  contactPersonName: '',
  phone: '',
  email: '',
  referenceContactPhone: '',
};

export function authIn(
  userData: some,
  skipSaga: boolean = false,
): ThunkAction<void, AppState, null, Action<string>> {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(setUserData(userData));
    set(USER_DATA, userData);
    const messaging = firebase.messaging();
    messaging
      .requestPermission()
      .then(async () => {
        const token = await messaging.getToken();
        if (token) {
          await dispatch(
            fetchThunk(
              `${API_PATHS.firebase} `,
              'post',
              JSON.stringify({ platform: 'WEB', token }),
            ),
          );
        }
      })
      .catch(() => {});
    if (!state.auth.auth) {
      dispatch(inAction(skipSaga));
    }
  };
}

export function clearDataLogout(): ThunkAction<void, AppState, null, Action<string>> {
  return async dispatch => {
    remove(ACCESS_TOKEN);
    remove(USER_DATA);
    dispatch(out());
    dispatch(setUserData());
    dispatch(clearStoreAfterLogout());
  };
}

export function validateAccessToken(
  periodic = false,
): ThunkAction<void, AppState, null, Action<string>> {
  return async (dispatch, getState) => {
    let prevAccessToken = get(ACCESS_TOKEN);
    let first = true;
    const fn = async (force = false) => {
      const accessToken = get(ACCESS_TOKEN);
      const state = getState();
      if (accessToken) {
        if (first || prevAccessToken !== accessToken || force) {
          first = false;
          dispatch(setValidatingToken(true));
          try {
            const json = await dispatch(fetchThunk(`${API_PATHS.validateAccessToken}`, 'get'));
            if (json && json.code === SUCCESS_CODE) {
              dispatch(authIn(json.data));
              prevAccessToken = accessToken;
            } else if (getState().auth.auth) {
              dispatch(clearDataLogout());
              dispatch(
                push({
                  pathname: '/',
                }),
              );
            }
          } finally {
            dispatch(setValidatingToken(false));
          }
        }
      } else if (state.auth.auth) {
        dispatch(out());
      }
    };
    if (periodic) {
      setInterval(fn, 1000);
    } else {
      fn(true);
    }
  };
}

export function login(
  data: ILoginData,
): ThunkAction<Promise<some>, AppState, null, Action<string>> {
  return async dispatch => {
    dispatch(setAuthenticating(true));
    try {
      const json = await dispatch(fetchThunk(API_PATHS.login, 'post', JSON.stringify(data)));
      if (json?.code === SUCCESS_CODE) {
        set(ACCESS_TOKEN, json.data.accessToken);
        dispatch(validateAccessToken());
        return json;
      }
      return json;
    } finally {
      dispatch(setAuthenticating(false));
    }
  };
}

export function logout(): ThunkAction<void, AppState, null, Action<string>> {
  return async dispatch => {
    dispatch(clearDataLogout());
    const messaging = firebase.messaging();
    messaging
      .requestPermission()
      .then(async () => {
        const token = await messaging.getToken();
        if (token) {
          await dispatch(fetchThunk(`${API_PATHS.firebaseUnregister}?token=${token}`, 'delete'));
          remove(ACCESS_TOKEN);
        }
        // dispatch(fetchThunk(API_PATHS.logout, 'delete'));
        batch(() => {
          dispatch(out());
          dispatch(clearStoreAfterLogout());
        });
      })
      .catch(() => {
        // dispatch(fetchThunk(API_PATHS.logout, 'delete'));
        batch(() => {
          dispatch(out());
          dispatch(clearStoreAfterLogout());
        });
        remove(ACCESS_TOKEN);
      });
  };
}
