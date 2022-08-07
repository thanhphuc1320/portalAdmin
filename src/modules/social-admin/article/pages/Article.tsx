import { useSnackbar } from 'notistack';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { API_PATHS } from '../../../../configs/API';
import { some } from '../../../../constants';
import { AppState } from '../../../../redux/reducers';
import { snackbarSetting } from '../../../common/components/elements';
import { fetchThunk } from '../../../common/redux/thunk';
import ArticleTable from '../components/ArticleTable';
// import { IChangeRoleStatus, IFilter } from '../utils';

interface Props {}
const Article: React.FC<Props> = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const history = useHistory();
  const location = useLocation();
  const [data, setData] = useState<some[]>([]);
  const [changeData, setChangeData] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [filter, setFilter] = useState<any>((queryString.parse(location.search) as unknown) as any);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    const filterParams = (queryString.parse(location.search) as unknown) as any;
    filterParams.hashtag = filterParams.hashtagName;
    filterParams.sort = filterParams.sort ? filterParams.sort : 'createdAt,desc';
    filterParams.size = filterParams?.size ? filterParams?.size : 10;
    filterParams.page = filterParams?.page ? filterParams?.page : 1;
    delete filterParams.hashtagName;
    setFilter({
      ...filterParams,
    });
    const json = await dispatch(
      fetchThunk(`${API_PATHS.adminPost}?${queryString.stringify(filterParams)}`, 'get'),
    );
    if (json?.data) {
      setData(json.data || {});
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
  }, [closeSnackbar, dispatch, enqueueSnackbar, location.search]);

  const deleteRole = React.useCallback(async (id: number) => {
    return id;
  }, []);
  const updateRoleStatus = React.useCallback(async (values: any) => {
    return values;
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, location.search, changeData]);

  return (
    <ArticleTable
      changeData={changeData}
      setChangeData={setChangeData}
      filter={filter}
      loading={loading}
      onChangeRoleStatus={values => updateRoleStatus(values)}
      data={data}
      onDeleteRole={values => deleteRole(values)}
      onUpdateFilter={values => {
        history.replace({
          search: queryString.stringify({
            ...values,
          }),
        });
        setFilter((queryString.parse(location.search) as unknown) as any);
      }}
      setLoading={setLoading}
    />
  );
};

export default Article;
