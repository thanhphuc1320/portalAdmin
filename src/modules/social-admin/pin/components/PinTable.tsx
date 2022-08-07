/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import moment from 'moment';
import queryString from 'query-string';
import { fetchThunk } from 'modules/common/redux/thunk';

import { Button, Checkbox, Grid, Typography } from '@material-ui/core';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import { API_PATHS } from 'configs/API';
import { BLUE_300, GRAY, GRAY_DARK, GREY_700, PRIMARY, RED } from 'configs/colors';
import { isEmpty, some } from 'configs/utils';
import { DATE_FORMAT_TIMEZONE, formatDateTimeHourText } from 'models/moment';
import ConfirmDialog from 'modules/common/components/ConfirmDialog';
import { Col, IOSSwitch, Row } from 'modules/common/components/elements';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';
import { setNotistackMessage } from 'modules/common/redux/reducer';
import { PIN_CATA_OPTIONS, PIN_TAB_OPTIONS } from '../constants';

import { ReactComponent as IconFeedPhoto } from 'svg/feed_photo.svg';
import { ReactComponent as IconToggleFilter } from 'svg/icon_adjustment_grey.svg';

const cssClass = 'reward-list-component';
const ACTIONS = {
  MULTI_DEACTIVE: 'MULTI_DEACTIVE',
  MULTI_DELETE: 'MULTI_DELETE',
  MULTI_ACTIVE: 'MULTI_ACTIVE',
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
  onRefresh?(): void;
  onData(data: any): void;
  onEditItem(data: any): void;
  fetchItemTable?: boolean;
}
const PinList: React.FC<Props> = props => {
  const {
    caIdList,
    filter,
    setFilter,
    onUpdateFilter,
    onToggleFilter,
    onRefresh,
    onData,
    onEditItem,
    fetchItemTable,
  } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const location = useLocation();
  const [data, setData] = useState<some>({ content: [], totalElements: 0 });
  const [checkBoxList, setCheckBoxList] = useState<number[]>([]);
  const [itemDelete, setItemDelete] = useState<any>();
  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);
  const [isConfirmDeleteList, setIsConfirmDeleteList] = useState<boolean>(false);
  const [isConfirmChangeStatusList, setIsConfirmChangeStatusList] = useState<boolean>(false);
  const [isConfirmCheckStatus, setIsConfirmCheckStatus] = useState<boolean>(false);
  const [isPopupInfo, setIsPopupInfo] = useState<boolean>(false);
  const [dataMessage, setDataMessage] = useState<dataMessageProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isActiveItem, setIsActiveItem] = useState<boolean>(false);
  const [conflictPins, setConflictPins] = useState<any>({ currentPin: '', pinsConflict: '' });

  const pinList = data?.content || [];
  const countSelected = checkBoxList?.length || 0;

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    const filterParams = (queryString.parse(location.search) as unknown) as any;
    filterParams.sort = filterParams.sort ? filterParams.sort : 'createdAt,desc';
    filterParams.size = filterParams?.size ? filterParams?.size : 10;
    if (filterParams.active === 'true' || filterParams.active === 'false') {
      filterParams.endFrom = moment(new Date()).format(DATE_FORMAT_TIMEZONE);
    } else {
      delete filterParams.endFrom;
    }
    setFilter({
      ...filterParams,
    });
    filterParams.page = filterParams?.page ? Number(filterParams?.page) + 1 : 1;

    if (filterParams.active === 'expire') {
      filterParams.endTo = moment(new Date()).format(DATE_FORMAT_TIMEZONE);
      delete filterParams.active;
    }

    const json = await dispatch(
      fetchThunk(`${API_PATHS.getAdminPins}?${queryString.stringify(filterParams)}`, 'get'),
    );
    if (json?.code === 200) {
      onData(json.data);
      setData(json.data);
      setLoading(false);
    } else {
      setLoading(false);
      json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
    }
    onRefresh && onRefresh();
    // eslint-disable-next-line
  }, [setLoading, location.search, setFilter, onRefresh, dispatch]);

  const handleEditPinItem = record => {
    onEditItem(record);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData, fetchItemTable]);

  const handleCompare = record => {
    return moment(record?.endAt) < moment(new Date());
  };

  const onUpdateStatusBulk = useCallback(
    async (ids: number[], isActive: boolean) => {
      const apiPinStatus = isActive ? API_PATHS.adminPinsDeactivate : API_PATHS.adminPinsActivate;
      setLoading(true);
      const json = await dispatch(fetchThunk(`${apiPinStatus}?ids=${ids?.toString()}`, 'put'));
      setLoading(false);
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
    [dispatch, fetchData, setLoading],
  );

  const handleCheckStatusPin = useCallback(
    async (ids: number[], isActive: boolean) => {
      if (!isActive) {
        setLoading(true);
        const result = await dispatch(
          fetchThunk(`${API_PATHS.adminCheckConflictPin}?ids=${ids?.toString()}`, 'get'),
        );
        if (result?.code === 200) {
          if (result.data) {
            setIsConfirmCheckStatus(true);
            setConflictPins({ currentPin: ids[0], pinsConflict: result.data.conflictPins[0] });
          } else {
            onUpdateStatusBulk(ids, isActive);
          }
        } else {
          result?.message && dispatch(setNotistackMessage(result?.message, 'error'));
        }
      } else {
        onUpdateStatusBulk(ids, isActive);
      }
    },
    [dispatch, onUpdateStatusBulk],
  );

  const handleChangeStatusPinConflict = useCallback(async () => {
    const deActivePin = await dispatch(
      fetchThunk(`${API_PATHS.adminPinsDeactivate}?ids=${conflictPins.pinsConflict}`, 'put'),
    );
    if (deActivePin?.code === 200) {
      const activePin = await dispatch(
        fetchThunk(`${API_PATHS.adminPinsActivate}?ids=${conflictPins.currentPin}`, 'put'),
      );
      if (activePin?.code === 200) {
        activePin?.message && dispatch(setNotistackMessage(activePin?.message, 'success'));
        fetchData();
        setLoading(false);
      } else {
        activePin?.message && dispatch(setNotistackMessage(activePin?.message, 'error'));
        fetchData();
        setLoading(false);
      }
    } else {
      deActivePin?.message && dispatch(setNotistackMessage(deActivePin?.message, 'error'));
      fetchData();
      setLoading(false);
    }
  }, [conflictPins.currentPin, conflictPins.pinsConflict, dispatch, fetchData]);

  const onDeleteBulk = useCallback(
    async (ids: number[]) => {
      const json = await dispatch(
        fetchThunk(`${API_PATHS.deletePins}?ids=${ids?.toString()}`, 'delete'),
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
          message: 'Bạn chưa chọn bài ghim nào!',
          labelButton: 'close',
        });
        setIsPopupInfo(true);
      }
      if (actionType === ACTIONS.MULTI_DEACTIVE && !isEmpty(checkBoxList)) {
        setIsConfirmChangeStatusList(true);
        setIsActiveItem(true);
      }
      if (actionType === ACTIONS.MULTI_ACTIVE && !isEmpty(checkBoxList)) {
        setIsConfirmChangeStatusList(true);
        setIsActiveItem(false);
      }
      if (actionType === ACTIONS.MULTI_DELETE && !isEmpty(checkBoxList)) {
        setIsConfirmDeleteList(true);
      }
    },
    [checkBoxList, setIsConfirmChangeStatusList, setIsConfirmDeleteList],
  );

  const columns: Columns[] = [
    {
      element: (
        <Checkbox
          checked={checkBoxList.length === pinList?.length && pinList?.length > 0}
          color="primary"
          indeterminate={
            checkBoxList.length === pinList?.length ? undefined : !!checkBoxList.length
          }
          onChange={() => {
            if (checkBoxList.length === pinList?.length) {
              setCheckBoxList([]);
            } else {
              const tempListId = pinList?.map((element: any) => element?.id);
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
            disabled={handleCompare(record)}
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
      title: 'pin_id',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography variant="subtitle2" style={{ color: PRIMARY }}>
          {record?.code}
        </Typography>
      ),
    },
    {
      title: 'position',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography
          variant="body2"
          className="limit-text-2"
          style={{ color: GRAY_DARK, maxWidth: 150, margin: 'auto' }}
        >
          {/* {record?.offset} */}
          {record?.offsets?.map(key => key).join(', ')}
        </Typography>
      ),
    },
    {
      title: 'cata',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {PIN_CATA_OPTIONS?.find(element => element?.id === record?.categoryType)?.name}
          {/* {record?.modelType} */}
        </Typography>
      ),
    },
    {
      title: 'section_id_post_id',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {/* {record?.target?.post?.postId} */}
          {record?.targetId}
        </Typography>
      ),
    },
    {
      title: 'pin_name_id',
      render: (record: some) => {
        return (
          <Row style={{ justifyContent: 'flex-start' }}>
            {record?.imageUrl ? (
              <img
                src={record?.imageUrl}
                // src={record?.target?.post?.mediaInfos[0]?.thumbnail}
                style={{ width: 48, height: 48, borderRadius: 4, objectFit: 'cover' }}
                alt="avatar"
              />
            ) : (
              <IconFeedPhoto />
            )}

            <Col
              style={{
                marginLeft: 8,
                display: 'flex',
                justifyContent: 'flex-start',
              }}
            >
              <Typography variant="subtitle2" style={{ color: PRIMARY }}>
                {/* {record?.target?.post?.serviceType} */}
                {record?.targetName}
              </Typography>
              {record?.contentPost && (
                <Typography
                  variant="caption"
                  style={{
                    color: GRAY,
                    width: 180,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    height: 38,
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {/* {record?.target?.post?.content} */}
                  {record?.contentPost}
                </Typography>
              )}
            </Col>
          </Row>
        );
      },
    },
    {
      title: 'caId',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {caIdList?.find(element => element?.id === record?.caId)?.name}
        </Typography>
      ),
    },
    {
      title: 'pin_tab',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {PIN_TAB_OPTIONS?.find(element => element?.id === record?.tabType)?.name}
        </Typography>
      ),
    },
    {
      title: 'createdBy',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {record.createdByName}
        </Typography>
      ),
    },
    {
      title: 'eventBeginAt',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center', minWidth: 120 },
      render: (record: some) => {
        return (
          <div>
            {handleCompare(record) ? (
              <>
                <Typography
                  variant="body2"
                  style={{ color: RED, margin: 'auto', whiteSpace: 'nowrap' }}
                >
                  Hết hạn
                </Typography>
              </>
            ) : (
              <>
                <Typography
                  variant="body2"
                  style={{ color: GREY_700, margin: 'auto', whiteSpace: 'nowrap' }}
                >
                  {formatDateTimeHourText(record?.beginAt)}
                </Typography>
                <Typography
                  variant="body2"
                  style={{ color: GREY_700, margin: 'auto', whiteSpace: 'nowrap' }}
                >
                  {formatDateTimeHourText(record?.endAt)}
                </Typography>
              </>
            )}
          </div>
        );
      },
    },
    {
      title: 'SHOW',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <IOSSwitch
          disabled={handleCompare(record)}
          checked={!handleCompare(record) && record?.isActive}
          onChange={() => handleCheckStatusPin(record?.id && [record?.id], record?.isActive)}
        />
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
              disabled={handleCompare(record)}
              variant="outlined"
              style={{ width: 32, height: 32, margin: '0px 10px' }}
              onClick={() => handleEditPinItem(record)}
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
          <div>
            <div className={`${cssClass}-head-top`}>
              <Typography variant="subtitle1" style={{ marginBottom: 15 }}>
                Danh sách bài ghim ({data?.totalElements || 0})
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
                      { id: ACTIONS.MULTI_ACTIVE, name: 'Bật hiển thị' },
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
              page: 0,
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
        titleLabel={<Typography variant="body1">Bạn có chắc muốn xóa bài ghim?</Typography>}
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
            Bạn có chắc muốn xóa {countSelected} bài ghim đã chọn?
          </Typography>
        }
        onClose={() => setIsConfirmDeleteList(false)}
        onReject={() => setIsConfirmDeleteList(false)}
      />

      {/* isConfirmChangeStatusList */}
      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={isConfirmChangeStatusList}
        acceptLabel={isActiveItem ? 'turnOff' : 'turnOn'}
        rejectLabel="cancel"
        onAccept={() => {
          onUpdateStatusBulk && onUpdateStatusBulk(checkBoxList, isActiveItem);
          setIsConfirmChangeStatusList(false);
          setCheckBoxList([]);
        }}
        titleHead={
          <Typography style={{ marginBottom: 16 }} variant="subtitle1">
            Xác nhận thay đổi hiển thị
          </Typography>
        }
        titleLabel={
          <Typography variant="body1">
            Bạn có chắc muốn {isActiveItem ? 'tắt' : 'bật'} hiển thị {countSelected} bài ghim đã
            chọn?
          </Typography>
        }
        onClose={() => setIsConfirmChangeStatusList(false)}
        onReject={() => setIsConfirmChangeStatusList(false)}
      />

      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={isConfirmCheckStatus}
        acceptLabel="confirm"
        rejectLabel="cancel"
        onAccept={() => {
          handleChangeStatusPinConflict();
          setIsConfirmCheckStatus(false);
          setCheckBoxList([]);
        }}
        titleHead={
          <Typography style={{ marginBottom: 16 }} variant="subtitle1">
            Thông báo
          </Typography>
        }
        titleLabel={
          <Typography variant="body1">
            Việc bật hiển thị{' '}
            <span style={{ color: BLUE_300 }}>Pin ID {conflictPins?.currentPin}</span> sẽ tắt hiển
            thị &nbsp;
            <span style={{ color: BLUE_300 }}>Pin ID {conflictPins?.pinsConflict}</span> <br /> vì
            đang bị trùng. Bạn có muốn thực hiện?
          </Typography>
        }
        onClose={() => {
          setIsConfirmCheckStatus(false);
          setLoading(false);
        }}
        onReject={() => {
          setIsConfirmCheckStatus(false);
          setLoading(false);
        }}
      />
    </>
  );
};

export default PinList;
