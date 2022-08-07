import { API_PATHS } from 'configs/API';
import { snackbarSetting } from 'modules/common/components/elements';
import { fetchThunk } from 'modules/common/redux/thunk';
import { useSnackbar } from 'notistack';
import queryString from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { some } from '../../../../constants';
import Filter from '../components/Filter';
import HashtagTable from '../components/HashtagTable';

interface Props {}
const Hashtag: React.FC<Props> = () => {
  const location = useLocation();
  const history = useHistory();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<any>((queryString.parse(location.search) as unknown) as any);
  const [caIdList, setCaIdList] = useState<some[]>();

  const onUpdateFilter = (values: any) => {
    history.replace({
      search: queryString.stringify({
        ...values,
      }),
    });
    setFilter((queryString.parse(location.search) as unknown) as any);
  };
  const fetchCaIdData = useCallback(async () => {
    setLoading(true);
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
    setLoading(false);
  }, [closeSnackbar, dispatch, enqueueSnackbar]);

  useEffect(() => {
    fetchCaIdData();
  }, [fetchCaIdData]);
  return (
    <>
      <Filter
        filter={filter}
        loading={loading}
        onUpdateFilter={onUpdateFilter}
        setLoading={setLoading}
      />
      <HashtagTable
        caIdList={caIdList}
        filter={filter}
        setFilter={setFilter}
        loading={loading}
        setLoading={setLoading}
        onUpdateFilter={onUpdateFilter}
      />
    </>
  );
};

export default Hashtag;
