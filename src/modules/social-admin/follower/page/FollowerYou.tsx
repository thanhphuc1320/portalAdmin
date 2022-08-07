import { API_PATHS } from 'configs/API';
import { debounce } from 'lodash';
import { snackbarSetting } from 'modules/common/components/elements';
import { fetchThunk } from 'modules/common/redux/thunk';
import { useSnackbar } from 'notistack';
import queryString from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { some } from '../../../../constants';
import Filter from '../components/Filter';
import FollowerYouTable from '../components/FollowerYouTable';
import { FOLLOWER_PAGE, FOLLOWER_SIZE } from '../constants';

const YouFollower = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<some>();
  const [totalElements, setTotalElements] = useState<number>();
  const userData = useSelector((state: AppState) => state.account?.userData, shallowEqual);

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

  const getFollowerYou = useCallback(
    debounce(
      async (value: string) => {
        setLoading(true);
        const json = await dispatch(fetchThunk(`${API_PATHS.getFollwer}?${value}`));
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
        ? getFollowerYou(queryString.stringify(filterParams))
        : getFollowerYou(queryString.stringify(filter));
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
      getFollowerYou,
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
    const userIdLogin = userData?.simpleInfo?.id;
    const params = queryString.parse(location.search);
    const filterParamsWithLogin = { ...{ targetUserId: userIdLogin }, ...params };
    const filterWithLogin = { ...{ targetUserId: userIdLogin }, ...filter };
    location.search
      ? getFollowerYou(queryString.stringify(filterParamsWithLogin))
      : getFollowerYou(queryString.stringify(filterWithLogin));
  }, [location.search, getFollowerYou, filter, userData]);

  return (
    <>
      <Filter
        hadleFilter={(value: some) => {
          hadleFilter(value);
        }}
      />
      <FollowerYouTable
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
