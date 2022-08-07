import React, { useCallback, useEffect, useState } from 'react';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { fetchCaIDListPost } from 'modules/common/redux/actions';
import PostCrawlerFilter from '../components/post-crawler/PostCrawlerFilter';
import PostCrawlerList from '../components/post-crawler/PostCrawlerList';
import './style.scss';

const cssClass = 'sources-list-page';

interface Props {}

const PostCrawler: React.FC<Props> = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const caIDListPost = useSelector((state: AppState) => state.common.caIDListPost);
  const [isHideFilter, setIsHideFilter] = useState(false);
  const [filter, setFilter] = useState<any>((queryString.parse(location.search) as unknown) as any);

  const onUpdateFilter = (values: any) => {
    setFilter(values);
    history.replace({ search: queryString.stringify(values) });
  };

  useEffect(() => {
    dispatch(fetchCaIDListPost());
  }, [dispatch]);

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
        <PostCrawlerList
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
        <PostCrawlerFilter
          caIdList={caIDListPost || []}
          filter={filter}
          onUpdateFilter={(values: any) => onUpdateFilter({ ...values, page: 0, size: 10 })}
          onToggleFilter={onToggleFilter}
        />
      </div>
    </div>
  );
};

export default PostCrawler;
