import { goBack, push } from 'connected-react-router';
import { LocationDescriptorObject } from 'history';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { ActionType, createAction, getType } from 'typesafe-actions';
import { some, SUCCESS_CODE } from '../../../constants';
import { API_PATHS } from '../../../configs/API';
import { ROUTES_TAB } from '../../../configs/routes';
import { getCurrentRole, getListRoutesContain } from '../../../layout/utils';
import { SelectItem } from '../../../models/object';
import { Role } from '../../../models/permission';
import { AppState } from '../../../redux/reducers';
import { fetchThunk, fetchThunk2 } from './thunk';
import { setCaIDListPost } from './actions';

export function uploadImage(
  files: File[],
  config?: string,
): ThunkAction<Promise<some>, AppState, null, Action<string>> {
  return async dispatch => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
      formData.append('config', config || 'SOCIAL-IMAGE');
    });
    return await dispatch(fetchThunk(API_PATHS.uploadImage, 'post', formData, false));
  };
}

export function uploadFile(
  files: File[],
  config?: string,
): ThunkAction<Promise<some>, AppState, null, Action<string>> {
  return async dispatch => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
      formData.append('config', config || 'SOCIAL-REPORT');
    });
    return await dispatch(fetchThunk(API_PATHS.uploadFile, 'post', formData));
  };
}

export type NotistackType = 'error' | 'success' | 'warning' | 'info';

export interface CommonState {
  networkErrorMsg: string;
  errorMessage: string;
  notistackMessage: string;
  notistackType: NotistackType;
  authErrorMsg: string;
  openErrorDialog: boolean;
  generalZone?: SelectItem[];
  statisticPost?: some;
  statisticNotifications?: some;
  caIDListPost?: some[];
}

export const setOpenErrorDialog = createAction('common/setOpenErrorDialog', (val: boolean) => ({
  val,
}))();
export const setNetworkError = createAction(
  'common/setNetworkError',
  (val: string, open: boolean) => ({ val, open }),
)();

export const setAuthError = createAction('common/setAuthError', (val: string) => ({ val }))();
export const setErrorMessage = createAction('common/setErrorMessage', (val: string) => ({ val }))();
export const setGeneralCompanySize = createAction(
  'common/setGeneralCompanySize',
  (val: SelectItem[]) => ({
    val,
  }),
)();
export const setUserPermission = createAction('common/setUserPermission', (val: string) => ({
  val,
}))();

export const setNotistackMessage = createAction(
  'common/setNotistackMessage',
  (message: string, type: NotistackType) => ({ message, type }),
)();

export const setGeneralZone = createAction('common/setGeneralZone', (val: SelectItem[]) => ({
  val,
}))();
export const setStatisticPost = createAction('common/setStatisticPost', (val: some) => ({
  val,
}))();

export const setStatisticNotifications = createAction(
  'common/setStatisticNotifications',
  (val: some) => ({
    val,
  }),
)();

export function isHasPermission(
  permission?: Role[] | string,
): ThunkAction<boolean, AppState, null, Action<string>> {
  return (dispatch, getState) => {
    const state = getState();
    const { account } = state;
    return getCurrentRole(account.userData?.roleGroup?.role, permission);
  };
}

export function goBackAction(): ThunkAction<Promise<void>, AppState, null, Action<string>> {
  return async (dispatch, getState) => {
    const state = getState();
    const { router } = state;
    const listRoutes = getListRoutesContain([...ROUTES_TAB], router.location.pathname).reverse();
    const backAble =
      listRoutes[1] && router?.location?.state
        ? (router?.location?.state as some)[`${listRoutes[1].path}`]
        : false;
    if (backAble) {
      dispatch(goBack());
    } else if (listRoutes.length > 1) {
      dispatch(push({ pathname: listRoutes[1]?.path, state: router.location.state }));
    } else if (
      router?.location?.state &&
      Object.entries(router?.location?.state as SelectItem).length > 0
    ) {
      dispatch(goBack());
    } else {
      dispatch(push({ pathname: '/', state: router.location.state }));
    }
  };
}

export function goToAction(
  location: LocationDescriptorObject,
): ThunkAction<Promise<void>, AppState, null, Action<string>> {
  return async (dispatch, getState) => {
    const state = getState();
    const { router } = state;
    dispatch(
      push({
        ...location,
        state: {
          ...router.location.state,
          [`${router.location.pathname}`]: true,
          ...location.state,
        },
      }),
    );
  };
}

export function fetchGeneralData(): ThunkAction<Promise<void>, AppState, null, Action<string>> {
  return async (dispatch, getState) => {
    const state = getState();
    const { account } = state;
    const fetchGeneralPermission = dispatch(
      fetchThunk2(API_PATHS.getUserPermissions(account.userData?.id), 'get'),
    );
    const localeJson = await fetchGeneralPermission;

    if (localeJson?.code === SUCCESS_CODE) {
      dispatch(setUserPermission(localeJson.data));
    }
  };
}

export function fetchStatisticPost(): ThunkAction<Promise<void>, AppState, null, Action<string>> {
  return async dispatch => {
    const actionsStatisticPost = dispatch(fetchThunk(API_PATHS.statisticPost, 'get'));
    const statisticPost = await actionsStatisticPost;

    if (statisticPost?.code === SUCCESS_CODE) {
      dispatch(setStatisticPost(statisticPost.data));
    }
  };
}

export function fetchStatisticPostNotifications(): ThunkAction<
  Promise<void>,
  AppState,
  null,
  Action<string>
> {
  return async dispatch => {
    const actionStatisticNotifications = dispatch(
      fetchThunk(API_PATHS.statisticNotifications, 'get'),
    );

    const statisticNotifications = await actionStatisticNotifications;

    if (statisticNotifications?.code === SUCCESS_CODE) {
      dispatch(setStatisticNotifications(statisticNotifications.data));
    }
  };
}

const actions = {
  setOpenErrorDialog,
  setNetworkError,
  setErrorMessage,
  setNotistackMessage,
  setAuthError,
  setGeneralCompanySize,
  setGeneralZone,
  setStatisticPost,
  setStatisticNotifications,
  setCaIDListPost,
};

type ActionT = ActionType<typeof actions>;

export default function reducer(
  state: CommonState = {
    openErrorDialog: false,
    networkErrorMsg: '',
    errorMessage: '',
    notistackMessage: '',
    notistackType: 'error',
    authErrorMsg: '',
    statisticPost: {},
    statisticNotifications: {},
    caIDListPost: [],
  },
  action: ActionT,
): CommonState {
  switch (action.type) {
    case getType(setOpenErrorDialog):
      return { ...state, openErrorDialog: action.payload.val };
    case getType(setErrorMessage):
      return { ...state, errorMessage: action.payload.val };
    case getType(setNotistackMessage):
      return {
        ...state,
        notistackMessage: action.payload.message,
        notistackType: action.payload.type,
      };
    case getType(setNetworkError):
      return {
        ...state,
        networkErrorMsg: action.payload.val,
        openErrorDialog: action.payload.open,
      };
    case getType(setAuthError):
      return { ...state, authErrorMsg: action.payload.val };
    case getType(setGeneralZone):
      return { ...state, generalZone: action.payload.val };
    case getType(setStatisticPost):
      return { ...state, statisticPost: action.payload.val };
    case getType(setStatisticNotifications):
      return { ...state, statisticNotifications: action.payload.val };
    case getType(setCaIDListPost):
      return { ...state, caIDListPost: action.payload.list };
    default:
      return state;
  }
}
