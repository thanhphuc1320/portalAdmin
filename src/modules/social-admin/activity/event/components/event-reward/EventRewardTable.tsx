import React, { useState, useCallback } from 'react';
import { Button, Checkbox, Avatar, Typography } from '@material-ui/core';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import queryString from 'query-string';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { setEventRewardList } from 'modules/social-admin/activity/event/redux/eventReducer';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';
import { Row } from 'modules/common/components/elements';
import EventRewardUpdateDialog from './EventRewardUpdateDialog';
import ConfirmDialog from 'modules/common/components/ConfirmDialog';
import { GRAY_DARK, GREEN, BLUE } from 'configs/colors';
import { some } from 'configs/utils';
import { UNLIMITED_CHARACTERS, UNLIMITED_NUMBER } from '../../constants';

interface Props {
  eventRewardList: some[];
  typeList: some[];
  loading?: boolean;
  filter?: any;
  onUpdateFilter?(filter: some): void;
  isModal?: boolean;
  disabledReward: boolean;
}
const EventRewardTable: React.FC<Props> = props => {
  const {
    eventRewardList,
    typeList,
    loading,
    isModal,
    filter,
    onUpdateFilter,
    disabledReward,
  } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const eventRewardListState = useSelector((state: AppState) => state.event?.eventRewardList);
  const location = useLocation();
  const [eventRewardItem, setEventRewardItem] = useState<any>();
  const [checkBoxList, setCheckBoxList] = useState<number[]>([]);
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const [isConfirmDefault, setIsConfirmDefault] = useState<boolean>(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);
  const [uuidSelected, setUuidSelected] = useState<string>();

  const onDeleteBulk = useCallback(
    (uuidDel: string | undefined) => {
      if (uuidDel) {
        const eventRewardListNew = eventRewardList?.filter(eRN => eRN.createdAt !== uuidDel);
        dispatch(setEventRewardList([...eventRewardListNew]));
      }
      setUuidSelected(undefined);
    },
    [dispatch, eventRewardList],
  );

  const onChangeStatusDefault = useCallback(
    (uuidChange: string | undefined) => {
      if (uuidChange) {
        const eventRewardsNew: some[] = [];
        eventRewardListState?.map((item: any, indexState: number) => {
          eventRewardsNew[indexState] = item;
          eventRewardsNew[indexState].isDefault = false;
          if (item?.createdAt === uuidChange) {
            eventRewardsNew[indexState].isDefault = true;
          }
        });
        dispatch(setEventRewardList([...eventRewardsNew]));
      }
      setUuidSelected(undefined);
    },
    [dispatch, eventRewardListState],
  );

  const onShowFormUpdate = useCallback(
    (createdId: string) => {
      if (createdId) {
        const eventRewardByuuId = eventRewardList?.find(eR => eR.createdAt === createdId);
        setEventRewardItem(eventRewardByuuId);
        setShowRewardDialog(true);
      }
    },
    [eventRewardList],
  );

  const columns: Columns[] = [
    {
      element: (
        <Checkbox
          checked={checkBoxList?.length > 0 && checkBoxList.length === eventRewardList?.length}
          color="primary"
          indeterminate={
            checkBoxList.length === eventRewardList?.length ? undefined : !!checkBoxList.length
          }
          onChange={() => {
            if (checkBoxList.length === eventRewardList?.length) {
              setCheckBoxList([]);
            } else {
              const tempListId = eventRewardList?.map((element: any) => element?.createdAt);
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
            checked={!!checkBoxList.find(element => element === record?.createdAt)}
            onChange={() => {
              if (!checkBoxList.find(element => element === record?.createdAt)) {
                setCheckBoxList([...checkBoxList, record.createdAt]);
              } else {
              }
              const indexCheckBox = checkBoxList.indexOf(record?.createdAt);
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
      title: 'prizeType',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography
          variant="body2"
          className="limit-text-2"
          style={{ color: GRAY_DARK, maxWidth: 150 }}
        >
          {record?.name}
        </Typography>
      ),
    },
    {
      title: 'rewardCode',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {record?.reward?.code}
        </Typography>
      ),
    },
    {
      title: 'rewardName',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {record?.reward?.name}
        </Typography>
      ),
    },
    {
      title: 'type',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {typeList?.find(element => element?.id === record?.reward?.type)?.name}
        </Typography>
      ),
    },
    {
      title: 'image',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) =>
        record.imageUrl && (
          <Avatar
            variant="square"
            src={record?.imageUrl}
            style={{ width: 32, height: 32, margin: 'auto' }}
          />
        ),
    },
    {
      title: 'quantity',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {record?.quantity === UNLIMITED_NUMBER ? UNLIMITED_CHARACTERS : record?.quantity}
        </Typography>
      ),
    },
    {
      title: 'link',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography
          variant="body2"
          className="limit-text-2"
          style={{ color: GRAY_DARK, maxWidth: 150 }}
        >
          {record?.link}
        </Typography>
      ),
    },
    {
      title: 'displayName',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography
          variant="body2"
          className="limit-text-2"
          style={{ color: GRAY_DARK, maxWidth: 150 }}
        >
          {record?.displayName}
        </Typography>
      ),
    },
    {
      title: 'status',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: any) => {
        if (record?.isDefault) {
          return (
            <Typography variant="body2" style={{ color: GREEN }}>
              Mặc định
            </Typography>
          );
        }
        return (
          <Button
            onClick={() => {
              setUuidSelected(record?.createdAt);
              setIsConfirmDefault(true);
            }}
            disabled={disabledReward}
          >
            <Typography variant="body2" style={{ color: BLUE }}>
              Đặt làm mặc định
            </Typography>
          </Button>
        );
      },
    },
    {
      title: 'action',
      disableAction: true,
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: any) => {
        return (
          <Row style={{ padding: '16px 12px', justifyContent: 'center' }}>
            {!isModal && (
              <Button
                variant="outlined"
                style={{ width: 32, height: 32, margin: '0px 10px' }}
                onClick={() => onShowFormUpdate(record?.createdAt)}
                disabled={disabledReward}
              >
                <BorderColorIcon style={{ width: 16, height: 16 }} />
              </Button>
            )}

            <Button
              variant="outlined"
              style={{ width: 32, height: 32 }}
              onClick={() => {
                setUuidSelected(record?.createdAt);
                setIsConfirmDelete(true);
              }}
              disabled={disabledReward}
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
        dataSource={eventRewardList}
        loading={loading}
        style={{ marginTop: 24, border: 4 }}
        columns={columns}
        noColumnIndex
        header={null}
        isHidePagination
        paginationProps={{
          count: eventRewardList?.length || 0,
          page: filter?.page ? Number(filter.page) : 0,
          rowsPerPage: filter?.size ? Number(filter.size) : 10,
          onPageChange: (event: unknown, newPage: number) => {
            onUpdateFilter &&
              onUpdateFilter({
                ...((queryString.parse(location.search) as unknown) as any),
                page: newPage,
              });
            setCheckBoxList([]);
          },
          onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => {
            onUpdateFilter &&
              onUpdateFilter({
                ...((queryString.parse(location.search) as unknown) as any),
                size: parseInt(event.target.value, 10),
                page: 1,
              });
            setCheckBoxList([]);
          },
        }}
      />

      <EventRewardUpdateDialog
        open={showRewardDialog}
        setOpen={setShowRewardDialog}
        eventRewardItem={eventRewardItem}
      />

      {/* isConfirmDefault */}
      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={isConfirmDefault}
        acceptLabel="confirm"
        rejectLabel="cancel"
        onAccept={() => {
          onChangeStatusDefault(uuidSelected);
          setIsConfirmDefault(false);
        }}
        titleHead={
          <Typography style={{ marginBottom: 16 }} variant="subtitle1">
            Xác nhận thay đổi giải thưởng mặc định
          </Typography>
        }
        titleLabel={<Typography variant="body1">Bạn có chắc muốn thay đổi trạng thái?</Typography>}
        onClose={() => setIsConfirmDefault(false)}
        onReject={() => setIsConfirmDefault(false)}
      />

      {/* isConfirmDelete */}
      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={isConfirmDelete}
        acceptLabel="delete"
        rejectLabel="cancel"
        onAccept={() => {
          onDeleteBulk(uuidSelected);
          setIsConfirmDelete(false);
        }}
        titleHead={
          <Typography style={{ marginBottom: 16 }} variant="subtitle1">
            Xác nhận xóa
          </Typography>
        }
        titleLabel={<Typography variant="body1">Bạn có chắc muốn giải thưởng?</Typography>}
        onClose={() => setIsConfirmDelete(false)}
        onReject={() => setIsConfirmDelete(false)}
      />
    </>
  );
};

export default EventRewardTable;
