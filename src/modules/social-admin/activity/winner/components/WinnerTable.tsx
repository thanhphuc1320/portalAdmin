import { Checkbox, Grid, Typography, Button } from '@material-ui/core';
import React, { useEffect, useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { debounce } from 'lodash';
import queryString from 'query-string';
import moment from 'moment';
import { useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { API_PATHS } from 'configs/API';
import { fetchThunk } from 'modules/common/redux/thunk';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';
import { snackbarSetting, Row } from 'modules/common/components/elements';
import ConfirmDialog from 'modules/common/components/ConfirmDialog';
import LoadingButton from 'modules/common/components/LoadingButton';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import StatusHistoriesDialog from './StatusHistoriesDialog';
import ImportDialog from './ImportDialog';
import { GRAY_DARK, PRIMARY } from 'configs/colors';
import { some, isEmpty } from 'configs/utils';
import { ReactComponent as IconToggleFilter } from 'svg/icon_adjustment_grey.svg';
import { ReactComponent as IconClock } from 'svg/icon_clock.svg';
import { STATUS_WINNER, STATUS_WINNER_SELECT, STATUS_WINNER_CODES } from '../constants';
import './style.scss';

const cssClass = 'winner-list-component';

interface dataMessageProps {
  title: string;
  message: string;
  labelButton?: string;
}
interface Props {
  setLoading(value: boolean): void;
  loading: boolean;
  filter: any;
  setFilter(value: any): void;
  onUpdateFilter(filter: some): void;
  onToggleFilter?(): void;
}
const WinnerTable: React.FC<Props> = props => {
  const { setLoading, loading, filter, setFilter, onUpdateFilter, onToggleFilter } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const location = useLocation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [data, setData] = useState<some>({ content: [], totalElements: 0 });
  const [checkBoxList, setCheckBoxList] = useState<number[]>([]);
  const [checkBoxStatusList, setCheckBoxStatusList] = useState<string[]>([]);
  const [action, setAction] = useState<string>('');
  const [openImportDialog, setOpenImportDialog] = useState<boolean>(false);
  const [openHistoriesDialog, setOpenHistoriesDialog] = useState<boolean>(false);
  const [loadingHistories, setLoadingHistories] = useState<boolean>(false);
  const [loadingImportExport, setLoadingImportExport] = useState<boolean>(false);
  const [isConfirmChangeStatusList, setIsConfirmChangeStatusList] = useState<boolean>(false);
  const [isPopupInfo, setIsPopupInfo] = useState<boolean>(false);
  const [dataMessage, setDataMessage] = useState<dataMessageProps>();
  const [statusHistories, setStatusHistories] = useState<some[]>([]);
  const [dataImportExport, setDataImportExport] = useState<any>();
  const [linkSample, setLinkSample] = useState<string>();

  const eventList = data?.content || [];
  const actionStatusObject: any =
    !isEmpty(action) && STATUS_WINNER.find(item => item.id === action);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    const filterParams = (queryString.parse(location.search) as unknown) as any;
    filterParams.sort = filterParams.sort ? filterParams.sort : 'createdAt,desc';
    filterParams.size = filterParams?.size ? filterParams?.size : 10;
    setFilter({ ...filterParams });
    filterParams.page = filterParams?.page ? Number(filterParams?.page) + 1 : 1;
    let queryFilter = queryString.stringify(filterParams);
    if (filterParams?.status === STATUS_WINNER_CODES.REWARDED) {
      queryFilter = `${queryFilter}&status=${STATUS_WINNER_CODES.USER_OPENED}`;
    }

    const json = await dispatch(fetchThunk(`${API_PATHS.getAdminWinners}?${queryFilter}`, 'get'));
    if (json?.code === 200) {
      setData(json.data);
      setLoading(false);
    } else {
      setLoading(false);
      json?.message &&
        enqueueSnackbar(
          json?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
    }
  }, [setLoading, location.search, setFilter, dispatch, enqueueSnackbar, closeSnackbar]);

  const fetchLinkSample = React.useCallback(async () => {
    const json = await dispatch(
      fetchThunk(`${API_PATHS.getAdminApplicationSettings}?key=winner_import_template`, 'get'),
    );
    if (json?.code === 200) {
      const resultSetting = json?.data?.content[0];
      setLinkSample(resultSetting?.value);
    } else {
      json?.message &&
        enqueueSnackbar(
          json?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
    }
  }, [dispatch, enqueueSnackbar, closeSnackbar, setLinkSample]);

  const getAdminReports = useCallback(
    debounce(async () => {
      setOpenImportDialog(false);
      const json = await dispatch(
        fetchThunk(`${API_PATHS.getAdminReports}?module=ADMIN_WINNER_MANAGEMENT`, 'get'),
      );
      const result = json?.data?.content[0];
      if (result?.status === 'DONE') {
        setDataImportExport(json?.data?.content[0]);
        setLoadingImportExport(false);
        enqueueSnackbar(
          json?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'success',
          }),
        );
      } else {
        getAdminReports();
      }
    }, 5000),
    [
      closeSnackbar,
      dispatch,
      enqueueSnackbar,
      setDataImportExport,
      setLoadingImportExport,
      setOpenImportDialog,
    ],
  );

  const handleExport = React.useCallback(async () => {
    setLoadingImportExport(true);
    const filterParams = (queryString.parse(location.search) as unknown) as any;
    filterParams.sort = filterParams.sort ? filterParams.sort : 'createdAt,desc';
    setFilter({
      ...filterParams,
    });
    const json = await dispatch(
      fetchThunk(
        `${API_PATHS.getAdminWinnersExport}?${queryString.stringify(filterParams)}`,
        'get',
      ),
    );
    if (json?.code === 200) {
      getAdminReports();
    } else {
      json?.message &&
        enqueueSnackbar(
          json?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
    }
  }, [
    setLoadingImportExport,
    location.search,
    setFilter,
    dispatch,
    enqueueSnackbar,
    closeSnackbar,
    getAdminReports,
  ]);

  const getStatusHistories = useCallback(
    async (id: number) => {
      setLoadingHistories(true);
      const json = await dispatch(
        fetchThunk(`${API_PATHS.getAdminStatusHistories}?id=${id}`, 'get'),
      );
      if (json?.code === 200) {
        setStatusHistories(json?.data || []);
        setLoadingHistories(false);
      } else {
        setLoadingHistories(false);
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
      }
    },
    [closeSnackbar, dispatch, enqueueSnackbar],
  );

  useEffect(() => {
    fetchData();
    fetchLinkSample();
  }, [fetchData, fetchLinkSample]);

  const onUpdateStatusBulk = useCallback(
    async (ids: number[]) => {
      setLoading(true);
      const json = await dispatch(
        fetchThunk(`${API_PATHS.adminWinnersUpdateStatus}?ids=${ids}&status=${action}`, 'put'),
      );
      setAction('');
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
      setLoading(false);
    },
    [closeSnackbar, dispatch, enqueueSnackbar, fetchData, setLoading, setAction, action],
  );

  const getStatusDisabledList = () => {
    const statusListUnique = [...new Set(checkBoxStatusList)];
    let checkList: string[] = [];

    statusListUnique?.map(status => {
      // case 1
      if (status === STATUS_WINNER_CODES.WAITING) {
        checkList = checkList?.concat([STATUS_WINNER_CODES.REWARDED, STATUS_WINNER_CODES.WAITING]);
      }
      // case 2
      if (status === STATUS_WINNER_CODES.DENIED) {
        checkList = checkList?.concat([
          STATUS_WINNER_CODES.APPROVED,
          STATUS_WINNER_CODES.WAITING,
          STATUS_WINNER_CODES.REWARDED,
          STATUS_WINNER_CODES.USER_OPENED,
          STATUS_WINNER_CODES.DENIED,
        ]);
      }
      // case 3
      if (status === STATUS_WINNER_CODES.APPROVED) {
        checkList = checkList?.concat([STATUS_WINNER_CODES.APPROVED]);
      }
      // case 4
      if (status === STATUS_WINNER_CODES.REWARDED || status === STATUS_WINNER_CODES.USER_OPENED) {
        checkList = checkList?.concat([
          STATUS_WINNER_CODES.APPROVED,
          STATUS_WINNER_CODES.WAITING,
          STATUS_WINNER_CODES.REWARDED,
          STATUS_WINNER_CODES.USER_OPENED,
          STATUS_WINNER_CODES.DENIED,
        ]);
      }
    });

    // case 5
    if (
      statusListUnique?.includes(STATUS_WINNER_CODES.WAITING) &&
      statusListUnique?.includes(STATUS_WINNER_CODES.APPROVED)
    ) {
      checkList = [
        STATUS_WINNER_CODES.APPROVED,
        STATUS_WINNER_CODES.WAITING,
        STATUS_WINNER_CODES.REWARDED,
        STATUS_WINNER_CODES.USER_OPENED,
      ];
    }
    return checkList;
  };

  const onSelectAction = useCallback(
    (status: string) => {
      if (isEmpty(checkBoxList)) {
        setDataMessage({
          title: 'Thông báo',
          message: 'Bạn chưa chọn winner nào!',
          labelButton: 'close',
        });
        setIsPopupInfo(true);
        return;
      }
      setIsConfirmChangeStatusList(true);
      setAction(status);
    },
    [checkBoxList, setIsConfirmChangeStatusList, setAction],
  );

  const onViewStatusHistories = useCallback(
    async (id: number) => {
      if (id > 0) {
        getStatusHistories(id);
        setOpenHistoriesDialog(true);
      }
    },
    [getStatusHistories],
  );

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
              setCheckBoxStatusList([]);
            } else {
              const tempListId: number[] = [];
              const tempListStatus: string[] = [];
              eventList?.map((element: any, i: number) => {
                tempListId[i] = element?.id;
                tempListStatus[i] = element?.winnerStatus;
              });
              setCheckBoxList(tempListId);
              setCheckBoxStatusList(tempListStatus);
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
                setCheckBoxList([...checkBoxList, record?.id]);
                setCheckBoxStatusList([...checkBoxStatusList, record?.winnerStatus]);
              }

              const indexCheckBox = checkBoxList.indexOf(record?.id);
              if (indexCheckBox > -1) {
                checkBoxList?.splice(indexCheckBox, 1);
                setCheckBoxList([...checkBoxList]);

                checkBoxStatusList?.splice(indexCheckBox, 1);
                setCheckBoxStatusList([...checkBoxStatusList]);
              }
            }}
          />
        );
      },
    },
    {
      title: 'win_id',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => (
        <Typography variant="subtitle2" style={{ color: PRIMARY }}>
          {record?.code}
        </Typography>
      ),
    },
    {
      title: 'win_user',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => (
        <Row style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="subtitle2" style={{ color: PRIMARY }}>
            {record?.user?.id}
          </Typography>
          <Typography variant="body2" style={{ color: GRAY_DARK }}>
            {record?.user?.name}
          </Typography>
          <Typography variant="body2" style={{ color: GRAY_DARK }}>
            {record?.user?.phone}
          </Typography>
        </Row>
      ),
    },
    {
      title: 'event',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => (
        <Row style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="subtitle2" style={{ color: PRIMARY }}>
            {record?.event?.code}
          </Typography>
          <Typography
            variant="body2"
            className="limit-text-2"
            style={{ color: GRAY_DARK, maxWidth: 250 }}
          >
            {record?.event?.name}
          </Typography>
        </Row>
      ),
    },
    {
      title: 'reward',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => (
        <Row style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="subtitle2" style={{ color: PRIMARY }}>
            {record?.eventReward?.reward?.code}
          </Typography>
          <Typography
            variant="body2"
            className="limit-text-2"
            style={{ color: GRAY_DARK, maxWidth: 200 }}
          >
            {record?.eventReward?.reward?.name}
          </Typography>
          <Typography
            variant="body2"
            className="limit-text-2"
            style={{ color: GRAY_DARK, maxWidth: 200 }}
          >
            {record?.eventReward?.displayName}
          </Typography>
        </Row>
      ),
    },
    {
      title: 'time',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {record?.createdAt && moment(record?.createdAt).format('DD/MM/YYYY - HH:mm')}
        </Typography>
      ),
    },
    {
      title: 'win_status',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => {
        const statusObject = STATUS_WINNER.find(item => item.id === record?.winnerStatus);
        return (
          <>
            <Typography
              variant="body1"
              style={{
                padding: '2px 6px',
                display: 'inline-block',
                minWidth: 88,
                textAlign: 'center',
                borderRadius: 4,
                color: statusObject?.color,
                backgroundColor: statusObject?.background,
              }}
            >
              {statusObject?.name}
            </Typography>
            {record?.updated && (
              <Button style={{ marginLeft: 6 }} onClick={() => onViewStatusHistories(record?.id)}>
                <IconClock />
              </Button>
            )}
          </>
        );
      },
    },
  ];

  const resultUrl = dataImportExport?.resultUrl;
  const numberError = dataImportExport?.handleLog?.numberOfRecordsError;
  const numberSuccess = dataImportExport?.handleLog?.numberOfRecordsSucccess;
  const statusDisabledList: string[] = getStatusDisabledList();

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
                Danh sách winner ({data?.totalElements || 0})
              </Typography>
              <div className={`${cssClass}-head-top-group-button`}>
                <LoadingButton
                  variant="outlined"
                  color="primary"
                  size="large"
                  style={{ minWidth: 140, marginRight: 25 }}
                  disableElevation
                  loading={loadingImportExport}
                  disabled={loadingImportExport}
                  onClick={() => setOpenImportDialog(true)}
                >
                  Import tệp
                </LoadingButton>

                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="large"
                  style={{ minWidth: 140, marginRight: 20 }}
                  color="primary"
                  disableElevation
                  loading={loadingImportExport}
                  disabled={loadingImportExport}
                  onClick={handleExport}
                >
                  Export
                </LoadingButton>
                <IconToggleFilter onClick={onToggleFilter} style={{ cursor: 'pointer' }} />
              </div>
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
                <Grid item xs={3} />
                <Grid item xs={6} style={{ textAlign: 'center' }}>
                  {dataImportExport?.type === 'EXPORT' && (
                    <p>
                      Export thành công {numberSuccess} dữ liệu. Xem{' '}
                      <a href={resultUrl || '#'} className={`${cssClass}-head-top-link`} download>
                        Danh sách Export
                      </a>
                    </p>
                  )}
                  {dataImportExport?.type === 'IMPORT' && (
                    <p>
                      Import thành công {numberSuccess} dữ liệu.
                      {numberError > 0 && (
                        <span>
                          , lỗi <strong style={{ color: 'red' }}>{numberError} dữ liệu</strong>
                        </span>
                      )}{' '}
                      Xem{' '}
                      <a href={resultUrl || '#'} className={`${cssClass}-head-top-link`} download>
                        Danh sách Import
                      </a>
                    </p>
                  )}
                </Grid>
                <Grid item xs={3} style={{ textAlign: 'right' }}>
                  <FormControlAutoComplete<some>
                    placeholder="Thao tác"
                    value={null}
                    onChange={(e: any, valueItem: some | null) => {
                      onSelectAction(valueItem?.id);
                    }}
                    options={STATUS_WINNER_SELECT}
                    getOptionLabel={(one: some) => one.name}
                    getOptionSelected={(option: some, value: some) => {
                      return option?.id === value?.id;
                    }}
                    getOptionDisabled={(option: some) => {
                      return statusDisabledList?.includes(option?.id);
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

      <StatusHistoriesDialog
        open={openHistoriesDialog}
        setOpen={setOpenHistoriesDialog}
        statusHistories={statusHistories}
        loading={loadingHistories}
        onClose={() => setOpenHistoriesDialog(false)}
      />

      <ImportDialog
        open={openImportDialog}
        setOpen={setOpenImportDialog}
        onClose={() => setOpenImportDialog(false)}
        linkSample={linkSample}
        setImportSuccess={isSuccess => {
          if (isSuccess) {
            setLoadingImportExport(true);
            getAdminReports();
          }
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

      {/* isConfirmChangeStatusList */}
      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={isConfirmChangeStatusList}
        acceptLabel="confirm"
        rejectLabel="cancel"
        onAccept={() => {
          onUpdateStatusBulk(checkBoxList);
          setCheckBoxList([]);
          setCheckBoxStatusList([]);
          setIsConfirmChangeStatusList(false);
        }}
        titleHead={
          <Typography style={{ marginBottom: 16 }} variant="subtitle1">
            Xác nhận <span style={{ textTransform: 'lowercase' }}>{actionStatusObject?.name}</span>
          </Typography>
        }
        titleLabel={
          <Typography variant="body1">
            Bạn có chắc muốn thay đổi trạng thái trao thưởng đã chọn?
          </Typography>
        }
        onClose={() => setIsConfirmChangeStatusList(false)}
        onReject={() => setIsConfirmChangeStatusList(false)}
      />
    </>
  );
};

export default WinnerTable;
