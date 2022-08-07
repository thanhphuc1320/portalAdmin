import React, { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { useSnackbar } from 'notistack';
import queryString from 'query-string';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { Action } from 'typesafe-actions';
import { fetchCaIDListPost } from 'modules/common/redux/actions';
import { API_PATHS } from '../../../../configs/API';
import { some } from '../../../../constants';
import { snackbarSetting } from '../../../common/components/elements';
import { fetchThunk } from '../../../common/redux/thunk';
import Filter from '../components/Filter';
import NotificationsTable from '../components/NotificationsTable';
import { DATE_FORMAT_FILTER_FROM, DATE_FORMAT_FILTER_TO } from 'models/moment';
import {
  NOTIFICATION_PAGE,
  NOTIFICATION_SIZE,
  NOTIFICATION_SORT,
  NOTIFICATION_CAID_DEFAULT,
} from '../constants';
import '../style.css';

const Notifications = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const caIDListPost = useSelector((state: AppState) => state.common.caIDListPost);
  const [data, setData] = useState<some[]>();
  const [totalElements, setTotalElements] = useState<number>();

  const history = useHistory();
  const location = useLocation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const filterParams = (queryString.parse(location.search) as unknown) as any;
  const [filter, setFilter] = useState<some>();

  useEffect(() => {
    dispatch(fetchCaIDListPost());
  }, [dispatch]);

  const getNotifications = useCallback(
    debounce(
      async (queryParams: string, paramsQuery: some) => {
        setLoading(true);

        const json = await dispatch(fetchThunk(`${API_PATHS.getNotifications}?${queryParams}`));
        if (json?.code === 200) {
          setData(json?.data?.content);
          setTotalElements(json?.data?.totalElements);
          setFilter(paramsQuery);
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
      },
      100,
      {
        trailing: true,
        leading: false,
      },
    ),
    [closeSnackbar, dispatch, enqueueSnackbar],
  );
  const hadleFilter = (value: some) => {
    setFilter(value);
    if (value.receiver) {
      value.receiver = value?.receiver.map(item => item.id);
    }
    const queryUrl = queryString.stringify(value);

    history.push(`${location?.pathname}?${queryUrl}`);
  };

  const fetchData = useCallback(async () => {
    const paramsQuery = {
      size: filterParams?.size ? filterParams?.size : NOTIFICATION_SIZE,
      page: filterParams?.page ? filterParams?.page : NOTIFICATION_PAGE,
      sort: filterParams?.sort ? filterParams?.sort : NOTIFICATION_SORT,
      createdFrom:
        filterParams?.createdFrom &&
        `${moment(filterParams?.createdFrom).format(DATE_FORMAT_FILTER_FROM)}`,
      createdTo:
        filterParams?.createdTo &&
        `${moment(filterParams?.createdTo).format(DATE_FORMAT_FILTER_TO)}`,
      postId: filterParams?.postId,
      sender: filterParams?.sender,
      event: filterParams?.event,
      caId: filterParams?.caId ? filterParams?.caId : NOTIFICATION_CAID_DEFAULT,
      status: filterParams?.status ? filterParams?.status : '',
      reply: filterParams?.reply,
      receiver: filterParams?.receiver,
    };
    const queryParams = queryString.stringify(paramsQuery);
    getNotifications(queryParams, paramsQuery);
    setFilter(paramsQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getNotifications, location.search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Filter caIdList={caIDListPost} filter={filter} hadleFilter={hadleFilter} />
      <NotificationsTable
        loading={loading}
        totalElements={totalElements}
        filter={filter}
        hadleFilter={hadleFilter}
        data={data}
        caIdList={caIDListPost}
        refreshList={fetchData}
      />
    </>
  );
};

export default Notifications;
