import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { createAction } from 'typesafe-actions';
import { some, SUCCESS_CODE } from '../../../constants';
import { API_PATHS } from 'configs/API';
import { AppState } from 'redux/reducers';
import { fetchThunk } from './thunk';

export const setCaIDListPost = createAction('common/setCaIDListPost', (list: some[]) => ({
  list,
}))();

export function fetchCaIDListPost(): ThunkAction<Promise<void>, AppState, null, Action<string>> {
  return async dispatch => {
    const caIDListPost = await dispatch(fetchThunk(API_PATHS.getCaIdList, 'get'));
    if (caIDListPost?.code === SUCCESS_CODE) {
      dispatch(setCaIDListPost(caIDListPost.data));
    }
  };
}
