import { Button, Typography } from '@material-ui/core';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import moment from 'moment';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';
import { setEventRewardList } from 'modules/social-admin/activity/event/redux/eventReducer';
import ConfirmDialog from 'modules/common/components/ConfirmDialog';
import { Row } from 'modules/common/components/elements';
import { GRAY_DARK } from 'configs/colors';
import { some, isEmpty } from 'configs/utils';
import './style.scss';

interface Props {
  loading: boolean;
  metaConditions: some[];
  conditionsNotTargetReward: some[];
  targetFrequency?: any;
  limitAchievement?: any;
  rewardIndex: number;
  onEditIndex: (e: any, index: number) => void;
  disabledReward?: boolean;
}
const EventConditionTable: React.FC<Props> = props => {
  const {
    loading,
    disabledReward,
    metaConditions,
    conditionsNotTargetReward,
    targetFrequency,
    limitAchievement,
    rewardIndex,
    onEditIndex,
  } = props;
  const { eventRewardList } = useSelector((state: AppState) => state.event);
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);
  const [indexDelete, setIndexDelete] = useState<number>(-1);

  const onDeleteIndex = useCallback(
    (index: number) => {
      if (index > -1) {
        conditionsNotTargetReward?.splice(index, 1);
        let tempEventConditions: some[] = [];
        if (!isEmpty(conditionsNotTargetReward)) {
          tempEventConditions = conditionsNotTargetReward;
        }
        if (!isEmpty(targetFrequency)) {
          tempEventConditions.push(targetFrequency);
        }
        if (!isEmpty(limitAchievement)) {
          tempEventConditions.push(limitAchievement);
        }
        eventRewardList[rewardIndex].eventConditions = tempEventConditions;
        dispatch(setEventRewardList([...eventRewardList]));
      }
    },
    [
      dispatch,
      eventRewardList,
      rewardIndex,
      conditionsNotTargetReward,
      targetFrequency,
      limitAchievement,
    ],
  );

  const columns: Columns[] = [
    {
      title: 'object',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => {
        return (
          <Typography variant="body2" style={{ color: GRAY_DARK }}>
            {record?.targetName}
          </Typography>
        );
      },
    },
    {
      title: 'detail',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => {
        return (
          <Typography variant="body2" style={{ color: GRAY_DARK }}>
            {record?.targetDetailName}
          </Typography>
        );
      },
    },
    {
      title: 'condition',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => {
        const condition = metaConditions?.find(item => item?.id === record?.condition);
        return (
          <Typography variant="body2" style={{ color: GRAY_DARK }}>
            {condition?.name}
          </Typography>
        );
      },
    },
    {
      title: 'quantity',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {record?.value}
        </Typography>
      ),
    },
    {
      title: 'description',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => {
        const condition = metaConditions?.find(item => item?.id === record?.condition);
        return (
          <Typography
            variant="body2"
            style={{
              color: GRAY_DARK,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 290,
            }}
          >
            {record?.conditionDescription || ''} {condition?.name || ''} {record?.value || ''}
          </Typography>
        );
      },
    },
    {
      title: 'createdAt',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {moment(record?.createdAt).format('DD/MM/YYYY - HH:mm')}
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
      render: (record: any, index: number) => {
        const ids: number[] = [];
        ids.push(record?.id);
        return (
          <Row style={{ padding: '16px 12px', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              style={{ width: 32, height: 32, margin: '0px 10px' }}
              onClick={e => onEditIndex && onEditIndex(e, index)}
              disabled={disabledReward}
            >
              <BorderColorIcon style={{ width: 16, height: 16 }} />
            </Button>
            <Button
              variant="outlined"
              style={{ width: 32, height: 32 }}
              onClick={() => {
                setIndexDelete(index);
                setIsConfirmDelete(true);
              }}
              disabled={disabledReward}
            >
              <DeleteOutlineRoundedIcon style={{ width: 16, height: 16, margin: '0px 10px' }} />
            </Button>
          </Row>
        );
      },
    },
  ];

  return (
    <>
      <TableCustom
        dataSource={conditionsNotTargetReward}
        loading={loading}
        columns={columns}
        noColumnIndex
        header={null}
        isHidePagination
        paginationProps={{
          count: conditionsNotTargetReward?.length || 0,
          page: 0,
          rowsPerPage: 10,
          onPageChange: () => {},
          onChangeRowsPerPage: () => {},
        }}
      />
      {/* isConfirmDelete */}
      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={isConfirmDelete}
        acceptLabel="delete"
        rejectLabel="cancel"
        onAccept={() => {
          onDeleteIndex(indexDelete);
          setIsConfirmDelete(false);
        }}
        titleHead={
          <Typography style={{ marginBottom: 16 }} variant="subtitle1">
            Xác nhận xóa
          </Typography>
        }
        titleLabel={<Typography variant="body1">Bạn có chắc muốn xóa điều kiện?</Typography>}
        onClose={() => setIsConfirmDelete(false)}
        onReject={() => setIsConfirmDelete(false)}
      />
    </>
  );
};

export default EventConditionTable;
