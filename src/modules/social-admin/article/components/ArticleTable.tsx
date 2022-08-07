import {
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControl,
  NativeSelect,
  Typography,
} from '@material-ui/core';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import { push } from 'connected-react-router';
import { debounce } from 'lodash';
import {
  DATE_FORMAT_BACK_END,
  formatDateTimeHourText,
  DATE_FORMAT_TIMEZONE,
  HOUR_MINUTE,
  DATE_FORMAT_C_DATE_HOUR,
} from 'models/moment';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import queryString from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { GRAY, GRAY_DARK, PRIMARY } from 'configs/colors';
import { ROUTES } from 'configs/routes';
import { some } from 'configs/utils';
import { AppState } from '../../../../redux/reducers';
import { ReactComponent as IHide } from 'svg/Hide.svg';
import { ReactComponent as IDelete } from 'svg/iconly-light-outline-delete.svg';
import { ReactComponent as IconClock } from 'svg/icon_clock.svg';
import { ReactComponent as ICheck } from 'svg/ic_checked.svg';
import { ReactComponent as IEyeOpen } from 'svg/ic_eye_open.svg';
import { ReactComponent as IBlock } from 'svg/Vector.svg';
import { ReactComponent as IconFeedPhoto } from 'svg/feed_photo.svg';
import ConfirmDialog from 'modules/common/components/ConfirmDialog';
import { Col, IOSSwitch, Row, snackbarSetting } from 'modules/common/components/elements';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';
import { fetchThunk } from 'modules/common/redux/thunk';
import {
  getTagUserPost,
  STATUS_OPTIONS,
  STATUS_TITLE_TABLE,
  POST_TYPE_OPTIONS,
  SERVICE_TYPE_OPTIONS,
} from 'modules/social-admin/constants';
import EditArticle from './EditArticle';
import Filter from './Filter';
import PreviewArticle from './PreviewArticle';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getBaseUrlWebApp, API_PATHS } from 'configs/API';
import { CA_INFO } from 'modules/auth/constants';

interface Props {
  filter: any;
  onUpdateFilter(filter: any): void;
  data?: some;
  loading: boolean;
  onChangeRoleStatus(values: any): void;
  onDeleteRole(id: number): void;
  setLoading(value: boolean): void;
  setChangeData(value: boolean): void;
  changeData: boolean;
}
const ArticleTable: React.FC<Props> = props => {
  const { filter, onUpdateFilter, data, loading, setLoading, setChangeData, changeData } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [caIdList, setCaIdList] = useState<some[]>();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(true);
  const [contentEdit, setContentEdit] = useState();
  const [deletePost, onDeletePost] = useState(false);
  const [deletePostData, setDeletePostData] = useState();
  const [checkBoxList, setCheckBoxList] = useState<number[]>([]);
  const [deleteBulkPost, setDeleteBulkPost] = useState(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showPost, setShowPost] = useState<some>();
  const [switchPreviewArticle, setSwitchPreviewArticle] = useState<boolean>();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory();
  const location = useLocation();

  const fetchCaIdData = React.useCallback(async () => {
    setLoading(true);
    const json = await dispatch(fetchThunk(API_PATHS.getCaIdList, 'get'));
    if (json?.data) {
      setCaIdList(json.data);
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
  }, [closeSnackbar, dispatch, enqueueSnackbar, setLoading]);

  const deleteAdmin = useCallback(
    async (values: any) => {
      setLoading(true);
      const json = await dispatch(fetchThunk(`${API_PATHS.adminPost}?id=${values?.id}`, 'delete'));
      setLoading(false);
      if (json?.code === 200) {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'success',
            }),
          );
        setLoading(false);
        setOpenEdit(true);
        dispatch(push('/'));
        setChangeData(!changeData);
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
    [changeData, closeSnackbar, dispatch, enqueueSnackbar, setChangeData, setLoading],
  );

  const handleBulkPost = useCallback(
    async (action: string) => {
      const params = {
        action,
        ids: checkBoxList,
      };
      const urlActive = `${API_PATHS.bulkPost}`;
      const json = await dispatch(fetchThunk(urlActive, 'put', JSON.stringify(params)));
      if (json?.code === 200) {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'success',
            }),
          );
        setChangeData(!changeData);
        setCheckBoxList([]);
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
    [changeData, checkBoxList, closeSnackbar, dispatch, enqueueSnackbar, setChangeData],
  );

  const actionPostReschedule = useCallback(
    async (dataPost: some) => {
      setLoading(true);
      const json = await dispatch(
        fetchThunk(
          `${API_PATHS?.rescheduleScheduledPost}?id=${dataPost?.id}&at=${dataPost?.publishedAt}&now=true`,
          'put',
        ),
      );
      if (json?.code === 200) {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'success',
            }),
          );
        setLoading(false);
        setChangeData(!changeData);
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
    [changeData, closeSnackbar, dispatch, enqueueSnackbar, setChangeData, setLoading],
  );

  const handleSwitch = useCallback(
    debounce(async (values: any) => {
      let urlActive: string = '';
      if (values.isActive) {
        urlActive = `${API_PATHS.deactivatePost}?id=${values?.id}`;
      } else {
        urlActive = `${API_PATHS.activePost}?id=${values?.id}`;
      }
      const json = await dispatch(fetchThunk(urlActive, 'put'));
      if (json?.code === 200) {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'success',
            }),
          );
        setChangeData(!changeData);
      } else {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
      }
    }, 300),
    [changeData, closeSnackbar, dispatch, enqueueSnackbar, setChangeData],
  );

  const dataConvertMentionUser: some = [];
  const mentionUsers = data?.metadata?.mentionUsers;

  if (mentionUsers) {
    for (const [key, value] of Object.entries(mentionUsers)) {
      dataConvertMentionUser.push({ id: parseInt(key, 10), name: value });
    }
  }

  const columns: Columns[] = React.useMemo(() => {
    return [
      {
        title: '',
        styleHeader: {},
        style: {},
        disableAction: true,
        render: (record: some) => (
          <Checkbox
            color="primary"
            checked={!!checkBoxList.find(element => element === record?.id)}
            onChange={() => {
              if (!checkBoxList.find(element => element === record?.id)) {
                setCheckBoxList([...checkBoxList, record?.id]);
              } else {
                const idx = checkBoxList.findIndex(element => element === record?.id);
                checkBoxList.splice(idx, 1);
                setCheckBoxList([...checkBoxList]);
              }
            }}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        ),
      },
      {
        title: 'POST_ID',
        styleHeader: { textAlign: 'center' },
        style: { textAlign: 'center' },
        render: (record: some) => (
          <Typography variant="subtitle2" style={{ color: PRIMARY }}>
            {record?.id}
          </Typography>
        ),
      },
      {
        title: 'SERVICES',
        render: (record: some) => {
          return (
            <Row style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              {record?.thumbnail ? (
                <img
                  src={record?.thumbnail}
                  alt=""
                  style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                />
              ) : (
                <IconFeedPhoto />
              )}
              <Col style={{ marginLeft: 8, justifyContent: 'flex-start' }}>
                <Typography variant="subtitle2">
                  {SERVICE_TYPE_OPTIONS?.find(s => s?.id === record?.serviceType)?.name}
                </Typography>
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
                  <div
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html:
                        dataConvertMentionUser &&
                        getTagUserPost(record?.content, dataConvertMentionUser),
                    }}
                  />
                </Typography>
              </Col>
            </Row>
          );
        },
      },
      {
        title: 'POST_TYPE',
        styleHeader: { textAlign: 'left' },
        style: { textAlign: 'left', minWidth: 80 },
        render: (record: some) => (
          <Typography variant="body2">
            {POST_TYPE_OPTIONS?.find(element => element?.id === record?.type)?.name}
          </Typography>
        ),
      },
      {
        title: 'MADE_BY',
        styleHeader: { textAlign: 'center' },
        style: { textAlign: 'center', minWidth: 120 },
        render: (record: some) => (
          <>
            <Typography variant="body2" style={{ color: GRAY_DARK }}>
              {record.createdByName}
            </Typography>
            <Typography variant="caption" style={{ color: GRAY }}>
              {record?.createdBy}
            </Typography>
          </>
        ),
      },
      {
        title: 'createdAt',
        styleHeader: { textAlign: 'left' },
        style: { textAlign: 'left', minWidth: 110 },
        render: (record: some) => (
          <Typography
            variant="caption"
            style={{
              color: GRAY,
            }}
          >
            {formatDateTimeHourText(record?.createdAt)}
          </Typography>
        ),
      },
      {
        title: 'CA_ID',
        styleHeader: { textAlign: 'center' },
        style: { textAlign: 'center' },
        render: (record: some) => (
          <Typography
            variant="body2"
            style={{
              color: GRAY,
            }}
          >
            {caIdList?.find(element => element?.id === record?.caId)?.name}
          </Typography>
        ),
      },
      {
        title: 'Click',
        dataIndex: 'numOfClick',
        variant: 'subtitle2',
        styleHeader: { textAlign: 'center' },
        style: { textAlign: 'center' },
      },
      {
        title: 'Comment',
        dataIndex: 'numOfComment',
        variant: 'subtitle2',
        styleHeader: { textAlign: 'center' },
        style: { textAlign: 'center' },
      },
      {
        title: 'Like',
        dataIndex: 'numOfLike',
        variant: 'subtitle2',
        styleHeader: { textAlign: 'center' },
        style: { textAlign: 'center' },
      },
      {
        title: 'status',
        styleHeader: { textAlign: 'center' },
        style: { textAlign: 'center' },
        render: (record: some) => {
          const statusObject = STATUS_OPTIONS.find(item => item.id === record?.status);
          return (
            <>
              <Typography
                variant="caption"
                style={{
                  display: 'inline-block',
                  borderRadius: 4,
                  padding: 4,
                  minWidth: 65,
                  fontWeight: 600,
                  textAlign: 'center',
                  color: statusObject?.color,
                  backgroundColor: statusObject?.background,
                }}
              >
                {statusObject?.name}
              </Typography>
            </>
          );
        },
      },
      {
        title: 'SHOW',
        disableAction: true,
        styleHeader: { textAlign: 'center' },
        style: { textAlign: 'center' },
        render: (record: some) => {
          const numberPublishedAt = moment(record?.publishedAt, DATE_FORMAT_C_DATE_HOUR).valueOf();
          const numberNow = moment(new Date(), DATE_FORMAT_C_DATE_HOUR).valueOf();

          let checkShowTime;
          if (
            (record?.isActive && numberPublishedAt < numberNow) ||
            (record?.status === 'WAITING' && record?.isActive)
          ) {
            checkShowTime = 'SHOW';
          } else if (numberPublishedAt > numberNow && record?.isActive) {
            checkShowTime = 'TIME';
          } else {
            checkShowTime = 'NOTIME';
          }

          let checkSwitch;
          if (
            !record?.isActive ||
            (numberPublishedAt > numberNow && record?.isActive) ||
            (record?.status === 'WAITING' && record?.isActive)
          ) {
            checkSwitch = false;
          } else {
            checkSwitch = true;
          }

          return (
            <>
              {record?.publishedAt &&
              moment().isBefore(moment(record?.publishedAt, DATE_FORMAT_TIMEZONE)) ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 10,
                      justifyContent: 'center',
                    }}
                  >
                    <IOSSwitch
                      checked={checkSwitch}
                      onChange={() => {
                        setShowDialog(true);
                        setShowPost({
                          data: record,
                          statusTime: checkShowTime,
                        });
                      }}
                    />
                    {!checkSwitch ? <IconClock style={{ marginLeft: 6 }} /> : ''}
                  </div>

                  {!checkSwitch ? (
                    <Typography variant="caption">
                      {`${moment(record?.publishedAt, DATE_FORMAT_C_DATE_HOUR).format(
                        DATE_FORMAT_BACK_END,
                      )} -
                    ${moment(record?.publishedAt, DATE_FORMAT_TIMEZONE).format(HOUR_MINUTE)}`}
                    </Typography>
                  ) : (
                    ''
                  )}
                </>
              ) : (
                <IOSSwitch
                  checked={checkSwitch}
                  onChange={() => {
                    setShowDialog(true);
                    setShowPost({ data: record, statusTime: record?.isActive ? 'SHOW' : 'NOTIME' });
                  }}
                />
              )}
            </>
          );
        },
      },
      {
        title: 'action',
        disableAction: true,
        styleHeader: { textAlign: 'center' },
        style: { textAlign: 'center' },
        render: (record: any) => {
          const numberPublishedAt = moment(record?.publishedAt, DATE_FORMAT_C_DATE_HOUR).valueOf();
          const numberNow = moment(new Date(), DATE_FORMAT_C_DATE_HOUR).valueOf();

          const webBaseUrl = getBaseUrlWebApp();
          let webAppFeedUrl = `${webBaseUrl}/partner/feed/${record?.id}`;
          const caName = CA_INFO?.find(element => element?.id === record?.caId)?.name;
          if (caName === 'Dinogo') {
            webAppFeedUrl = `${webBaseUrl}/dinogo/feed/${record?.id}`;
          }
          if (caName === 'Mytour') {
            webAppFeedUrl = `${webBaseUrl}/mytour/feed/${record?.id}`;
          }

          let checkSwitch;
          if (!record?.isActive || (numberPublishedAt > numberNow && record?.isActive)) {
            checkSwitch = false;
          } else {
            checkSwitch = true;
          }
          return (
            <Row style={{ padding: '16px 12px', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                color="primary"
                style={{
                  whiteSpace: 'nowrap',
                  height: 32,
                }}
                onClick={() => {
                  setSwitchPreviewArticle(checkSwitch);
                  setContentEdit(record || '');
                  setOpen(true);
                }}
              >
                <Typography variant="subtitle2" style={{ color: PRIMARY }}>
                  Xem
                </Typography>
              </Button>
              <CopyToClipboard
                text={webAppFeedUrl as string}
                onCopy={(textValue: string, v: boolean) => {
                  if (textValue && v) {
                    enqueueSnackbar(
                      textValue.length > 50 ? `${textValue.slice(0, 50)}...` : textValue,
                      snackbarSetting(key => closeSnackbar(key), { color: 'success' }),
                    );
                  }
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  style={{
                    whiteSpace: 'nowrap',
                    height: 32,
                    marginLeft: 10,
                  }}
                  disableElevation
                >
                  <FormattedMessage id="copy" />
                </Button>
              </CopyToClipboard>
              <Button
                variant="outlined"
                style={{ width: 32, height: 32, marginLeft: 10 }}
                onClick={() => {
                  history.push({
                    pathname: ROUTES.article.update,
                    search: `postId=${record.id}`,
                  });
                }}
              >
                <BorderColorIcon style={{ width: 16, height: 16 }} />
              </Button>
              <Button
                variant="outlined"
                style={{ width: 32, height: 32, marginLeft: 10 }}
                onClick={() => {
                  setDeletePostData(record || '');
                  onDeletePost(true);
                }}
              >
                <DeleteOutlineRoundedIcon style={{ width: 16, height: 16 }} />
              </Button>
            </Row>
          );
        },
      },
    ] as Columns[];
  }, [caIdList, checkBoxList, dataConvertMentionUser, history, closeSnackbar, enqueueSnackbar]);

  useEffect(() => {
    fetchCaIdData();
  }, [fetchCaIdData]);

  const titleTable = () => {
    const checkStatusAction = (queryString.parse(location.search) as unknown) as any;
    if (checkStatusAction?.status) {
      return `Tìm thấy ${data?.totalElements! > 100 ? '99+' : data?.totalElements} ${
        STATUS_TITLE_TABLE?.filter(val => val.id === checkStatusAction?.status)[0].name
      }`;
    }
    return `Tìm thấy ${data?.totalElements} bài viết`;
  };

  return (
    <Col>
      <Filter
        filter={filter}
        loading={loading}
        onUpdateFilter={onUpdateFilter}
        caIdList={caIdList || []}
      />
      <TableCustom
        dataSource={data?.content}
        loading={loading}
        columns={columns}
        onRowClick={() => {}}
        style={{ marginTop: 24 }}
        noColumnIndex
        header={
          <Col>
            <Typography variant="subtitle1" style={{ padding: '16px 0px 0px 16px' }}>
              {titleTable()}
            </Typography>
            <Row
              style={{
                padding: '16px 16px 16px 8px',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box width="50%">
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
                      const tempListId = data?.content.map((element: any) => element?.id);
                      setCheckBoxList(tempListId);
                    }
                  }}
                  inputProps={{ 'aria-label': 'indeterminate checkbox' }}
                />
                <Button
                  disabled={!checkBoxList.length}
                  variant="outlined"
                  color={!queryString.parse(location.search).status ? 'primary' : undefined}
                  onClick={() => {
                    handleBulkPost('APPROVE');
                  }}
                  style={{ marginRight: 16 }}
                  size="small"
                >
                  <ICheck className="svgFillAll" width={20} stroke="#899296" />
                  Duyệt
                </Button>
                <Button
                  disabled={!checkBoxList.length}
                  size="small"
                  variant="outlined"
                  color={
                    queryString.parse(location.search)?.status === 'APPROVED'
                      ? 'primary'
                      : undefined
                  }
                  onClick={() => {
                    handleBulkPost('HIDE');
                  }}
                  style={{ marginRight: 16, minHeight: 26 }}
                >
                  <IHide
                    className="svgFillAll"
                    width={20}
                    stroke="#899296"
                    style={{ marginRight: 4 }}
                  />
                  Ẩn
                </Button>
                <Button
                  disabled={!checkBoxList.length}
                  size="small"
                  variant="outlined"
                  color={
                    queryString.parse(location.search)?.status === 'WAITING' ? 'primary' : undefined
                  }
                  onClick={() => {
                    handleBulkPost('SHOW');
                  }}
                  style={{ marginRight: 16, minHeight: 26 }}
                >
                  <IEyeOpen
                    className="svgFillAll"
                    width={20}
                    stroke="#899296"
                    style={{ marginRight: 4 }}
                  />
                  Hiện
                </Button>
                <Button
                  disabled={!checkBoxList.length}
                  size="small"
                  color={
                    queryString.parse(location.search)?.status === 'DENIED' ? 'primary' : undefined
                  }
                  variant="outlined"
                  onClick={() => {
                    handleBulkPost('BLOCK');
                  }}
                  style={{ marginRight: 16, minHeight: 26 }}
                >
                  <IBlock
                    className="svgFillAll"
                    width={20}
                    stroke="#899296"
                    style={{ marginRight: 4 }}
                  />
                  Chặn
                </Button>
                <Button
                  disabled={!checkBoxList.length}
                  size="small"
                  color={
                    queryString.parse(location.search)?.status === 'DENIED' ? 'primary' : undefined
                  }
                  variant="outlined"
                  onClick={() => {
                    setDeleteBulkPost(true);
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
              </Box>

              <FormControl>
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
                  style={{ fontSize: 14, color: '#3D3F40' }}
                >
                  <option value="createdAt,desc">Ngày tạo mới nhất</option>
                  <option value="createdAt,asc">Ngày tạo cũ nhất</option>
                </NativeSelect>
              </FormControl>
            </Row>
          </Col>
        }
        paginationProps={{
          count: data?.totalElements || 0,
          page: filter.page ? Number(filter.page - 1) : 0,
          rowsPerPage: filter.size ? Number(filter.size) : 10,
          onPageChange: (event: unknown, newPage: number) => {
            onUpdateFilter({
              ...((queryString.parse(location.search) as unknown) as any),
              page: newPage + 1,
            });
          },
          onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => {
            onUpdateFilter({
              ...((queryString.parse(location.search) as unknown) as any),
              size: parseInt(event.target.value, 10),
              page: 1,
            });
          },
        }}
      />
      {contentEdit && (
        <PreviewArticle
          setOpen={value => {
            setOpen(value);
          }}
          switchPreviewArticle={switchPreviewArticle}
          dataMentionUser={dataConvertMentionUser}
          open={open}
          contentEdit={contentEdit}
          handleSwitch={handleSwitch}
          setOpenEdit={setOpenEdit}
          openEdit={openEdit}
          onDeletePost={onDeletePost}
          setDeletePostData={setDeletePostData}
        />
      )}

      <Dialog onClose={setOpenEdit} open={!openEdit}>
        <EditArticle
          loading={loading}
          contentEdit={contentEdit}
          setLoading={setLoading}
          setOpenEdit={setOpenEdit}
          setChangeData={setChangeData}
          changeData={changeData}
        />
      </Dialog>
      <ConfirmDialog
        open={!!deletePost}
        onAccept={() => {
          deletePostData && deleteAdmin(deletePostData);
          onDeletePost(false);
        }}
        titleLabel={
          <Typography variant="body1">Bạn có chắc chắn muốn xóa post này không?</Typography>
        }
        onClose={() => onDeletePost(false)}
        onReject={() => onDeletePost(false)}
      />
      <ConfirmDialog
        open={!!deleteBulkPost}
        onAccept={() => {
          deleteBulkPost && handleBulkPost('DELETE');
          setDeleteBulkPost(false);
        }}
        titleLabel={
          <Typography variant="body1">
            Bạn có chắc chắn muốn xóa tất cả các post này không?
          </Typography>
        }
        onClose={() => setDeleteBulkPost(false)}
        onReject={() => setDeleteBulkPost(false)}
      />
      <ConfirmDialog
        open={showDialog}
        onAccept={() => {
          if (showPost?.data && showPost?.statusTime === 'TIME') {
            actionPostReschedule(showPost?.data);
          } else {
            showPost && handleSwitch(showPost?.data);
          }
          setShowDialog(false);
        }}
        titleLabel={
          <div style={{ textAlign: 'center' }}>
            <Typography variant="subtitle1" style={{ marginBottom: 16 }}>
              {showPost?.statusTime === 'SHOW' ? 'Ẩn bài viết' : 'Hiển thị bài viết'}
            </Typography>

            {showPost?.statusTime === 'SHOW' ? (
              <Typography variant="body1">Bạn có muốn ẩn bài viết ngay không?</Typography>
            ) : (
              <Typography variant="body1">Bạn có muốn hiển thị bài viết này không?</Typography>
            )}

            {showPost?.statusTime === 'TIME' && (
              <>
                <Typography variant="body1">Bài viết đang ở chế độ hẹn giờ hiển thị.</Typography>
                <Typography variant="body1">
                  Bạn có muốn huỷ hẹn giờ và hiển thị bài viết ngay không?
                </Typography>
              </>
            )}
          </div>
        }
        onClose={() => setShowDialog(false)}
        onReject={() => setShowDialog(false)}
      />
    </Col>
  );
};

export default ArticleTable;
