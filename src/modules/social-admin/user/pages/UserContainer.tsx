import React, { useState } from 'react';
import queryString from 'query-string';
import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { fetchCaIDListPost } from 'modules/common/redux/actions';
import { AppState } from 'redux/reducers';

import UserTable from '../components/UserTable';
import Filter from '../components/Filter';

import '../style.scss';

const cssClass = 'user-list-page';

const UserContainer = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const [filter, setFilter] = useState<any>(queryString.parse(location.search) as unknown);
  const [isHideFilter, setIsHideFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);

  const caIDListPost = useSelector((state: AppState) => state.common.caIDListPost);

  const handleUpdateFilter = (values: any) => {
    setFilter(values);
    history.replace({ search: queryString.stringify(values) });
  };

  React.useEffect(() => {
    dispatch(fetchCaIDListPost());
  }, [dispatch]);

  const widthSideBar = isHideFilter ? 0 : 234;

  return (
    <div className={`${cssClass}`}>
      <div
        className={`${cssClass}-left`}
        style={{ width: `calc(100% - 20px - ${widthSideBar}px)` }}
      >
        <UserTable
          filter={filter}
          setFilter={setFilter}
          caIdList={caIDListPost}
          loading={loading}
          isFilter={isFilter}
          setIsFilter={value => setIsFilter(value)}
          setLoading={setLoading}
          onUpdateFilter={handleUpdateFilter}
          onToggleFilter={() => setIsHideFilter(!isHideFilter)}
        />
      </div>
      <div
        className={`${cssClass}-right ${isHideFilter && 'hide'}`}
        style={{ width: widthSideBar }}
      >
        <Filter
          caIdList={caIDListPost}
          filter={filter}
          onUpdateFilter={(values: any) => handleUpdateFilter({ ...values, page: 0, size: 10 })}
          onToggleFilter={() => setIsHideFilter(!isHideFilter)}
          setIsFilter={value => setIsFilter(value)}
        />
      </div>
    </div>
  );
};

export default UserContainer;
