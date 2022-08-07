import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { API_PATHS } from '../../../../configs/API';
import { some } from '../../../../constants';
import { AppState } from '../../../../redux/reducers';
import { snackbarSetting } from '../../../common/components/elements';
import { fetchThunk } from '../../../common/redux/thunk';
import CreateUpdateArticleTable from '../components/CreateUpdateArticleTable';

interface Props {}
const CreateUpdateArticle: React.FC<Props> = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [caIdList, setCaIdList] = useState<some[]>([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const fetchCaIdData = useCallback(async () => {
    const json = await dispatch(fetchThunk(API_PATHS.getCaIdList, 'get'));
    if (json?.data) {
      setCaIdList(json.data);
    } else {
      json?.message &&
        enqueueSnackbar(
          json?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
    }
  }, [closeSnackbar, dispatch, enqueueSnackbar]);

  useEffect(() => {
    fetchCaIdData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{!!caIdList?.length && <CreateUpdateArticleTable caIdList={caIdList || []} />}</>;
};
export default React.memo(CreateUpdateArticle);
