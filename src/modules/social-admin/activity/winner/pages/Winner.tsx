import React, { useCallback, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import queryString from 'query-string';
import Filter from '../components/Filter';
import WinnerTable from '../components/WinnerTable';
import './style.scss';

const cssClass = 'reward-list-page';

interface Props {}

const Winner: React.FC<Props> = () => {
  const location = useLocation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [isHideFilter, setIsHideFilter] = useState(false);
  const [filter, setFilter] = useState<any>((queryString.parse(location.search) as unknown) as any);

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
        <WinnerTable
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
          loading={false}
          filter={filter}
          onUpdateFilter={(values: any) => onUpdateFilter({ ...values, page: 0, size: 10 })}
          onToggleFilter={onToggleFilter}
        />
      </div>
    </div>
  );
};

export default Winner;
