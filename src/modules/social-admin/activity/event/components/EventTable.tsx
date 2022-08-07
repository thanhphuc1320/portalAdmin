import { Button, Checkbox, Grid, Typography, Avatar } from '@material-ui/core';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import React, { useEffect, useState, useCallback } from 'react';
import queryString from 'query-string';
import moment, { Moment } from 'moment';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { API_PATHS } from 'configs/API';
import { fetchThunk } from 'modules/common/redux/thunk';
import { setNotistackMessage } from 'modules/common/redux/reducer';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';
import { IOSSwitch, Row } from 'modules/common/components/elements';
import ConfirmDialog from 'modules/common/components/ConfirmDialog';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import { formatDateTimeHourSecondText } from 'models/moment';
import { GRAY_DARK, PRIMARY, GREY_500, GREY_700 } from 'configs/colors';
import { ROUTES } from 'configs/routes';
import { some, isEmpty } from 'configs/utils';
import { EVENT_STATUS } from '../constants';
import { ReactComponent as IconToggleFilter } from 'svg/icon_adjustment_grey.svg';

import './style.scss';

const cssClass = 'reward-list-component';
const ACTIONS = {
  MULTI_DEACTIVE: 'MULTI_DEACTIVE',
  MULTI_DELETE: 'MULTI_DELETE',
};

interface dataMessageProps {
  title: string;
  message: string;
  labelButton?: string;
}
interface Props {
  caIdList?: some[];
  filter: any;
  setFilter(value: any): void;
  onUpdateFilter(filter: some): void;
  onToggleFilter?(): void;
}
const EventTable: React.FC<Props> = props => {
  const { caIdList, filter, setFilter, onUpdateFilter, onToggleFilter } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<some>({ content: [], totalElements: 0 });
  const [checkBoxList, setCheckBoxList] = useState<number[]>([]);
  const [itemDelete, setItemDelete] = useState<any>();
  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);
  const [isConfirmDeleteList, setIsConfirmDeleteList] = useState<boolean>(false);
  const [isConfirmChangeStatusList, setIsConfirmChangeStatusList] = useState<boolean>(false);
  const [isPopupInfo, setIsPopupInfo] = useState<boolean>(false);
  const [dataMessage, setDataMessage] = useState<dataMessageProps>();
  const eventList = data?.content || [];
  const countSelected = checkBoxList?.length || 0;

  const fetchData = useCallback(async () => {
    setLoading(true);
    const filterParams = (queryString.parse(location.search) as unknown) as any;
    filterParams.sort = filterParams.sort ? filterParams.sort : 'createdAt,desc';
    filterParams.size = filterParams?.size ? filterParams?.size : 10;
    setFilter({
      ...filterParams,
    });
    filterParams.page = filterParams?.page ? Number(filterParams?.page) + 1 : 1;
    const json = await dispatch(
      fetchThunk(`${API_PATHS.getAdminEvents}?${queryString.stringify(filterParams)}`, 'get'),
    );
    if (json?.code === 200) {
      setData(json.data);
      setLoading(false);
    } else {
      setLoading(false);
      json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
    }
  }, [setLoading, location.search, setFilter, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onUpdateStatusBulk = useCallback(
    async (ids: number[], isActive: boolean) => {
      const apiStatus = isActive ? API_PATHS.adminEventDeactivate : API_PATHS.adminEventActivate;
      const json = await dispatch(fetchThunk(`${apiStatus}?ids=${ids}`, 'put'));
      if (json?.code === 200) {
        fetchData();
        json?.message && dispatch(setNotistackMessage(json?.message, 'success'));
      }
      if (json?.code === 400) {
        setDataMessage({
          title: 'Không thể thay đổi trạng thái',
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

  const onDeleteBulk = useCallback(
    async (ids: number[]) => {
      const json = await dispatch(fetchThunk(`${API_PATHS.getAdminEvents}?ids=${ids}`, 'delete'));
      if (json?.code === 200) {
        fetchData();
        json?.message && dispatch(setNotistackMessage(json?.message, 'success'));
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
          message: 'Bạn chưa chọn sự kiện nào!',
          labelButton: 'close',
        });
        setIsPopupInfo(true);
      }
      if (actionType === ACTIONS.MULTI_DEACTIVE && !isEmpty(checkBoxList)) {
        setIsConfirmChangeStatusList(true);
      }
      if (actionType === ACTIONS.MULTI_DELETE && !isEmpty(checkBoxList)) {
        setIsConfirmDeleteList(true);
      }
    },
    [checkBoxList, setIsConfirmChangeStatusList, setIsConfirmDeleteList],
  );

  const getStatusEvent = (startDate: Moment, endDate: Moment) => {
    if (isEmpty(startDate)) {
      return '';
    }
    const start = moment(startDate);
    const now = moment();
    if (start > now) {
      return EVENT_STATUS.UPCOMING;
    }
    if (isEmpty(endDate)) {
      if (start <= now) {
        return EVENT_STATUS.RUNNING;
      }
      return '';
    }

    const end = moment(endDate);
    if (start <= now && end > now) {
      return EVENT_STATUS.RUNNING;
    }
    if (end <= now) {
      return EVENT_STATUS.FINISHED;
    }
    return '';
  };

  const getListName = (record: any, list?: some[]) => {
    let listName = '';
    list?.map((item, index) => {
      if (record?.caIds?.includes(item?.id)) {
        if (index < record?.caIds.length - 1) {
          listName += `${item?.name}, `;
        } else {
          listName += item?.name;
        }
      }
    });
    return listName;
  };

  const columns: Columns[] = [
    {
      element: (
        <Checkbox
          checked={checkBoxList.length === eventList?.length}
          color="primary"
          indeterminate={
            checkBoxList.length === eventList?.length ? undefined : !!checkBoxList.length
          }
          onChange={() => {
            if (checkBoxList.length === eventList?.length) {
              setCheckBoxList([]);
            } else {
              const tempListId = eventList?.map((element: any) => element?.id);
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
      title: 'id',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Button
          onClick={() => {
            history?.push({
              pathname: ROUTES.event.update,
              search: `id=${record.id}&onlyView=true`,
            });
          }}
        >
          <Typography variant="subtitle2" style={{ color: PRIMARY, textAlign: 'left' }}>
            {record?.code}
          </Typography>
        </Button>
      ),
    },
    {
      title: 'eventName',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left', minWidth: 200 },
      render: (record: some) => (
        <Button
          onClick={() => {
            history?.push({
              pathname: ROUTES.event.update,
              search: `id=${record.id}&onlyView=true`,
            });
          }}
        >
          <Typography
            variant="body2"
            className="limit-text-2"
            style={{ color: GRAY_DARK, maxWidth: 150, textAlign: 'left' }}
          >
            {record?.name}
          </Typography>
        </Button>
      ),
    },
    {
      title: 'caId',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {getListName(record, caIdList)}
        </Typography>
      ),
    },
    {
      title: 'image',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) =>
        record.bannerUrl && (
          <Avatar
            variant="square"
            src={record?.bannerUrl}
            style={{ width: 32, height: 32, margin: 'auto' }}
          />
        ),
    },
    {
      title: 'eventBeginAt',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center', minWidth: 120 },
      render: (record: some) => (
        <>
          <Typography
            variant="body2"
            style={{ color: GREY_700, margin: 'auto', whiteSpace: 'nowrap' }}
          >
            {formatDateTimeHourSecondText(record?.beginAt)}
          </Typography>
          <Typography
            variant="body2"
            style={{ color: GREY_700, margin: 'auto', whiteSpace: 'nowrap' }}
          >
            {formatDateTimeHourSecondText(record?.endAt)}
          </Typography>
        </>
      ),
    },
    {
      title: 'status',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center', minWidth: 120 },
      render: (record: some) => {
        let statusLabel = '';
        const status = getStatusEvent(record?.beginAt, record?.endAt);
        if (status === EVENT_STATUS.UPCOMING) {
          statusLabel = 'Sắp diễn ra';
        }
        if (status === EVENT_STATUS.RUNNING) {
          statusLabel = 'Đang diễn ra';
        }
        if (status === EVENT_STATUS.FINISHED) {
          statusLabel = 'Đã kết thúc';
        }
        return (
          <Typography variant="body2" style={{ color: GREY_500 }}>
            {statusLabel}
          </Typography>
        );
      },
    },
    {
      title: 'SHOW',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => {
        const ids: number[] = [];
        ids.push(record?.id);
        const status = getStatusEvent(record?.beginAt, record?.endAt);
        return (
          <Typography variant="body2" style={{ color: GRAY_DARK }}>
            {status === EVENT_STATUS.RUNNING && (
              <IOSSwitch
                checked={record?.isActive}
                onChange={() => onUpdateStatusBulk(ids, record?.isActive)}
              />
            )}
          </Typography>
        );
      },
    },
    {
      title: 'action',
      disableAction: true,
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'left' },
      render: (record: any) => {
        const status = getStatusEvent(record?.beginAt, record?.endAt);
        return (
          <Row style={{ padding: '16px 12px' }}>
            <Button
              variant="outlined"
              color="primary"
              style={{ width: 76, height: 32, margin: '0px' }}
              onClick={() => {
                history?.push({
                  pathname: ROUTES.event.update,
                  search: `id=${record.id}&onlyView=true`,
                });
              }}
            >
              <Typography variant="body2" style={{ color: PRIMARY }}>
                Chi tiết
              </Typography>
            </Button>
            <Button
              variant="outlined"
              style={{ width: 32, height: 32, margin: '0px 10px' }}
              onClick={() => {
                history?.push({
                  pathname: ROUTES.event.update,
                  search: `id=${record.id}`,
                });
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
              disabled={status !== EVENT_STATUS.UPCOMING}
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
          <div>
            <div className={`${cssClass}-head-top`}>
              <Typography variant="subtitle1" style={{ marginBottom: 15 }}>
                Danh sách sự kiện ({data?.totalElements || 0})
              </Typography>
              <IconToggleFilter onClick={onToggleFilter} style={{ cursor: 'pointer' }} />
            </div>
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
                  <FormControlAutoComplete<some>
                    placeholder="Thao tác"
                    value={null}
                    onChange={(e: any, valueItem: some | null) => {
                      onSelectAction(valueItem?.id);
                    }}
                    options={[
                      { id: ACTIONS.MULTI_DEACTIVE, name: 'Tắt hiển thị' },
                      { id: ACTIONS.MULTI_DELETE, name: 'Xóa' },
                    ]}
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
          onDeleteBulk(itemDelete?.id);
          setIsConfirmDelete(false);
        }}
        titleHead={
          <Typography style={{ marginBottom: 16 }} variant="subtitle1">
            Xác nhận xóa
          </Typography>
        }
        titleLabel={<Typography variant="body1">Bạn có chắc muốn sự kiện?</Typography>}
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
          onDeleteBulk(checkBoxList);
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
            Bạn có chắc muốn xóa {countSelected} sự kiện đã chọn?
          </Typography>
        }
        onClose={() => setIsConfirmDeleteList(false)}
        onReject={() => setIsConfirmDeleteList(false)}
      />

      {/* isConfirm updateStatusBulk */}
      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={isConfirmChangeStatusList}
        acceptLabel="turnOff"
        rejectLabel="cancel"
        onAccept={() => {
          onUpdateStatusBulk && onUpdateStatusBulk(checkBoxList, true);
          setIsConfirmChangeStatusList(false);
          setCheckBoxList([]);
        }}
        titleHead={
          <Typography style={{ marginBottom: 16 }} variant="subtitle1">
            Xác nhận tắt hiển thị
          </Typography>
        }
        titleLabel={
          <Typography variant="body1">
            Bạn có chắc muốn tắt hiển thị {countSelected} sự kiện đã chọn?
          </Typography>
        }
        onClose={() => setIsConfirmChangeStatusList(false)}
        onReject={() => setIsConfirmChangeStatusList(false)}
      />
    </>
  );
};

export default EventTable;
