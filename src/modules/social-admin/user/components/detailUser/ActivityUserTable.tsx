import { API_PATHS } from 'configs/API';
import moment from 'moment';
import queryString from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';

import { Avatar, Typography } from '@material-ui/core';

import { DATE_FORMAT_SHOW_TIME } from 'models/moment';
import { Col, Row } from 'modules/common/components/elements';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';
import { setNotistackMessage } from 'modules/common/redux/reducer';
import { fetchThunk } from 'modules/common/redux/thunk';

import { GRAY, GRAY_DARK } from 'configs/colors';
import { some } from 'configs/utils';
import {
  NAME_REACTION_TYPE,
  NAME_TARGET_TYPE,
  TARGET_TYPE,
  GROUP_TARGET_TYPE_I,
} from '../../constant';

import { ReactComponent as IconFeedPhoto } from 'svg/feed_photo.svg';
import { ReactComponent as DefaultAvt } from 'svg/ic_avatar.svg';
import { ReactComponent as SortDownIcon } from 'svg/sort_down.svg';
import { ReactComponent as SortIcon } from 'svg/sort_none.svg';
import { ReactComponent as SortUpIcon } from 'svg/sort_up.svg';

import '../../style.scss';

const cssClass = 'user-list-page';
type Order = 'none' | 'asc' | 'desc';

const SortSwitchIcon = (order: Order) => {
  if (order === 'asc') {
    return <SortUpIcon />;
  }
  if (order === 'desc') {
    return <SortDownIcon />;
  }
  return <SortIcon />;
};

interface Props {
  filter?: any;
  userId: number;
  loading?: boolean;
  setFilter(value: any): void;
  setLoading(value: boolean): void;
  onUpdateFilter(filter: some): void;
  isFilter?: boolean;
  setIsFilter(value: boolean): void;
}
const ActivityUserTable: React.FC<Props> = props => {
  const {
    filter,
    onUpdateFilter,
    loading,
    setLoading,
    isFilter,
    setFilter,
    userId,
    setIsFilter,
  } = props;
  const location = useLocation();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const [data, setData] = useState<some>({ content: [], totalElement: 0 });
  const [order, setOrder] = useState<Order>('none');

  const fetchDataHistory = useCallback(
    async (orderParam: any = 'none', orderByParam: any = 'createdAt') => {
      if (orderParam !== 'none' || isFilter) setLoading(true);
      const filterParams = (queryString.parse(location.search) as unknown) as any;
      filterParams.sort =
        orderParam !== 'none' ? `${orderByParam},${orderParam}` : `createdAt,desc`;
      filterParams.size = filterParams?.size ? filterParams?.size : 10;
      filterParams.userId = userId;
      setFilter({
        ...filterParams,
      });
      filterParams.page = filterParams?.page ? Number(filterParams?.page) + 1 : 1;
      const result = await dispatch(
        fetchThunk(
          `${API_PATHS.getApiAdminHistoryActivityUser}?${queryString.stringify(filterParams)}`,
          'get',
        ),
      );
      if (result?.code === 200) {
        setData(result?.data);
        setLoading(false);
        setIsFilter(false);
      } else {
        setLoading(false);
        setIsFilter(false);
        result?.message && dispatch(setNotistackMessage(result?.message, 'error'));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, isFilter, location.search, setFilter, setLoading, userId],
  );

  useEffect(() => {
    userId && fetchDataHistory();
  }, [fetchDataHistory, userId]);

  const handleRequestSort = useCallback(
    property => {
      if (order === 'none') {
        setOrder('asc');
        fetchDataHistory('asc', property);
        return;
      }
      if (order === 'asc') {
        setOrder('desc');
        fetchDataHistory('desc', property);
        return;
      }
      setOrder('none');
      fetchDataHistory('none', property);
    },
    [order, fetchDataHistory],
  );
  const handleFormatCreatedAt = createdAt => {
    if (!createdAt) return '-';
    return moment(createdAt).format(DATE_FORMAT_SHOW_TIME);
  };

  const columns: Columns[] = [
    {
      title: 'activityType',
      styleHeader: { textAlign: 'left', paddingLeft: 15, paddingTop: 20 },
      style: { textAlign: 'left', minHeight: 80, paddingLeft: 15 },
      render: record => (
        <Typography
          variant="subtitle2"
          style={{ color: GRAY_DARK, fontWeight: 'bold', marginLeft: 15 }}
        >
          {NAME_REACTION_TYPE?.find(ele => ele?.id === record?.reactionType)?.name || '-'}
        </Typography>
      ),
    },
    {
      title: 'MANAGEMENT_ITEM',
      styleHeader: { textAlign: 'left', paddingTop: 20 },
      style: { textAlign: 'left', minHeight: 80 },
      render: record => (
        <Typography variant="subtitle2" style={{ color: GRAY_DARK, fontWeight: 'normal' }}>
          {NAME_TARGET_TYPE?.find(ele => ele?.id === record?.targetType)?.name || '-'}
        </Typography>
      ),
    },
    {
      title: 'contentActivity',
      styleHeader: { textAlign: 'left', paddingTop: 20 },
      style: { textAlign: 'left', height: 80, width: 400 },
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      render: record => ContentActivity(record),
    },
    {
      title: 'TIMES',
      styleHeader: { textAlign: 'left', paddingTop: 20 },
      style: { textAlign: 'left', minHeight: 80 },
      subStyleHeader: { display: 'flex', alignItems: 'center' },
      sort: (
        <span
          style={{ cursor: 'pointer' }}
          className={`${cssClass}-sort-icon`}
          onClick={() => handleRequestSort('createdAt')}
          aria-hidden="true"
        >
          {SortSwitchIcon(order)}
        </span>
      ),
      render: record => (
        <Typography variant="subtitle2" style={{ color: GRAY_DARK, fontWeight: 'normal' }}>
          {handleFormatCreatedAt(record?.createdAt)}
        </Typography>
      ),
    },
  ];
  return (
    <>
      <TableCustom
        dataSource={data?.content}
        loading={loading}
        style={{ marginTop: 24, border: 4, borderRadius: 4 }}
        columns={columns}
        noColumnIndex
        header={
          <div className={`${cssClass}-head-top`}>
            <div>
              <Typography variant="subtitle1" style={{ padding: '16px 0' }}>
                Nhật ký hoạt động
              </Typography>
            </div>
          </div>
        }
        paginationProps={{
          count: data?.totalElements || 0,
          page: filter.page ? Number(filter.page) : 0,
          rowsPerPage: filter.size ? Number(filter.size) : 10,
          onPageChange: (event: unknown, newPage: number) => {
            onUpdateFilter({
              ...((queryString.parse(location.search) as unknown) as any),
              page: newPage,
            });
          },
          onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => {
            onUpdateFilter({
              ...((queryString.parse(location.search) as unknown) as any),
              size: parseInt(event.target.value, 10),
            });
          },
        }}
      />
    </>
  );
};

export default ActivityUserTable;

export const GetDataOtherContent = targetType => {
  const title = targetType?.title || targetType?.displayName;
  const thumbnail = targetType?.thumbnail || targetType?.displayImageUrl;
  return (
    <>
      <Row>
        <div style={{ width: 48, height: 48, marginRight: 10 }}>
          {thumbnail ? (
            <Avatar
              variant="square"
              src={thumbnail}
              style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }}
            />
          ) : (
            <IconFeedPhoto style={{ width: 48, height: 48 }} />
          )}
        </div>
        <Col style={{ marginLeft: 10 }}>
          <Typography
            className={`${cssClass}-text-overflow`}
            variant="subtitle2"
            style={{ color: GRAY_DARK, fontWeight: 'bold', width: 400 }}
          >
            {title}
          </Typography>
          <Typography
            variant="subtitle2"
            style={{ color: GRAY, fontWeight: 'normal', width: 400 }}
            className={`${cssClass}-text-overflow`}
          >
            {targetType?.content}
          </Typography>
        </Col>
      </Row>
    </>
  );
};

export const GetDataContentTypeSearchAndFollow = target => {
  return (
    <Row>
      <div style={{ width: 48, height: 48, marginRight: 10 }}>
        {target?.profilePhoto ? (
          <Avatar
            variant="circular"
            src={target?.profilePhoto}
            style={{ objectFit: 'cover', width: 48, height: 48, borderRadius: '50%' }}
          />
        ) : (
          <DefaultAvt style={{ width: 48, height: 48, borderRadius: '50%' }} />
        )}
      </div>
      <Typography variant="subtitle2" style={{ color: GRAY_DARK, fontWeight: 'bold' }}>
        {target?.name}
      </Typography>
    </Row>
  );
};

export const ContentActivity = record => {
  const isGroupTypeI = GROUP_TARGET_TYPE_I.includes(record?.reactionType);
  if (isGroupTypeI) {
    if (record?.targetType === TARGET_TYPE.Comment) {
      return GetDataOtherContent(record?.target?.comment);
    }
    if (record?.targetType === TARGET_TYPE.Winner) {
      return GetDataOtherContent(record?.target?.winner?.eventReward);
    }
    return GetDataOtherContent(record?.target?.post);
  }
  if (record?.targetType === TARGET_TYPE.Hashtag) {
    return (
      <Typography variant="subtitle2" style={{ color: GRAY_DARK, fontWeight: 'bold' }}>
        #{record?.target?.hashTag?.name}
      </Typography>
    );
  }
  return GetDataContentTypeSearchAndFollow(record?.target?.user);
};
