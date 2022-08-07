import React, { useCallback, useEffect, useState } from 'react';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { API_PATHS } from 'configs/API';
import { fetchThunk } from 'modules/common/redux/thunk';
import { setNotistackMessage } from 'modules/common/redux/reducer';
import { fetchCaIDListPost } from 'modules/common/redux/actions';
import { some } from 'configs/utils';
import Filter from '../components/Filter';
import RewardTable from '../components/RewardTable';
import './style.scss';

const cssClass = 'reward-list-page';

interface Props {}

const Reward: React.FC<Props> = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const caIDListPost = useSelector((state: AppState) => state.common.caIDListPost);
  const [loading, setLoading] = useState(false);
  const [isHideFilter, setIsHideFilter] = useState(false);
  const [filter, setFilter] = useState<any>((queryString.parse(location.search) as unknown) as any);
  const [typeList, setTypeList] = useState<some[]>();

  const onUpdateFilter = (values: any) => {
    setFilter(values);
    history.replace({ search: queryString.stringify(values) });
  };

  const fetchTypeList = useCallback(async () => {
    const json = await dispatch(fetchThunk(API_PATHS.getAdminRewardTypeList, 'get'));
    if (json?.data) {
      setTypeList(json.data);
    } else {
      json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCaIDListPost());
    fetchTypeList();
  }, [dispatch, fetchTypeList]);

  const onToggleFilter = useCallback(() => {
    setIsHideFilter(!isHideFilter);
  }, [isHideFilter]);

  const widthSideBar = isHideFilter ? 0 : 234;
  return (
    <div className={`${cssClass}`}>
      <div
        className={`${cssClass}-left`}
        style={{ width: `calc(100% - 26px - ${widthSideBar}px)` }}
      >
        <RewardTable
          caIdList={caIDListPost}
          typeList={typeList}
          filter={filter}
          setFilter={setFilter}
          loading={loading}
          setLoading={setLoading}
          onUpdateFilter={onUpdateFilter}
          onToggleFilter={onToggleFilter}
        />
      </div>
      <div
        className={`${cssClass}-right ${isHideFilter && 'hide'}`}
        style={{ width: widthSideBar }}
      >
        <Filter
          caIdList={caIDListPost}
          typeList={typeList}
          loading={loading}
          setLoading={setLoading}
          filter={filter}
          onUpdateFilter={(values: any) => onUpdateFilter({ ...values, page: 0, size: 10 })}
          onToggleFilter={onToggleFilter}
        />
      </div>
    </div>
  );
};

export default Reward;
