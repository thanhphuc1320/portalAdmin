import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { CA_ID } from 'modules/auth/constants';
import { fetchThunk } from 'modules/common/redux/thunk';
import { useSnackbar } from 'notistack';
import queryString from 'query-string';
import { setNotistackMessage } from 'modules/common/redux/reducer';

import { Button, Grid, Typography } from '@material-ui/core';
// import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import { API_PATHS } from 'configs/API';
import { BLACK_500, GRAY_DARK, PRIMARY } from 'configs/colors';
import { some } from 'configs/utils';
import ConfirmDialog from 'modules/common/components/ConfirmDialog';
import { Row, snackbarSetting } from 'modules/common/components/elements';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
// import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';

import { ReactComponent as IconFeedPhoto } from 'svg/feed_photo.svg';
import { ReactComponent as IconToggleFilter } from 'svg/icon_adjustment_grey.svg';
import './style.scss';

const cssClass = 'item-list-component';
// const ACTIONS = {
//   MULTI_DELETE: 'MULTI_DELETE',
// };

interface dataMessageProps {
  title: string;
  message: string;
  labelButton?: string;
}

interface Props {
  caIdList?: some[];
  filter: any;
  loading: boolean;
  setLoading(value: boolean): void;
  setFilter(value: any): void;
  onUpdateFilter(filter: some): void;
  onToggleFilter?(): void;
  provinceId: number;
  setProvinceId(value: number): void;
}

const ItemTable: React.FC<Props> = props => {
  const {
    filter,
    loading,
    setFilter,
    onUpdateFilter,
    setLoading,
    onToggleFilter,
    provinceId,
    setProvinceId,
  } = props;
  const history = useHistory();
  const location = useLocation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [dataMessage, setDataMessage] = useState<dataMessageProps>();
  const [isPopupInfo, setIsPopupInfo] = useState<boolean>(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);
  const [itemDelete, setItemDelete] = useState<any>();
  const [data, setData] = useState<some>([]);
  const [provincesList, setProvincesList] = useState<some[]>([]);
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const caIdLocaltion = localStorage.getItem(CA_ID);

  const fetchProvinces = useCallback(async () => {
    const params = {
      page: 1,
      size: 500,
    };
    const json = await dispatch(
      fetchThunk(
        `${API_PATHS.listProvinces}?caId=${caIdLocaltion}`,
        'post',
        JSON.stringify(params),
        true,
      ),
    );
    if (json?.code === 200) {
      setProvincesList(json?.data?.items || []);
    } else {
      json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
    }
  }, [caIdLocaltion, dispatch]);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    const filterParams = (queryString.parse(location.search) as unknown) as any;
    filterParams.sort = filterParams.sort ? filterParams.sort : 'createdAt,desc';
    filterParams.size = filterParams?.size ? filterParams?.size : 10;
    filterParams.provinceId = filterParams?.provinceId ? filterParams?.provinceId : provinceId;
    setFilter({
      ...filterParams,
    });
    filterParams.page = filterParams?.page ? Number(filterParams?.page) + 1 : 1;
    const json = await dispatch(
      fetchThunk(`${API_PATHS.adminItemHotel}?${queryString.stringify(filterParams)}`, 'get'),
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
  }, [
    setLoading,
    location.search,
    provinceId,
    setFilter,
    dispatch,
    enqueueSnackbar,
    closeSnackbar,
  ]);

  const onDeleteBulk = useCallback(
    async (ids: number[]) => {
      setLoading(true);
      const json = await dispatch(
        fetchThunk(`${API_PATHS.deActiveAdminItemHotel}?id=${ids}`, 'get'),
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

  const handleCreatePost = record => {
    history.replace(`/article/create?type=ITEM&hotelId=${record?.hotelObjectBase?.hotelId}`);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchProvinces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: Columns[] = [
    {
      title: 'id',
      styleHeader: { textAlign: 'center', justifyContent: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography
          variant="subtitle2"
          style={
            record?.hotelObjectBase?.isActive
              ? { color: PRIMARY }
              : { color: BLACK_500, opacity: 0.5 }
          }
        >
          {record?.hotelObjectBase?.code}
        </Typography>
      ),
    },
    {
      title: 'position',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => (
        <Typography
          variant="body2"
          className="limit-text-2"
          style={
            record?.hotelObjectBase?.isActive
              ? { color: GRAY_DARK, maxWidth: 150 }
              : { color: BLACK_500, opacity: 0.5, maxWidth: 150 }
          }
        >
          {record?.hotelObjectBase?.address}
        </Typography>
      ),
    },
    {
      title: 'nameHotel',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => {
        return (
          <Row style={{ justifyContent: 'flex-start' }}>
            {record?.hotelObjectBase?.imageUrl ? (
              <img
                src={record?.hotelObjectBase?.post?.thumbnail}
                style={{ width: 48, height: 48, borderRadius: 4, objectFit: 'cover' }}
                alt="avatar"
              />
            ) : (
              <IconFeedPhoto />
            )}
            <Typography
              variant="body2"
              className="limit-text-2"
              style={
                record?.hotelObjectBase?.isActive
                  ? { color: GRAY_DARK, maxWidth: 150, fontWeight: 'bold', marginLeft: 10 }
                  : {
                      color: BLACK_500,
                      maxWidth: 150,
                      fontWeight: 'bold',
                      opacity: 0.5,
                      marginLeft: 10,
                    }
              }
            >
              {record?.hotelObjectBase?.name}
            </Typography>
          </Row>
        );
      },
    },
    {
      title: 'shows',
      styleHeader: { textAlign: 'center', justifyContent: 'center' },
      style: { textAlign: 'center', justifyContent: 'center' },
      render: (record: some) => (
        <Typography
          variant="body2"
          className="limit-text-2"
          style={
            record?.hotelObjectBase?.isActive
              ? { color: GRAY_DARK, maxWidth: 150, margin: 'auto', justifyContent: 'center' }
              : {
                  color: BLACK_500,
                  maxWidth: 150,
                  opacity: 0.5,
                  margin: 'auto',
                  justifyContent: 'center',
                }
          }
        >
          {record?.numOfDisplay}
        </Typography>
      ),
    },
    {
      title: 'viewsNums',
      styleHeader: { textAlign: 'center', justifyContent: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography
          variant="body2"
          className="limit-text-2"
          style={
            record?.hotelObjectBase?.isActive
              ? { color: GRAY_DARK, maxWidth: 150, margin: 'auto' }
              : { color: BLACK_500, maxWidth: 150, opacity: 0.5, margin: 'auto' }
          }
        >
          {record?.numOfView}
        </Typography>
      ),
    },
    {
      title: 'AccessNums',
      styleHeader: { textAlign: 'center', justifyContent: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography
          variant="body2"
          className="limit-text-2"
          style={
            record?.hotelObjectBase?.isActive
              ? { color: GRAY_DARK, maxWidth: 150, margin: 'auto' }
              : { color: BLACK_500, maxWidth: 150, opacity: 0.5, margin: 'auto' }
          }
        >
          {record?.numOfAccess}
        </Typography>
      ),
    },
    {
      title: 'PostNums',
      styleHeader: { textAlign: 'center', justifyContent: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography
          variant="body2"
          className="limit-text-2"
          style={
            record?.hotelObjectBase?.isActive
              ? { color: GRAY_DARK, maxWidth: 150, margin: 'auto' }
              : { color: BLACK_500, maxWidth: 150, opacity: 0.5, margin: 'auto' }
          }
        >
          {record?.numOfPost}
        </Typography>
      ),
    },
    {
      title: 'action',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'right' },
      render: (record: any) => {
        const ids: number[] = [];
        ids.push(record?.hotelObjectBase?.id);
        return (
          <Row style={{ padding: '16px 12px', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              color="primary"
              style={{ width: 76, height: 32, whiteSpace: 'nowrap', margin: '0px' }}
              onClick={() => {
                handleCreatePost(record);
              }}
              disabled={!record?.hotelObjectBase?.isActive}
            >
              <Typography
                variant="subtitle2"
                style={
                  record?.hotelObjectBase?.isActive
                    ? { color: PRIMARY, padding: '0 10px' }
                    : { color: BLACK_500, padding: '0 10px', opacity: 0.5 }
                }
              >
                Tạo bài
              </Typography>
            </Button>
            <Button
              variant="outlined"
              style={{ width: 32, height: 32, marginLeft: '10px' }}
              onClick={() => {
                setItemDelete(record?.hotelObjectBase);
                setIsConfirmDelete(true);
              }}
              disabled={!record?.hotelObjectBase?.isActive}
            >
              <DeleteOutlineRoundedIcon
                style={
                  record?.hotelObjectBase?.isActive
                    ? { width: 16, height: 16 }
                    : { width: 16, height: 16, opacity: 0.5 }
                }
              />
            </Button>
          </Row>
        );
      },
    },
  ];

  return (
    <>
      <TableCustom
        dataSource={data.content}
        loading={loading}
        style={{ marginTop: 24, border: 4 }}
        columns={columns}
        noColumnIndex
        header={
          <div>
            <div className={`${cssClass}-head-top`} style={{ position: 'relative' }}>
              <Typography variant="subtitle1" style={{ marginBottom: 15 }}>
                Danh sách khách sạn ({data?.totalElements || 0})
              </Typography>
              <div>
                <Row
                  style={{
                    padding: '16px 28px 16px 24px',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <Grid item xs={12} sm={12}>
                    <FormControlAutoComplete
                      id="provinceId"
                      value={provincesList?.find((v: some) => v.id === provinceId) || null}
                      formControlStyle={{ width: '100%' }}
                      placeholder="Tìm kiếm"
                      onChange={(e: any, value: some | null) => {
                        setProvinceId(value?.id);
                      }}
                      options={provincesList as some[]}
                      getOptionLabel={(one: some) => one.name}
                      getOptionSelected={(option: some) => {
                        return option?.id === provinceId;
                      }}
                      optional
                    />
                  </Grid>
                </Row>
              </div>
              <IconToggleFilter
                onClick={onToggleFilter}
                style={{ cursor: 'pointer', position: 'absolute', right: '2%', top: '40%' }}
              />
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

      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={isConfirmDelete}
        acceptLabel="Deactive"
        rejectLabel="cancel"
        onAccept={() => {
          const ids: number[] = [];
          ids.push(itemDelete?.hotelId);
          onDeleteBulk && onDeleteBulk(ids);
          setIsConfirmDelete(false);
        }}
        titleHead={
          <Typography style={{ marginBottom: 16 }} variant="subtitle1">
            Xác nhận Deactive
          </Typography>
        }
        titleLabel={
          <Typography variant="body1">Bạn có chắc muốn deactive hotel item này ?</Typography>
        }
        onClose={() => setIsConfirmDelete(false)}
        onReject={() => setIsConfirmDelete(false)}
      />
    </>
  );
};

export default ItemTable;
