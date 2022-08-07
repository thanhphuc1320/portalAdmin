import { Button, Checkbox, FormControl, Grid, NativeSelect, Typography } from '@material-ui/core';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import { GRAY, PRIMARY } from 'configs/colors';
import { ROUTES } from 'configs/routes';
import { DATE_FORMAT, DATE_FORMAT_SHOW } from 'models/moment';
import { Col, IOSSwitch, Row } from 'modules/common/components/elements';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import queryString from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { API_PATHS } from '../../../../configs/API';
import { some } from '../../../../constants';
import { AppState } from '../../../../redux/reducers';
import { ReactComponent as IDelete } from '../../../../svg/iconly-light-outline-delete.svg';
import ConfirmDialog from '../../../common/components/ConfirmDialog';
import { snackbarSetting } from '../../../common/components/elements';
import { fetchThunk } from '../../../common/redux/thunk';

interface Props {
  setLoading(value: boolean): void;
  loading: boolean;
  filter: any;
  setFilter(value: any): void;
  caIdList: any;
  onUpdateFilter(filter: some): void;
}
const HashtagRankingTable: React.FC<Props> = props => {
  const { loading, setLoading, setFilter, caIdList, filter, onUpdateFilter } = props;

  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const history = useHistory();
  const location = useLocation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [data, setData] = useState<some[]>();
  const [totalElements, setTotalElements] = useState<number>();
  const [deleteHashTags, onDeleteHashTags] = useState<boolean>(false);
  const [deleteHasTags, setDeleteHasTags] = useState<number>();
  const [deleteListHashTagRanking, setDeleteListHashTagRanking] = useState<boolean>(false);
  const [checkBoxList, setCheckBoxList] = useState<number[]>([]);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    const filterParams = (queryString.parse(location.search) as unknown) as any;
    filterParams.sort = filterParams.sort ? filterParams.sort : 'createdAt,desc';
    filterParams.size = filterParams?.size ? filterParams?.size : 10;
    filterParams.page = filterParams?.page ? filterParams?.page : 0;
    delete filterParams.createdByName;

    setFilter({
      ...filterParams,
    });
    const json = await dispatch(
      fetchThunk(
        `${API_PATHS.getHashTagRanking}?${queryString.stringify({
          ...filterParams,
          page: Number(filterParams.page) + 1,
        })}`,
        'get',
      ),
    );
    if (json?.code === 200) {
      setTotalElements(json.data.totalElements);
      setData(json.data.content);
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

  const putHashtagRanking = useCallback(
    async (values: any) => {
      const tempStatus = values?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      setLoading(true);
      const json = await dispatch(
        fetchThunk(
          `${API_PATHS.updateStatusHashTagRanking}?id=${values?.id}&status=${tempStatus}`,
          'put',
        ),
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
  const actionDeleteHashTagRanking = useCallback(
    async (idDel: number) => {
      setLoading(true);
      const json = await dispatch(
        fetchThunk(`${API_PATHS.getHashTagRanking}?id=${idDel}`, 'delete'),
      );
      if (json?.code === 200) {
        fetchData();
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'success',
            }),
          );
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
    [closeSnackbar, dispatch, enqueueSnackbar, fetchData, setLoading],
  );
  const handleBulkHashTagRanking = useCallback(
    async (action: string) => {
      const params = {
        action,
        ids: checkBoxList,
      };
      const urlActive = `${API_PATHS.bulkHashTagRanking}`;
      const json = await dispatch(fetchThunk(urlActive, 'put', JSON.stringify(params)));
      if (json?.code === 200) {
        fetchData();
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'success',
            }),
          );
      } else {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
      }
      setDeleteListHashTagRanking(false);
      setCheckBoxList([]);
    },
    [checkBoxList, closeSnackbar, dispatch, enqueueSnackbar, fetchData],
  );
  const columns: Columns[] = [
    {
      title: '#',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Checkbox
          color="primary"
          checked={!!checkBoxList.find(element => element === record?.id)}
          onChange={() => {
            if (!checkBoxList.find(element => element === record?.id)) {
              setCheckBoxList([...checkBoxList, record.id]);
            } else {
            }
            const indexCheckBox = checkBoxList.indexOf(record?.id);
            if (indexCheckBox > -1) {
              checkBoxList.splice(indexCheckBox, 1);
              setCheckBoxList([...checkBoxList]);
            }
          }}
        />
      ),
    },
    {
      title: 'ID',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => (
        <Typography variant="subtitle2" style={{ color: PRIMARY, textAlign: 'left' }}>
          {record?.id}
        </Typography>
      ),
    },
    {
      title: 'Tên bảng xếp hạng',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => <Typography variant="body2">{record?.name}</Typography>,
    },
    {
      title: 'Thời gian tạo',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => (
        <Typography
          variant="caption"
          style={{
            color: GRAY,
          }}
        >
          {moment(record?.createdAt).format(DATE_FORMAT_SHOW)}
        </Typography>
      ),
    },
    {
      title: 'Kênh bán áp dụng',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => (
        <Typography variant="body2" style={{ textAlign: 'left' }}>
          {caIdList?.find(element => element?.id === record?.caId)?.name}
        </Typography>
      ),
    },
    {
      title: 'Thời gian áp dụng',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => (
        <Typography
          variant="caption"
          style={{
            color: GRAY,
          }}
        >
          {moment(record?.startDate).format(DATE_FORMAT)} -{' '}
          {moment(record?.endDate).format(DATE_FORMAT)}
        </Typography>
      ),
    },
    {
      title: 'Trạng thái',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => (
        <IOSSwitch
          checked={record?.status === 'ACTIVE'}
          onChange={() => {
            putHashtagRanking(record);
          }}
        />
      ),
    },
    {
      title: 'action',
      disableAction: true,
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left', width: 220 },
      render: (record: any) => {
        return (
          <Row style={{ padding: '16px 0px', justifyContent: 'left' }}>
            <Button
              variant="outlined"
              color="primary"
              style={{ marginRight: 8, minWidth: 90, minHeight: 32 }}
              onClick={() => {
                history.push({ pathname: ROUTES.hashtagRanking.view, search: `?id=${record.id}` });
              }}
            >
              Xem
            </Button>
            <Button
              variant="outlined"
              color="primary"
              style={{ marginRight: 8, width: 32, height: 32 }}
              onClick={() => {
                history.push({
                  pathname: ROUTES.hashtagRanking.update,
                  search: `?id=${record.id}`,
                });
              }}
            >
              <BorderColorIcon style={{ width: 16, height: 16 }} />
            </Button>
            <Button
              variant="outlined"
              style={{ width: 32, height: 32 }}
              onClick={() => {
                onDeleteHashTags(true);
                record?.id && setDeleteHasTags(record?.id);
              }}
            >
              <DeleteOutlineRoundedIcon style={{ width: 16, height: 16 }} />
            </Button>
          </Row>
        );
      },
    },
  ];

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Col>
        <TableCustom
          dataSource={data}
          loading={loading}
          style={{ marginTop: 24 }}
          columns={columns}
          noColumnIndex
          header={
            <Row
              style={{
                padding: '16px 28px 16px  36px',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <Grid container alignItems="center">
                <Grid item xs={6}>
                  <Typography variant="subtitle1" style={{ marginBottom: 15 }}>
                    Danh sách bảng xếp hạng ({totalElements})
                  </Typography>
                  <Checkbox
                    checked={checkBoxList.length === filter?.size}
                    color="primary"
                    indeterminate={
                      checkBoxList.length === filter?.size ? undefined : !!checkBoxList.length
                    }
                    onChange={() => {
                      if (checkBoxList.length === filter?.size) {
                        setCheckBoxList([]);
                      } else {
                        const tempListId = data?.map((element: any) => element?.id);
                        tempListId && setCheckBoxList(tempListId);
                      }
                    }}
                    inputProps={{ 'aria-label': 'indeterminate checkbox' }}
                  />
                  <Button
                    disabled={!checkBoxList.length}
                    size="small"
                    color={
                      queryString.parse(location.search)?.status === 'DENIED'
                        ? 'primary'
                        : undefined
                    }
                    variant="outlined"
                    onClick={() => {
                      setDeleteListHashTagRanking(true);
                    }}
                    style={{ marginRight: 16, minHeight: 26 }}
                  >
                    <IDelete
                      className="svgFillAll"
                      width={20}
                      stroke="#899296"
                      style={{ marginRight: 4 }}
                    />
                    Xóa
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <FormControl style={{ float: 'right' }}>
                    <NativeSelect
                      value={
                        queryString.parse(location.search)?.sort
                          ? queryString.parse(location.search)?.sort
                          : 'createdAt,desc'
                      }
                      onChange={event => {
                        history.replace({
                          search: queryString.stringify({
                            ...queryString.parse(location.search),
                            sort: event?.target.value,
                          }),
                        });
                      }}
                      style={{
                        fontSize: 14,
                        color: '#3D3F40',
                        marginRight: 16,
                        border: '1px solid #C1C6C9',
                        borderRadius: 5,
                        padding: '5px 15px',
                      }}
                    >
                      <option value="createdAt,desc">Ngày tạo mới nhất</option>
                      <option value="createdAt,asc">Ngày tạo cũ nhất</option>
                    </NativeSelect>
                  </FormControl>
                </Grid>
              </Grid>
            </Row>
          }
          paginationProps={{
            count: totalElements || 0,
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
        <ConfirmDialog
          style={{ textAlign: 'center' }}
          open={!!deleteHashTags}
          onAccept={() => {
            onDeleteHashTags(false);
            deleteHasTags && actionDeleteHashTagRanking(deleteHasTags);
          }}
          titleHead={
            <Typography style={{ marginBottom: 16 }} variant="subtitle1">
              Xóa xếp hạng
            </Typography>
          }
          titleLabel={
            <Typography variant="body1">Bạn có chắc chắn muốn xóa bảng xếp hạng?</Typography>
          }
          onClose={() => {
            onDeleteHashTags(false);
          }}
          onReject={() => {
            onDeleteHashTags(false);
          }}
        />
        <ConfirmDialog
          style={{ textAlign: 'center' }}
          open={!!deleteListHashTagRanking}
          onAccept={() => {
            handleBulkHashTagRanking('DELETE');
          }}
          titleHead={
            <Typography style={{ marginBottom: 16 }} variant="subtitle1">
              Xóa hashtag
            </Typography>
          }
          titleLabel={
            <Typography variant="body1">
              Bạn có chắc chắn muốn bảng xếp hạng đã chọn không?
            </Typography>
          }
          onClose={() => setDeleteListHashTagRanking(false)}
          onReject={() => setDeleteListHashTagRanking(false)}
        />
      </Col>
    </>
  );
};

export default HashtagRankingTable;
