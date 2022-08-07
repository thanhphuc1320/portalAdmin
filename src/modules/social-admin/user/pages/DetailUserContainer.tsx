import React, { useState } from 'react';
import queryString from 'query-string';
import { useHistory, useLocation } from 'react-router';

import InfoUser from '../components/detailUser/InfoUser';
import ActivityUserTable from '../components/detailUser/ActivityUserTable';
import FilterActivityLog from '../components/detailUser/FilterActivityLog';
import '../style.scss';

const cssClass = 'user-list-page';

const DetailUserContainer = () => {
  const location = useLocation();
  const history = useHistory();

  const [filter, setFilter] = useState<any>(queryString.parse(location.search) as unknown);
  const [isHideFilter, setIsHideFilter] = useState(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const userId = (location as any).query?.userId || undefined;

  const handleUpdateFilter = (values: any) => {
    setFilter(values);
    history.replace({ search: queryString.stringify(values) });
  };

  const widthSideBar = isHideFilter ? 0 : 234;

  return (
    <div className={`${cssClass}`}>
      <div
        className={`${cssClass}-left`}
        style={{ width: `calc(100% - 26px - ${widthSideBar}px)` }}
      >
        <InfoUser userId={userId} />
        <ActivityUserTable
          userId={userId}
          filter={filter}
          setFilter={setFilter}
          loading={loading}
          isFilter={isFilter}
          setIsFilter={value => setIsFilter(value)}
          setLoading={setLoading}
          onUpdateFilter={handleUpdateFilter}
        />
      </div>
      <div
        className={`${cssClass}-right ${isHideFilter && 'hide'}`}
        style={{ width: widthSideBar }}
      >
        <FilterActivityLog
          filter={filter}
          onUpdateFilter={(values: any) =>
            handleUpdateFilter({ ...values, page: 0, size: 10, userId })
          }
          onToggleFilter={() => setIsHideFilter(!isHideFilter)}
          setIsFilter={value => setIsFilter(value)}
        />
      </div>
    </div>
  );
};

export default DetailUserContainer;
