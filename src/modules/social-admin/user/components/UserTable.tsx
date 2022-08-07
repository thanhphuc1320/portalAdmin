import React, { useCallback, useState } from 'react';
import { API_PATHS } from 'configs/API';
import queryString from 'query-string';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { debounce } from 'lodash';
import { Avatar, Checkbox, Grid, Typography } from '@material-ui/core';
import { getOptionGenerateAvatar } from 'helpers/avatar';
import moment from 'moment';

import { DATE_FORMAT } from 'models/moment';
import { ButtonDetailUser } from 'modules/common/components/Button';
import ConfirmDialog from 'modules/common/components/ConfirmDialog';
import { Row } from 'modules/common/components/elements';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import LoadingButton from 'modules/common/components/LoadingButton';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';
import { setNotistackMessage } from 'modules/common/redux/reducer';
import { fetchThunk } from 'modules/common/redux/thunk';
import { STATUS_ADMIN_REPORTS } from 'constants/common';

import { GRAY_DARK, PRIMARY } from 'configs/colors';
import { ROUTES } from 'configs/routes';
import { some } from 'configs/utils';

import { ReactComponent as IconToggleFilter } from 'svg/icon_adjustment_grey.svg';
import { ReactComponent as SortDownIcon } from 'svg/sort_down.svg';
import { ReactComponent as SortIcon } from 'svg/sort_none.svg';
import { ReactComponent as SortUpIcon } from 'svg/sort_up.svg';
import '../style.scss';

const cssClass = 'user-list-page';

interface DataSort {
  'statistic.numOfLike': number;
  'statistic.numOfFollow': number;
  'statistic.numOfFollowYou': number;
  'statistic.numOfPost': number;
  amsCreatedAt: string;
}
type Order = 'none' | 'asc' | 'desc';

const SortSwitchIcon = (column: keyof DataSort, orderBy: keyof DataSort, order: Order) => {
  if (column === orderBy && order === 'asc') {
    return <SortUpIcon />;
  }
  if (column === orderBy && order === 'desc') {
    return <SortDownIcon />;
  }
  return <SortIcon />;
};
// TODO: All comment on this page for next SPR
// const ACTIONS = {
//   MULTI_DELETE: 'MULTI_DELETE',
// };
interface Props {
  filter: any;
  loading?: boolean;
  caIdList?: some[];
  setFilter(value: any): void;
  setLoading(value: boolean): void;
  onUpdateFilter(filter: some): void;
  onToggleFilter(): void;
  onRefresh?(): void;
  isFilter?: boolean;
  setIsFilter(value: boolean): void;
}

const UserTable: React.FC<Props> = props => {
  const {
    caIdList,
    filter,
    loading,
    onToggleFilter,
    onUpdateFilter,
    setLoading,
    setFilter,
    onRefresh,
    isFilter,
    setIsFilter,
  } = props;
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const [checkBoxList, setCheckBoxList] = useState<number[]>([]);
  const [data, setData] = useState<some>({ content: [], totalElements: 0 });
  const [orderBy, setOrderBy] = useState<keyof DataSort>('amsCreatedAt');
  const [order, setOrder] = useState<Order>('none');
  const [loadingExport, setLoadingExport] = useState<boolean>(false);
  const [isConfirmBan, setIsConfirmBan] = useState<boolean>(false);

  const userList = data?.content || [];
  // const countSelected = checkBoxList?.length || 0;

  const fetchData = useCallback(
    async (orderParam: any = 'none', orderByParam: any = 'amsCreatedAt') => {
      if (orderParam !== 'none' || isFilter) setLoading(true);
      const filterParams = (queryString.parse(location.search) as unknown) as any;
      filterParams.sort =
        orderParam !== 'none' ? `${orderByParam},${orderParam}` : `amsCreatedAt,desc`;
      filterParams.size = filterParams?.size ? filterParams?.size : 10;
      setFilter({
        ...filterParams,
      });
      filterParams.page = filterParams?.page ? Number(filterParams?.page) + 1 : 1;
      const result = await dispatch(
        fetchThunk(`${API_PATHS.getApiAdminUser}?${queryString.stringify(filterParams)}`, 'get'),
      );
      if (result?.code === 200) {
        setData(result.data);
        setLoading(false);
        setIsFilter(false);
      } else {
        setLoading(false);
        setIsFilter(false);
        result?.message && dispatch(setNotistackMessage(result?.message, 'error'));
      }
      onRefresh && onRefresh();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, isFilter, location.search, onRefresh, setFilter, setLoading],
  );

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const optionsAvatar = record =>
    getOptionGenerateAvatar({
      id: record?.id,
      name: record?.name,
      size: 40,
    });

  const formatNumber = (number, digits) => {
    const lookup = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'G' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup
      .slice()
      .reverse()
      // eslint-disable-next-line func-names
      .find(function(ele) {
        return number >= ele.value;
      });

    return item ? (number / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
  };

  const getAdminReports = useCallback(
    debounce(async (id: string) => {
      const json = await dispatch(fetchThunk(`${API_PATHS.getAdminReports}?id=${id}`, 'get'));
      const result = json?.data?.content[0];
      if (result?.status === STATUS_ADMIN_REPORTS.DONE) {
        setLoading(false);
        setLoadingExport(false);
        dispatch(setNotistackMessage(json?.message, 'success'));
        setCheckBoxList([]);
        window.open(result?.resultUrl);
        onRefresh && onRefresh();
      } else {
        getAdminReports(id);
      }
    }, 3500),
    [dispatch, onRefresh, setLoading],
  );

  const handleExport = useCallback(async () => {
    const stringCheck = checkBoxList.map(String).toString();
    setLoadingExport(true);
    setLoading(true);
    const result = await dispatch(
      fetchThunk(`${API_PATHS.getApiAdminExportUser}?ids=${stringCheck}`, 'get'),
    );
    if (result?.code === 200) {
      const exportId = result?.data.id;
      if (exportId) {
        getAdminReports(exportId);
      } else {
        setLoadingExport(false);
        setLoading(false);
        dispatch(setNotistackMessage('ExportId không tồn tại!', 'error'));
      }
    }
  }, [checkBoxList, dispatch, getAdminReports, setLoading]);

  const handleRequestSort = useCallback(
    (property: keyof DataSort) => {
      setOrderBy(property);
      if (orderBy === property && order === 'none') {
        setOrder('asc');
        fetchData('asc', property);
        return;
      }
      if (orderBy === property && order === 'asc') {
        setOrder('desc');
        fetchData('desc', property);
        return;
      }
      setOrder('none');
      fetchData('none', property);
    },
    [orderBy, order, fetchData],
  );

  const getAdminSearchUser = useCallback(
    async (str: string) => {
      const result = await dispatch(
        fetchThunk(`${API_PATHS.getApiAdminSearchUser}?keyword=${str.trimLeft()}`, 'get'),
      );
      return result?.data || [];
    },
    [dispatch],
  );

  const handleFormatCreatedAt = createdAt => {
    if (!createdAt) return '-';
    return moment(createdAt).format(DATE_FORMAT);
  };

  const columns: Columns[] = [
    {
      element: (
        <Checkbox
          checked={checkBoxList.length === userList?.length && userList?.length > 0}
          color="primary"
          indeterminate={
            checkBoxList.length === userList?.length ? undefined : !!checkBoxList.length
          }
          onChange={() => {
            if (checkBoxList.length === userList?.length) {
              setCheckBoxList([]);
            } else {
              const tempListId = userList?.map((element: any) => element?.id);
              setCheckBoxList(tempListId);
            }
          }}
          inputProps={{ 'aria-label': 'indeterminate checkbox' }}
        />
      ),
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => {
        return (
          <Checkbox
            color="primary"
            checked={!!checkBoxList.find(element => element === record?.id)}
            onClick={e => e.stopPropagation()}
            onChange={() => {
              if (!checkBoxList.find(element => element === record?.id)) {
                setCheckBoxList([...checkBoxList, record.id]);
              }
              const indexCheckBox = checkBoxList.indexOf(record?.id);
              if (indexCheckBox > -1) {
                checkBoxList.splice(indexCheckBox, 1);
                setCheckBoxList([...checkBoxList]);
              }
            }}
          />
        );
      },
    },
    {
      title: 'userId',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: record => (
        <Typography variant="subtitle2" style={{ color: PRIMARY, fontWeight: 'normal' }}>
          {record?.id}
        </Typography>
      ),
    },
    {
      title: 'account',
      styleHeader: { textAlign: 'left', maxWidth: 120 },
      style: { textAlign: 'left', maxWidth: 120 },
      render: record => (
        <Row>
          {record?.profilePhoto ? (
            <div style={{ width: 26, height: 26 }}>
              <Avatar
                variant="circular"
                src={record?.profilePhoto}
                style={{ objectFit: 'cover', width: 26, height: 26, borderRadius: '50%' }}
              />
            </div>
          ) : (
            <div style={{ width: 26, height: 26 }}>
              <Avatar
                style={{
                  width: 26,
                  height: 26,
                  fontSize: 12,
                  backgroundColor: optionsAvatar(record).backgroundColor,
                }}
              >
                {optionsAvatar(record).letters}
              </Avatar>
            </div>
          )}
          <Typography
            variant="subtitle2"
            className={`${cssClass}-text-overflow`}
            style={{ color: GRAY_DARK, fontWeight: 'normal', marginLeft: 10 }}
          >
            {record?.name}
          </Typography>
        </Row>
      ),
    },
    {
      title: 'CA_ID',
      styleHeader: { textAlign: 'left', maxWidth: 65 },
      style: { textAlign: 'left', maxWidth: 65 },
      render: (record: some) => (
        <Typography
          variant="body2"
          className={`${cssClass}-text-overflow`}
          style={{ color: GRAY_DARK, fontWeight: 'bold' }}
        >
          {caIdList?.find(element => element?.id === record?.caId)?.name || '-'}
        </Typography>
      ),
    },
    {
      title: 'numOfLike',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      subStyleHeader: { display: 'flex', alignItems: 'center' },
      sort: (
        <span
          style={{ cursor: 'pointer' }}
          className={`${cssClass}-sort-icon`}
          onClick={() => handleRequestSort('statistic.numOfLike')}
          aria-hidden="true"
        >
          {SortSwitchIcon('statistic.numOfLike', orderBy, order)}
        </span>
      ),
      render: record => (
        <Typography variant="subtitle2" style={{ color: GRAY_DARK, fontWeight: 'normal' }}>
          {formatNumber(record?.statistic?.numOfLike, 1) || '-'}
        </Typography>
      ),
    },
    {
      title: 'numOfFollow',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      subStyleHeader: { display: 'flex', alignItems: 'center' },
      sort: (
        <span
          style={{ cursor: 'pointer' }}
          className={`${cssClass}-sort-icon`}
          onClick={() => handleRequestSort('statistic.numOfFollow')}
          aria-hidden="true"
        >
          {SortSwitchIcon('statistic.numOfFollow', orderBy, order)}
        </span>
      ),
      render: record => (
        <Typography variant="subtitle2" style={{ color: GRAY_DARK, fontWeight: 'normal' }}>
          {formatNumber(record?.statistic?.numOfFollow, 1) || '-'}
        </Typography>
      ),
    },
    {
      title: 'numOfFollowYou',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      subStyleHeader: { display: 'flex', alignItems: 'center' },
      sort: (
        <span
          style={{ cursor: 'pointer' }}
          className={`${cssClass}-sort-icon`}
          onClick={() => handleRequestSort('statistic.numOfFollowYou')}
          aria-hidden="true"
        >
          {SortSwitchIcon('statistic.numOfFollowYou', orderBy, order)}
        </span>
      ),
      render: record => (
        <Typography variant="subtitle2" style={{ color: GRAY_DARK, fontWeight: 'normal' }}>
          {formatNumber(record?.statistic?.numOfFollowYou, 1) || '-'}
        </Typography>
      ),
    },
    {
      title: 'numOfPost',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      subStyleHeader: { display: 'flex', alignItems: 'center' },
      sort: (
        <span
          style={{ cursor: 'pointer' }}
          className={`${cssClass}-sort-icon`}
          onClick={() => handleRequestSort('statistic.numOfPost')}
          aria-hidden="true"
        >
          {SortSwitchIcon('statistic.numOfPost', orderBy, order)}
        </span>
      ),
      render: record => (
        <Typography variant="subtitle2" style={{ color: GRAY_DARK, fontWeight: 'normal' }}>
          {formatNumber(record?.statistic?.numOfPost, 1) || '-'}
        </Typography>
      ),
    },
    {
      title: 'createdTime',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      subStyleHeader: { display: 'flex', alignItems: 'center' },
      sort: (
        <span
          style={{ cursor: 'pointer' }}
          className={`${cssClass}-sort-icon`}
          onClick={() => handleRequestSort('amsCreatedAt')}
          aria-hidden="true"
        >
          {SortSwitchIcon('amsCreatedAt', orderBy, order)}
        </span>
      ),
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {handleFormatCreatedAt(record.createdAt)}
        </Typography>
      ),
    },
    {
      title: 'action',
      disableAction: true,
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: record => {
        return (
          <Row style={{ padding: '16px 0', justifyContent: 'space-around' }}>
            <ButtonDetailUser
              style={{ width: 24, height: 24, padding: 'unset' }}
              onClick={() => {
                history?.push({
                  pathname: '/',
                  search: `userId=${record?.id}&userName=${record?.name}`,
                });
              }}
            />
          </Row>
        );
      },
    },
  ];
  return (
    <>
      <TableCustom
        dataSource={data?.content}
        loading={loading}
        style={{ marginTop: 24, border: 4 }}
        columns={columns}
        onRowClick={record => {
          history?.push({
            pathname: ROUTES.user.detail,
            search: `userId=${record.id}`,
          });
        }}
        noColumnIndex
        header={
          <div className={`${cssClass}-head-top`}>
            <div>
              <Typography variant="subtitle1" style={{ marginBottom: 15 }}>
                Danh sách người dùng ({data?.totalElements || 0})
              </Typography>
            </div>
            <div className={`${cssClass}-container-button`}>
              <Row
                style={{
                  padding: '16px 28px 16px 24px',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <Grid container alignItems="center">
                  <Grid item xs={12} style={{ textAlign: 'right' }}>
                    <FormControlAutoComplete
                      id="search"
                      placeholder="Tìm kiếm..."
                      onChange={(e: any, valueItem: some | null) => {
                        const filterSearch: any = {};
                        if (valueItem?.type === 'userId') {
                          filterSearch.userId = valueItem.name;
                        }
                        if (valueItem?.type === 'name') {
                          filterSearch.name = valueItem.name;
                        }
                        if (valueItem?.type === 'phone') {
                          filterSearch.phone = valueItem.name;
                        }
                        if (valueItem?.type === 'email') {
                          filterSearch.email = valueItem.name;
                        }
                        setCheckBoxList([]);
                        onUpdateFilter({
                          ...filterSearch,
                          page: 0,
                          size: 10,
                        });
                      }}
                      loadOptions={getAdminSearchUser}
                      options={[]}
                      groupBy={option => option.label}
                      getOptionLabel={(one: some) => one.name || ''}
                      getOptionSelected={(option: some, value: some) => {
                        return option?.name === value?.name;
                      }}
                      optional
                      formControlStyle={{
                        width: 250,
                        minWidth: 'unset',
                        marginRight: 20,
                        marginBottom: -20,
                      }}
                    />

                    {
                      // Next SPR
                      /* <FormControlAutoComplete<some>
                      placeholder="Thao tác"
                      value={null}
                      //   onChange={(e: any, valueItem: some | null) => {
                      //     // onSelectAction(valueItem?.id);
                      //   }}
                      options={[{ id: ACTIONS.MULTI_DELETE, name: 'Chặn' }]}
                      getOptionLabel={(one: some) => one.name}
                      getOptionSelected={(option: some, value: some) => {
                        return option?.id === value?.id;
                      }}
                      optional
                      formControlStyle={{ width: 150, minWidth: 'unset', marginRight: 0 }}
                    /> */
                    }
                    <LoadingButton
                      variant="contained"
                      size="large"
                      style={{
                        minWidth: 140,
                        marginRight: 5,
                        marginLeft: 20,
                        position: 'relative',
                      }}
                      color="primary"
                      disableElevation
                      loading={loadingExport}
                      disabled={loadingExport || !checkBoxList.length}
                      onClick={handleExport}
                    >
                      Export
                    </LoadingButton>
                  </Grid>
                </Grid>
              </Row>
              <IconToggleFilter onClick={onToggleFilter} style={{ cursor: 'pointer' }} />
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
            setCheckBoxList([]);
          },
          onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => {
            onUpdateFilter({
              ...((queryString.parse(location.search) as unknown) as any),
              size: parseInt(event.target.value, 10),
            });
            setCheckBoxList([]);
          },
        }}
      />
      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={isConfirmBan}
        acceptLabel="ban"
        rejectLabel="cancel"
        onAccept={() => {
          // const ids: number[] = [];
          // ids.push(itemDelete?.id);
          // onDeleteBulk && onDeleteBulk(ids);
          setIsConfirmBan(false);
        }}
        titleHead={
          <Typography style={{ marginBottom: 16 }} variant="subtitle1">
            Chặn người dùng
          </Typography>
        }
        titleLabel={
          <Typography variant="body1">Bạn chắc chắn muốn chặn người dùng này?</Typography>
        }
        onClose={() => setIsConfirmBan(false)}
        onReject={() => setIsConfirmBan(false)}
      />
    </>
  );
};

export default UserTable;
