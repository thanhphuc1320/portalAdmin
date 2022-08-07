import { Button, Checkbox, Typography } from '@material-ui/core';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import DialogCustom from 'modules/common/components/DialogCustom';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import queryString from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { API_PATHS } from 'configs/API';
import { BLACK_400, BLACK_500, GRAY_DARK, PINK } from 'configs/colors';
import { some, isEmpty } from 'configs/utils';
import { ReactComponent as IconFeedPhoto } from 'svg/feed_photo.svg';
import ConfirmDialog from 'modules/common/components/ConfirmDialog';
import { snackbarSetting } from 'modules/common/components/elements';
import { fetchThunk } from 'modules/common/redux/thunk';
import {
  DATE_FORMAT_TIME,
  NOTIFICATION_PAGE,
  NOTIFICATION_SIZE,
  NOTIFICATION_SORT,
  REPLY_COMMENT,
  USER_INTER_ACTON,
  TYPE_OF_INTERACTION_COMMENT,
  TYPE_OF_INTERACTION_RESPOND,
  OPTIONS_ACTIONS,
  ACTIONS,
} from '../constants';
import DialogContentRead from './DialogContentRead';
import './style.scss';

interface DataMessageProps {
  title: string;
  message: string;
  labelButton?: string;
}
interface Props {
  data?: some[];
  hadleFilter: (value: some) => void;
  filter?: some;
  totalElements?: number;
  loading: boolean;
  caIdList?: some[];
  refreshList: () => void;
}
const NotificationsTable: React.FC<Props> = ({
  loading,
  data,
  hadleFilter,
  totalElements,
  filter,
  caIdList,
  refreshList,
}) => {
  const [checkBoxList, setCheckBoxList] = useState<any>([]);
  const [poupAll, setPoupAll] = useState<boolean>(false);
  const [poupSingle, setPoupSingle] = useState<boolean>(false);
  const [poupReads, setPoupReads] = useState<boolean>(false);
  const [alertDeletedComment, setAlertDeletedComment] = useState<boolean>(false);
  const [dialogCustomOpen, setDialogCustomOpen] = useState<boolean>(false);
  const [readList, setReadList] = useState<some[]>();
  const [dataReadID, setDataReadID] = useState<some>();
  const [typeInteraction, setTypeInteraction] = useState<string>();
  const [isPopupInfo, setIsPopupInfo] = useState<boolean>(false);
  const [dataMessage, setDataMessage] = useState<DataMessageProps>();
  const [checkBoxEventList, setCheckBoxEventList] = useState<string[]>([]);
  const [checkBoxPostIdList, setCheckBoxPostIdList] = useState<number[]>([]);
  const location = useLocation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const filterParams = (queryString.parse(location.search) as unknown) as any;
  const paramsQuery = {
    size: filterParams?.size ? filterParams?.size : NOTIFICATION_SIZE,
    page: filterParams?.page ? filterParams?.page : NOTIFICATION_PAGE,
    sort: filterParams?.sort ? filterParams?.sort : NOTIFICATION_SORT,
  };

  const actionDeleteNotifications = useCallback(
    async (id: string) => {
      const json = await dispatch(
        fetchThunk(`${API_PATHS.getNotificationsDelete}?ids=${id}`, 'delete'),
      );

      if (json?.code === 200) {
        refreshList();
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
    [closeSnackbar, dispatch, enqueueSnackbar, refreshList],
  );

  const actionRead = useCallback(
    async (params: string) => {
      const url = `${API_PATHS.updateStatusNotifications}?${params}`;
      const json = await dispatch(fetchThunk(url, 'put'));
      if (json?.code === 200) {
        refreshList();
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
    [closeSnackbar, dispatch, enqueueSnackbar, refreshList],
  );

  const hadelCloseDialog = () => {
    setReadList([]);
    setDialogCustomOpen(false);
    refreshList();
  };

  const resetCheckBox = () => {
    setCheckBoxList([]);
    setCheckBoxEventList([]);
    setCheckBoxPostIdList([]);
  };

  const onReadBulk = useCallback(
    async (ids: string) => {
      const json = await dispatch(fetchThunk(`${API_PATHS.getNotifications}?id=${ids}`));
      if (json?.code === 200) {
        setReadList(json?.data?.content || []);
        const params = queryString.stringify({ ids, status: 'READ' });
        actionRead(params);
        return true;
      }
      json?.message &&
        enqueueSnackbar(
          json?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
      return false;
    },
    [closeSnackbar, dispatch, enqueueSnackbar, actionRead],
  );

  const columns: Columns[] = [
    {
      element: (
        <Checkbox
          checked={checkBoxList.length === data?.length}
          color="primary"
          indeterminate={checkBoxList.length === data?.length ? undefined : !!checkBoxList.length}
          onChange={() => {
            if (checkBoxList.length === data?.length) {
              resetCheckBox();
            } else {
              const tempIdList: number[] = [];
              const tempEventList: string[] = [];
              const tempPostIdList: number[] = [];
              data?.map((element: any, i: number) => {
                tempIdList[i] = element?.id;
                tempEventList[i] = element?.event;
                tempPostIdList[i] = element?.post?.id;
              });
              setCheckBoxList(tempIdList);
              setCheckBoxEventList(tempEventList);
              setCheckBoxPostIdList(tempPostIdList);
            }
          }}
          inputProps={{ 'aria-label': 'indeterminate checkbox' }}
        />
      ),
      styleHeader: { textAlign: 'left' },
      render: (record: some) => {
        return (
          <Checkbox
            color="primary"
            checked={!!checkBoxList.find(element => element === record?.id)}
            onChange={() => {
              if (!checkBoxList.find(element => element === record?.id)) {
                setCheckBoxList([...checkBoxList, record.id]);
                setCheckBoxEventList([...checkBoxEventList, record?.event]);
                setCheckBoxPostIdList([...checkBoxPostIdList, record?.post?.id]);
              }

              const indexCheckBox = checkBoxList.indexOf(record?.id);
              if (indexCheckBox > -1) {
                checkBoxList.splice(indexCheckBox, 1);
                setCheckBoxList([...checkBoxList]);

                checkBoxEventList.splice(indexCheckBox, 1);
                setCheckBoxEventList([...checkBoxEventList]);

                checkBoxPostIdList.splice(indexCheckBox, 1);
                setCheckBoxPostIdList([...checkBoxPostIdList]);
              }
            }}
          />
        );
      },
    },
    {
      title: 'Kênh chia sẻ',
      styleHeader: { textAlign: 'left' },
      render: (record: some) => {
        return (
          <Typography
            style={{ color: GRAY_DARK, fontWeight: record?.status === 'UNREAD' ? 600 : 400 }}
            variant="body2"
          >
            {caIdList?.find(element => element?.id === record?.caId)?.name}
          </Typography>
        );
      },
    },
    {
      title: 'Tài khoản nội bộ',
      styleHeader: { textAlign: 'left' },
      render: (record: some) => {
        return (
          <Typography
            style={{ color: GRAY_DARK, fontWeight: record?.status === 'UNREAD' ? 600 : 400 }}
            variant="body2"
          >
            {record?.receiverName}
          </Typography>
        );
      },
    },
    {
      title: 'User tương tác',
      styleHeader: { textAlign: 'left' },
      render: (record: some) => {
        return (
          <div>
            <Typography
              style={{ color: PINK, fontWeight: record?.status === 'UNREAD' ? 600 : 400 }}
              variant="body2"
            >
              {record?.senderName}
            </Typography>
            <Typography style={{ color: BLACK_400 }} variant="caption">
              {record?.sender}
            </Typography>
          </div>
        );
      },
    },
    {
      title: 'Loại tương tác',
      styleHeader: { textAlign: 'left' },
      render: (record: some) => {
        const textAction = USER_INTER_ACTON?.find(val =>
          val?.id === record?.event ? val?.name : '',
        );

        return (
          <div>
            <Typography
              style={{
                textTransform: 'capitalize',
                fontWeight: record?.status === 'UNREAD' ? 600 : 400,
              }}
              variant="body2"
            >
              {textAction?.name}
            </Typography>
            <Typography style={{ maxWidth: 153, color: BLACK_400 }} variant="caption">
              {`“${record?.content?.slice(0, 50)}...”`}
            </Typography>
          </div>
        );
      },
    },
    {
      title: 'Bài viết',
      styleHeader: { textAlign: 'left' },
      render: (record: some) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {record?.post?.thumbnail ? (
              <>
                <img
                  src={record?.post?.thumbnail}
                  style={{ width: 48, height: 48, borderRadius: 4, objectFit: 'cover' }}
                  alt="avatar"
                />
              </>
            ) : (
              <IconFeedPhoto />
            )}

            <Typography
              style={{ maxWidth: 153, color: BLACK_400, marginLeft: 8 }}
              variant="caption"
            >
              {`${record?.post?.content?.slice(0, 80)}...`}
            </Typography>
          </div>
        );
      },
    },
    {
      title: 'Thời điểm nhận thông báo',
      styleHeader: { textAlign: 'left' },
      render: (record: some) => {
        return (
          <Typography
            style={{ fontWeight: record?.status === 'UNREAD' ? 600 : 400 }}
            variant="body2"
          >
            {moment(record?.createdAt).format(DATE_FORMAT_TIME)}
          </Typography>
        );
      },
    },
    {
      title: 'Phản hồi bình luận',
      styleHeader: { textAlign: 'left' },
      render: (record: some) => {
        const stringReply = REPLY_COMMENT?.find(val => val?.id === record?.reply && val?.name);
        return (
          <Typography
            style={{ fontWeight: record?.status === 'UNREAD' ? 600 : 400 }}
            variant="body2"
          >
            {stringReply?.name}
          </Typography>
        );
      },
    },
    {
      title: 'Thao tác ',
      styleHeader: { textAlign: 'left' },
      render: (record: some) => {
        return (
          <div data-nid={record?.id} data-pid={record?.post?.id} style={{ minWidth: 100 }}>
            <Button
              style={{
                border: '1px solid rgb(204 0 102)',
                padding: 8,
                color: PINK,
                marginRight: 10,
              }}
              variant="outlined"
              onClick={async () => {
                if (record?.commentDeleted && TYPE_OF_INTERACTION_COMMENT.includes(record?.event)) {
                  setTypeInteraction('comment');
                  setAlertDeletedComment(true);
                  return;
                }
                if (record?.postDeleted) {
                  setTypeInteraction('post');
                  setAlertDeletedComment(true);
                  return;
                }
                onReadBulk(record?.id);
                setDialogCustomOpen(true);
              }}
            >
              Đọc
            </Button>
            <Button
              variant="outlined"
              style={{
                border: `1px solid ${BLACK_500}`,
                padding: 8,
                color: BLACK_500,
              }}
              onClick={() => {
                if (record?.commentDeleted && TYPE_OF_INTERACTION_COMMENT.includes(record?.event)) {
                  setTypeInteraction('comment');
                  setAlertDeletedComment(true);
                  return;
                }
                if (record?.postDeleted) {
                  setTypeInteraction('post');
                  setAlertDeletedComment(true);
                  return;
                }
                setDataReadID(record?.id);
                setPoupSingle(true);
              }}
            >
              <DoneAllIcon style={{ fontSize: 16 }} />
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    resetCheckBox();
  }, [filter]);

  const onSelectAction = useCallback(
    async (actionType: string) => {
      if (isEmpty(checkBoxList)) {
        setDataMessage({
          title: 'Thông báo',
          message: 'Bạn chưa chọn thông báo nào!',
          labelButton: 'close',
        });
        setIsPopupInfo(true);
        return;
      }
      if (actionType === ACTIONS.MULTI_UNREAD) {
        setPoupReads(true);
      }
      if (actionType === ACTIONS.MULTI_DELETE) {
        setPoupAll(true);
      }
      if (actionType === ACTIONS.MULTI_RESPOND) {
        onReadBulk(checkBoxList);
        setDialogCustomOpen(true);
      }
    },
    [checkBoxList, onReadBulk, setPoupReads, setPoupAll, setDialogCustomOpen],
  );

  const handleDisabledRespond = () => {
    let keyDisabled: string = '';
    const eventListUnique = [...new Set(checkBoxEventList)];
    const postIdListUnique = [...new Set(checkBoxPostIdList)];
    eventListUnique?.map(e => {
      if (!TYPE_OF_INTERACTION_RESPOND.includes(e)) {
        keyDisabled = ACTIONS.MULTI_RESPOND;
      }
    });
    if (postIdListUnique?.length !== 1) {
      keyDisabled = ACTIONS.MULTI_RESPOND;
    }
    return keyDisabled;
  };

  const keyDisabledRespond = handleDisabledRespond();

  return (
    <>
      <TableCustom
        dataSource={data}
        loading={loading}
        style={{ marginTop: 24, border: 4 }}
        columns={columns}
        noColumnIndex
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography style={{ padding: '20px 16px' }} variant="subtitle1">
              Danh sách thông báo ({totalElements})
            </Typography>
            <FormControlAutoComplete<some>
              placeholder="Thao tác"
              value={null}
              onChange={(e: any, valueItem: some | null) => {
                onSelectAction(valueItem?.id);
              }}
              options={OPTIONS_ACTIONS}
              getOptionLabel={(one: some) => one.name}
              getOptionSelected={(option: some, value: some) => {
                return option?.id === value?.id;
              }}
              getOptionDisabled={(option: some) => {
                return option?.id === keyDisabledRespond;
              }}
              optional
              formControlStyle={{ width: 185, minWidth: 'unset', marginTop: 20, marginRight: 20 }}
            />
          </div>
        }
        paginationProps={{
          count: totalElements || 0,
          page: filter?.page - 1 || 0,
          rowsPerPage: filter?.size || 0,
          onPageChange: (event: unknown, newPage: number) => {
            const pagination = { ...filter, page: newPage + 1 };
            hadleFilter(pagination);
            resetCheckBox();
          },
          onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => {
            hadleFilter({ ...filter, size: event?.target?.value });
            resetCheckBox();
          },
        }}
      />

      <DialogCustom open={dialogCustomOpen} onClose={hadelCloseDialog} footerContent={<></>}>
        <DialogContentRead readList={readList || []} hadelCloseDialog={hadelCloseDialog} />
      </DialogCustom>

      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={poupAll}
        onAccept={() => {
          actionDeleteNotifications(checkBoxList.toString());
          setPoupAll(false);
          resetCheckBox();
        }}
        titleLabel={<Typography variant="body1">Bạn có chắc chắn muốn xóa thông báo</Typography>}
        onClose={() => {
          setPoupAll(false);
        }}
        onReject={() => {
          setPoupAll(false);
        }}
      />

      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={poupReads}
        onAccept={() => {
          const params = {
            ids: checkBoxList?.toString(),
            status: 'UNREAD',
          };
          const queryUrl = queryString.stringify(params);
          actionRead(queryUrl);
          setPoupReads(false);
          resetCheckBox();
          hadleFilter(paramsQuery);
        }}
        titleLabel={<Typography variant="body1">Đánh dấu chưa đọc</Typography>}
        onClose={() => {
          setPoupReads(false);
        }}
        onReject={() => {
          setPoupReads(false);
        }}
      />

      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={poupSingle}
        onAccept={() => {
          const params = {
            ids: dataReadID,
            status: 'UNREAD',
          };
          const queryUrl = queryString.stringify(params);
          actionRead(queryUrl);
          hadleFilter(paramsQuery);
          setPoupSingle(false);
        }}
        titleLabel={<Typography variant="body1">Xác nhận đánh dấu chưa đọc thông báo</Typography>}
        onClose={() => {
          setPoupSingle(false);
        }}
        onReject={() => {
          setPoupSingle(false);
        }}
      />

      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={alertDeletedComment}
        acceptLabel="close"
        onAccept={() => {
          setAlertDeletedComment(false);
        }}
        onClose={() => {
          setAlertDeletedComment(false);
        }}
        titleHead={
          <Typography style={{ marginBottom: 16 }} variant="subtitle1">
            Thông báo
          </Typography>
        }
        titleLabel={
          <>
            {typeInteraction === 'comment' && (
              <Typography variant="body1">
                Bạn không thể thực hiện thao tác này do bình luận đã bị xóa
              </Typography>
            )}
            {typeInteraction === 'post' && (
              <Typography variant="body1">
                Bạn không thể thực hiện thao tác này do bài viết đã bị xóa
              </Typography>
            )}
          </>
        }
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
    </>
  );
};

export default NotificationsTable;
