import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import queryString from 'query-string';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { fetchCaIDListPost } from 'modules/common/redux/actions';
import Filter from '../components/Filter';
import EventTable from '../components/EventTable';
import './style.scss';

const cssClass = 'event-list-page';

interface Props {}

const Event: React.FC<Props> = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const caIDListPost = useSelector((state: AppState) => state.common.caIDListPost);
  const [isHideFilter, setIsHideFilter] = useState(false);
  const [filter, setFilter] = useState<any>((queryString.parse(location.search) as unknown) as any);

  useEffect(() => {
    dispatch(fetchCaIDListPost());
  }, [dispatch]);

  const onUpdateFilter = (values: any) => {
    setFilter(values);
    history.replace({ search: queryString.stringify(values) });
  };

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
        <EventTable
          caIdList={caIDListPost}
          filter={filter}
          setFilter={setFilter}
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
          filter={filter}
          onUpdateFilter={(values: any) => onUpdateFilter({ ...values, page: 0, size: 10 })}
          onToggleFilter={onToggleFilter}
        />
      </div>
    </div>
  );
};

export default Event;
