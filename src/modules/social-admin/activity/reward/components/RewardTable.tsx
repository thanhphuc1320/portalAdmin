import { Button, Checkbox, Grid, Typography } from '@material-ui/core';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import React, { useEffect, useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import queryString from 'query-string';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { API_PATHS } from 'configs/API';
import { fetchThunk } from 'modules/common/redux/thunk';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';
import { snackbarSetting, IOSSwitch, Row } from 'modules/common/components/elements';
import ConfirmDialog from 'modules/common/components/ConfirmDialog';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import { formatDateTimeHourText } from 'models/moment';
import { GRAY_DARK, PRIMARY, GREY_700 } from 'configs/colors';
import { ROUTES } from 'configs/routes';
import { some, isEmpty } from 'configs/utils';
import { ReactComponent as IconToggleFilter } from 'svg/icon_adjustment_grey.svg';
import { UNLIMITED_CHARACTERS, UNLIMITED_NUMBER } from '../constants';
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
  typeList?: some[];
  setLoading(value: boolean): void;
  loading: boolean;
  filter: any;
  setFilter(value: any): void;
  onUpdateFilter(filter: some): void;
  onToggleFilter?(): void;
}
const RewardList: React.FC<Props> = props => {
  const {
    caIdList,
    typeList,
    loading,
    setLoading,
    filter,
    setFilter,
    onUpdateFilter,
    onToggleFilter,
  } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const history = useHistory();
  const location = useLocation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [data, setData] = useState<some>({ content: [], totalElements: 0 });
  const [checkBoxList, setCheckBoxList] = useState<number[]>([]);
  const [itemDelete, setItemDelete] = useState<any>();
  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);
  const [isConfirmDeleteList, setIsConfirmDeleteList] = useState<boolean>(false);
  const [isConfirmChangeStatusList, setIsConfirmChangeStatusList] = useState<boolean>(false);
  const [isPopupInfo, setIsPopupInfo] = useState<boolean>(false);
  const [dataMessage, setDataMessage] = useState<dataMessageProps>();
  const rewardList = data?.content || [];
  const countSelected = checkBoxList?.length || 0;

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    const filterParams = (queryString.parse(location.search) as unknown) as any;
    filterParams.sort = filterParams.sort ? filterParams.sort : 'createdAt,desc';
    filterParams.size = filterParams?.size ? filterParams?.size : 10;
    setFilter({
      ...filterParams,
    });
    filterParams.page = filterParams?.page ? Number(filterParams?.page) + 1 : 1;
    const json = await dispatch(
      fetchThunk(`${API_PATHS.getAdminRewardList}?${queryString.stringify(filterParams)}`, 'get'),
    );
    if (json?.code === 200) {
      setData(json.data);
    } else {
      json?.message &&
        enqueueSnackbar(
          json?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
    }
    setLoading(false);
  }, [setLoading, location.search, setFilter, dispatch, enqueueSnackbar, closeSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onUpdateStatusBulk = useCallback(
    async (ids: number[], isActive: boolean) => {
      const apiRewardStatus = isActive
        ? API_PATHS.adminRewardDeactivate
        : API_PATHS.adminRewardActivate;
      setLoading(true);
      const json = await dispatch(fetchThunk(`${apiRewardStatus}`, 'put', JSON.stringify(ids)));
      setLoading(false);
      if (json?.code === 200) {
        fetchData();
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'success',
            }),
          );
      }
      if (json?.code === 400) {
        setDataMessage({
          title: 'Không thể thay đổi trạng thái',
          message: json?.message || '',
          labelButton: 'close',
        });
        setIsPopupInfo(true);
      } else {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
      }
    },
    [closeSnackbar, dispatch, enqueueSnackbar, fetchData, setLoading],
  );

  const onDeleteBulk = useCallback(
    async (ids: number[]) => {
      setLoading(true);
      const json = await dispatch(
        fetchThunk(`${API_PATHS.deleteReward}`, 'delete', JSON.stringify(ids)),
      );
      setLoading(false);
      if (json?.code === 200) {
        fetchData();
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'success',
            }),
          );
      }
      if (json?.code === 400) {
        setDataMessage({
          title: 'Không thể xóa',
          message: json?.message || '',
          labelButton: 'close',
        });
        setIsPopupInfo(true);
      } else {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
      }
    },
    [closeSnackbar, dispatch, enqueueSnackbar, fetchData, setLoading],
  );

  const onSelectAction = useCallback(
    async (actionType: string) => {
      if (isEmpty(checkBoxList)) {
        setDataMessage({
          title: 'Thông báo',
          message: 'Bạn chưa chọn giải thưởng nào!',
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

  const columns: Columns[] = [
    {
      element: (
        <Checkbox
          checked={checkBoxList.length === rewardList?.length && rewardList?.length > 0}
          color="primary"
          indeterminate={
            checkBoxList.length === rewardList?.length ? undefined : !!checkBoxList.length
          }
          onChange={() => {
            if (checkBoxList.length === rewardList?.length) {
              setCheckBoxList([]);
            } else {
              const tempListId = rewardList?.map((element: any) => element?.id);
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
      title: 'rewardID',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography variant="subtitle2" style={{ color: PRIMARY }}>
          {record?.code}
        </Typography>
      ),
    },
    {
      title: 'rewardName',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography
          variant="body2"
          className="limit-text-2"
          style={{ color: GRAY_DARK, maxWidth: 150, margin: 'auto' }}
        >
          {record?.name}
        </Typography>
      ),
    },
    {
      title: 'type',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {typeList?.find(element => element?.id === record?.type)?.name}
        </Typography>
      ),
    },
    {
      title: 'value',
      styleHeader: { textAlign: 'right' },
      style: { textAlign: 'right' },
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {record?.value} {record?.valueType}
        </Typography>
      ),
    },
    {
      title: 'quantity',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => {
        if (record?.quantity === UNLIMITED_NUMBER) {
          return (
            <Typography variant="subtitle2" style={{ color: 'red' }}>
              {UNLIMITED_CHARACTERS}
            </Typography>
          );
        }
        return (
          <Typography variant="body2" style={{ color: GRAY_DARK }}>
            {record?.quantity}
          </Typography>
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
      title: 'createdAt',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GREY_700 }}>
          {formatDateTimeHourText(record?.createdAt)}
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
      title: 'action',
      disableAction: true,
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: any) => {
        const ids: number[] = [];
        ids.push(record?.id);
        return (
          <Row style={{ padding: '16px 12px', justifyContent: 'space-around' }}>
            <IOSSwitch
              checked={record?.isActive}
              onChange={() => onUpdateStatusBulk(ids, record?.isActive)}
            />
            <Button
              variant="outlined"
              style={{ width: 32, height: 32, margin: '0px 10px' }}
              onClick={() => {
                history?.push({
                  pathname: ROUTES.reward.update,
                  search: `rewardId=${record.code}`,
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
                Danh sách giải thưởng ({data?.totalElements || 0})
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
        titleLabel={<Typography variant="body1">Bạn có chắc muốn xóa giải thưởng?</Typography>}
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
            Bạn có chắc muốn xóa {countSelected} giải thưởng đã chọn?
          </Typography>
        }
        onClose={() => setIsConfirmDeleteList(false)}
        onReject={() => setIsConfirmDeleteList(false)}
      />

      {/* isConfirmChangeStatusList */}
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
            Bạn có chắc muốn tắt hiển thị {countSelected} giải thưởng đã chọn?
          </Typography>
        }
        onClose={() => setIsConfirmChangeStatusList(false)}
        onReject={() => setIsConfirmChangeStatusList(false)}
      />
    </>
  );
};

export default RewardList;
