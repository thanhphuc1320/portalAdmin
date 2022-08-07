import React, { useCallback, useEffect, useState } from 'react';
import queryString from 'query-string';
import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { fetchCaIDListPost } from 'modules/common/redux/actions';
import { AppState } from 'redux/reducers';

import ItemTable from '../component/ItemTable';
import CardHotelItem from 'modules/social-admin/item/component/CardHotelItem';
import Filter from '../component/Filter';
import './style.scss';

const cssClass = 'item-list-page';

interface Props {}

const Item: React.FC<Props> = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const [isHideFilter, setIsHideFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [provinceId, setProvinceId] = useState<number>(33);

  const caIDListPost = useSelector((state: AppState) => state.common.caIDListPost);
  const [filter, setFilter] = useState<any>((queryString.parse(location.search) as unknown) as any);

  const onUpdateFilter = (values: any) => {
    setFilter(values);
    history.replace({ search: queryString.stringify(values) });
  };

  const handleToggleFilter = useCallback(() => {
    setIsHideFilter(!isHideFilter);
  }, [isHideFilter]);
  const widthSideBar = isHideFilter ? 0 : 234;

  useEffect(() => {
    dispatch(fetchCaIDListPost());
  }, [dispatch]);

  const clearForm = () => {
    setFilter([]);
    history.replace({ search: queryString.stringify({ page: 0, size: 10 }) });
  };

  useEffect(() => {
    window.addEventListener('load', clearForm);
    return () => {
      window.removeEventListener('load', clearForm);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${cssClass}`}>
      <div
        className={`${cssClass}-left`}
        style={{
          width: `calc(100% - 26px - ${widthSideBar}px)`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardHotelItem serviceType="HOTEL" />
        <ItemTable
          caIdList={caIDListPost}
          filter={filter}
          setFilter={setFilter}
          loading={loading}
          setLoading={setLoading}
          onUpdateFilter={onUpdateFilter}
          onToggleFilter={handleToggleFilter}
          provinceId={provinceId}
          setProvinceId={setProvinceId}
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
          onToggleFilter={handleToggleFilter}
          provinceId={provinceId}
        />
      </div>
    </div>
  );
};

export default Item;
