import { API_PATHS } from 'configs/API';
import { debounce } from 'lodash';
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
import YouFollowerTable from '../components/YouFollowerTable';
import { FOLLOWER_PAGE, FOLLOWER_SIZE } from '../constants';

const YouFollower = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<some>();
  const [totalElements, setTotalElements] = useState<number>();

  const history = useHistory();
  const location = useLocation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const filterParams = (queryString.parse(location.search) as unknown) as any;

  const [filter, setFilter] = useState<some>({
    page: location.search ? filterParams?.page : FOLLOWER_PAGE,
    size: location.search ? filterParams?.size : FOLLOWER_SIZE,
    sort: 'followedAt,desc',
  });

  const getYouFollower = useCallback(
    debounce(
      async (value: string) => {
        setLoading(true);
        const json = await dispatch(fetchThunk(`${API_PATHS.getYouFollwer}?${value}`));
        if (json?.code === 200) {
          setData(json?.data);
          setTotalElements(json?.data?.totalElements);
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
      300,
      {
        trailing: true,
        leading: false,
      },
    ),
    [closeSnackbar, dispatch, enqueueSnackbar],
  );

  const actionUnfollow = useCallback(
    async (id: string) => {
      location.search
        ? getYouFollower(queryString.stringify(filterParams))
        : getYouFollower(queryString.stringify(filter));
      const json = await dispatch(
        fetchThunk(`${API_PATHS.unfollowFollwering}?ids=${id}`, 'delete'),
      );

      if (json?.code === 200) {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'success',
            }),
          );
      } else {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
      }
    },
    [
      closeSnackbar,
      dispatch,
      enqueueSnackbar,
      filter,
      filterParams,
      getYouFollower,
      location.search,
    ],
  );

  const hadleFilter = (value: some) => {
    setFilter(value);
    // eslint-disable-next-line no-param-reassign
    delete value?.targetUserIdName;
    const queryUrl = queryString.stringify(value);
    history.push(`${location?.pathname}?${queryUrl}`);
  };

  const unfollow = (id: some | number) => {
    typeof id !== 'string' ? actionUnfollow(id?.toString()) : actionUnfollow(id);
  };

  useEffect(() => {
    location.search
      ? getYouFollower(queryString.stringify(filterParams))
      : getYouFollower(queryString.stringify(filter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <>
      <Filter
        hadleFilter={(value: some) => {
          hadleFilter(value);
        }}
      />
      <YouFollowerTable
        unfollow={(value: some | number) => {
          unfollow(value);
        }}
        hadleFilter={(id: some) => {
          hadleFilter(id);
        }}
        filter={filter}
        totalElements={totalElements}
        loading={loading}
        datas={data?.content}
      />
    </>
  );
};

export default YouFollower;
