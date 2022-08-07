import React, { useCallback, useEffect, useState } from 'react';
import { API_PATHS } from 'configs/API';
import { GRAY_DARK } from 'configs/colors';
import { isEmpty, some } from 'configs/utils';
import queryString from 'query-string';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import moment from 'moment';

import { Button, Checkbox, Grid, Typography } from '@material-ui/core';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';

import { DATE_FORMAT } from 'models/moment';
import ConfirmDialog from 'modules/common/components/ConfirmDialog';
import { Row } from 'modules/common/components/elements';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';
import { setNotistackMessage } from 'modules/common/redux/reducer';
import { fetchThunk } from 'modules/common/redux/thunk';

import { ReactComponent as IconToggleFilter } from 'svg/icon_adjustment_grey.svg';
import { ReactComponent as SortDownIcon } from 'svg/sort_down.svg';
import { ReactComponent as SortIcon } from 'svg/sort_none.svg';
import { ReactComponent as SortUpIcon } from 'svg/sort_up.svg';

interface dataMessageProps {
  title: string;
  message: string;
  labelButton?: string;
}
interface Props {
  filter: any;
  setFilter(value: any): void;
  onUpdateFilter(filter: some): void;
  onToggleFilter?(): void;
  onRefresh?(): void;
  isUpdate?: boolean;
  onEditItem(item: any): void;
  isFilter?: boolean;
  setIsFilter(value: boolean): void;
}
interface DataSort {
  numOfPosts: number;
  numOfActivePosts: number;
  createdAt: string;
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

const cssClass = 'sources-list-page';
const ACTIONS = {
  MULTI_DELETE: 'MULTI_DELETE',
};

const SourcesList: React.FC<Props> = props => {
  const {
    filter,
    setFilter,
    onUpdateFilter,
    onToggleFilter,
    onRefresh,
    isUpdate,
    onEditItem,
    isFilter,
    setIsFilter,
  } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const location = useLocation();
  const [data, setData] = useState<some>({ content: [], totalElements: 0 });
  const [checkBoxList, setCheckBoxList] = useState<number[]>([]);
  const [itemDelete, setItemDelete] = useState<any>();
  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);
  const [isConfirmDeleteList, setIsConfirmDeleteList] = useState<boolean>(false);
  const [isPopupInfo, setIsPopupInfo] = useState<boolean>(false);
  const [dataMessage, setDataMessage] = useState<dataMessageProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const [orderBy, setOrderBy] = React.useState<keyof DataSort>('createdAt');
  const [order, setOrder] = React.useState<Order>('none');

  const sourceList = data?.content || [];
  const countSelected = checkBoxList?.length || 0;

  const fetchData = React.useCallback(
    async (orderParam: any = 'none', orderByParam: any = 'createdAt') => {
      if (orderParam !== 'none' || isFilter) setLoading(true);
      const filterParams = (queryString.parse(location.search) as unknown) as any;
      filterParams.sort =
        orderParam !== 'none' ? `${orderByParam},${orderParam}` : `createdAt,desc`;
      filterParams.size = filterParams?.size ? filterParams?.size : 10;
      setFilter({
        ...filterParams,
      });
      filterParams.page = filterParams?.page ? Number(filterParams?.page) + 1 : 1;
      const json = await dispatch(
        fetchThunk(`${API_PATHS.apiAdminSource}?${queryString.stringify(filterParams)}`, 'get'),
      );
      if (json?.code === 200) {
        setData(json.data);
        setLoading(false);
        setIsFilter(false);
      } else {
        setLoading(false);
        setIsFilter(false);
        json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
      }
      onRefresh && onRefresh();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search, setFilter, dispatch, onRefresh, isFilter],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData, isUpdate]);

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

  const onDeleteBulk = useCallback(
    async (ids: number[]) => {
      const json = await dispatch(
        fetchThunk(`${API_PATHS.apiAdminSource}?ids=${ids?.toString()}`, 'delete'),
      );
      if (json?.code === 200) {
        fetchData();
        json?.message && dispatch(setNotistackMessage(json?.message, 'success'));
      }
      if (json?.code === 400) {
        setDataMessage({
          title: 'Không thể xóa',
          message: json?.message || '',
          labelButton: 'close',
        });
        setIsPopupInfo(true);
      } else {
        json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
      }
    },
    [dispatch, fetchData],
  );

  const onSelectAction = useCallback(
    async (actionType: string) => {
      if (isEmpty(checkBoxList)) {
        setDataMessage({
          title: 'Thông báo',
          message: 'Bạn chưa chọn item nào!',
          labelButton: 'close',
        });
        setIsPopupInfo(true);
      }
      if (actionType === ACTIONS.MULTI_DELETE && !isEmpty(checkBoxList)) {
        setIsConfirmDeleteList(true);
      }
    },
    [checkBoxList],
  );

  const handleEditItemSource = record => {
    onEditItem(record);
  };

  const getAdminSourcesSearch = useCallback(
    async (str: string) => {
      const json = await dispatch(
        fetchThunk(`${API_PATHS.getAdminSourcesSearch}?keyword=${str.trimLeft()}`, 'get'),
      );
      return json?.data || [];
    },
    [dispatch],
  );

  const columns: Columns[] = [
    {
      element: (
        <Checkbox
          checked={checkBoxList.length === sourceList?.length && sourceList?.length > 0}
          color="primary"
          indeterminate={
            checkBoxList.length === sourceList?.length ? undefined : !!checkBoxList.length
          }
          onChange={() => {
            if (checkBoxList.length === sourceList?.length) {
              setCheckBoxList([]);
            } else {
              const tempListId = sourceList?.map((element: any) => element?.id);
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
      title: 'sourceOfSourceManager',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left', width: 195 },
      render: (record: some) => (
        <Typography variant="subtitle2" style={{ color: GRAY_DARK, fontWeight: 'bold' }}>
          {record?.provider}
        </Typography>
      ),
    },
    {
      title: 'nameFanpage',
      styleHeader: { textAlign: 'left' },
      style: {
        textAlign: 'left',
        width: 195,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      },
      render: (record: some) => (
        <Typography
          variant="body2"
          className="limit-text-2"
          style={{ color: GRAY_DARK, width: 195, margin: 'auto', textOverflow: 'ellipsis' }}
        >
          {record?.name}
        </Typography>
      ),
    },
    {
      title: 'link',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {record?.link}
        </Typography>
      ),
    },
    {
      title: 'numOfPost',
      sort: (
        <span
          style={{ cursor: 'pointer' }}
          className={`${cssClass}-sort-icon`}
          onClick={() => handleRequestSort('numOfPosts')}
          aria-hidden="true"
        >
          {SortSwitchIcon('numOfPosts', orderBy, order)}
        </span>
      ),
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      subStyleHeader: { display: 'flex', alignItems: 'center' },
      render: (record: some) => (
        <>
          <Typography variant="body2" style={{ color: GRAY_DARK }}>
            {record?.numOfPosts || 0}
          </Typography>
        </>
      ),
    },
    {
      title: 'numOfActivePost',
      sort: (
        <span
          style={{ cursor: 'pointer' }}
          className={`${cssClass}-sort-icon`}
          onClick={() => handleRequestSort('numOfActivePosts')}
          aria-hidden="true"
        >
          {SortSwitchIcon('numOfActivePosts', orderBy, order)}
        </span>
      ),
      styleHeader: {
        textAlign: 'center',
      },
      subStyleHeader: { display: 'flex', alignItems: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => {
        return (
          <Typography
            variant="body2"
            style={{
              color: GRAY_DARK,
            }}
          >
            {record?.numOfActivePosts || 0}
          </Typography>
        );
      },
    },
    {
      title: 'createAt',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      subStyleHeader: { display: 'flex', alignItems: 'center' },
      sort: (
        <span
          style={{ cursor: 'pointer' }}
          className={`${cssClass}-sort-icon`}
          onClick={() => handleRequestSort('createdAt')}
          aria-hidden="true"
        >
          {SortSwitchIcon('createdAt', orderBy, order)}
        </span>
      ),
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {moment(record.createdAt).format(DATE_FORMAT)}
        </Typography>
      ),
    },

    {
      title: 'action',
      disableAction: true,
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: any) => {
        return (
          <Row style={{ padding: '16px 12px', justifyContent: 'space-around' }}>
            <Button
              variant="outlined"
              style={{ width: 32, height: 32, margin: '0px 10px' }}
              onClick={() => {
                handleEditItemSource(record);
              }}
            >
              <BorderColorIcon style={{ width: 16, height: 16 }} />
            </Button>
            <Button
              variant="outlined"
              style={{ width: 32, height: 32 }}
              onClick={() => {
                setItemDelete(record);
                setIsConfirmDelete(true);
              }}
            >
              <DeleteOutlineRoundedIcon style={{ width: 16, height: 16 }} />
            </Button>
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
        noColumnIndex
        header={
          <div className={`${cssClass}-head-top`}>
            <div>
              <Typography variant="subtitle1" style={{ marginBottom: 15 }}>
                Danh sách Sources ({data?.totalElements || 0})
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
                        if (valueItem?.type === 'name') {
                          filterSearch.name = valueItem.name;
                        }
                        if (valueItem?.type === 'link') {
                          filterSearch.link = valueItem.name;
                        }
                        onUpdateFilter({
                          ...filterSearch,
                          page: 0,
                          size: 10,
                        });
                      }}
                      loadOptions={getAdminSourcesSearch}
                      options={[]}
                      groupBy={option => option.label}
                      getOptionLabel={(one: some) => one.name}
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

                    <FormControlAutoComplete<some>
                      placeholder="Thao tác"
                      value={null}
                      onChange={(e: any, valueItem: some | null) => {
                        onSelectAction(valueItem?.id);
                      }}
                      options={[{ id: ACTIONS.MULTI_DELETE, name: 'Xóa' }]}
                      getOptionLabel={(one: some) => one.name}
                      getOptionSelected={(option: some, value: some) => {
                        return option?.id === value?.id;
                      }}
                      optional
                      formControlStyle={{ width: 150, minWidth: 'unset', marginRight: 0 }}
                    />
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

      {/* isPopupInfo */}
      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={isPopupInfo}
        acceptLabel={dataMessage?.labelButton || 'close'}
        onAccept={() => {
          setIsPopupInfo(false);
        }}
        titleHead={
          <Typography style={{ marginBottom: 16 }} variant="subtitle1">
            {dataMessage?.title || ''}
          </Typography>
        }
        titleLabel={<Typography variant="body1">{dataMessage?.message || ''}</Typography>}
        onClose={() => setIsPopupInfo(false)}
      />

      {/* isConfirmDelete */}
      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={isConfirmDelete}
        acceptLabel="delete"
        rejectLabel="cancel"
        onAccept={() => {
          const ids: number[] = [];
          ids.push(itemDelete?.id);
          onDeleteBulk && onDeleteBulk(ids);
          setIsConfirmDelete(false);
        }}
        titleHead={
          <Typography style={{ marginBottom: 16 }} variant="subtitle1">
            Xác nhận xóa
          </Typography>
        }
        titleLabel={<Typography variant="body1">Bạn có chắc muốn xóa source?</Typography>}
        onClose={() => setIsConfirmDelete(false)}
        onReject={() => setIsConfirmDelete(false)}
      />

      {/* isConfirmDeleteList */}
      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={isConfirmDeleteList}
        acceptLabel="delete"
        rejectLabel="cancel"
        onAccept={() => {
          onDeleteBulk && onDeleteBulk(checkBoxList);
          setIsConfirmDeleteList(false);
          setCheckBoxList([]);
        }}
        titleHead={
          <Typography style={{ marginBottom: 16 }} variant="subtitle1">
            Xác nhận xóa
          </Typography>
        }
        titleLabel={
          <Typography variant="body1">
            Bạn có chắc muốn xóa {countSelected} sources đã chọn?
          </Typography>
        }
        onClose={() => setIsConfirmDeleteList(false)}
        onReject={() => setIsConfirmDeleteList(false)}
      />
      {/* isConfirmChangeStatusList */}
    </>
  );
};

export default SourcesList;
