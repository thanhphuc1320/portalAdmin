import React, { useState, useEffect, useCallback } from 'react';
import { Typography } from '@material-ui/core';
import LoadingButton from 'modules/common/components/LoadingButton';
import queryString from 'query-string';
import { useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/reducers';
import { some, isEmpty } from 'configs/utils';
import EventRewardTable from './EventRewardTable';
import EventRewardFilter from './EventRewardFilter';
import { Row } from 'modules/common/components/elements';
import { GREY_400 } from 'configs/colors';

const cssClass = 'event-reward-list-filter';

interface Props {
  typeList: some[];
  rewardList: some[];
  loading?: boolean;
  showAddReward?: boolean;
  disabledReward: boolean;
  filter?: any;
  setFilter?(filter: some): void;
  setShowRewardDialog?(value: boolean): void;
}

const EventRewardListFilter: React.FC<Props> = props => {
  const {
    typeList,
    rewardList,
    disabledReward,
    showAddReward,
    filter,
    setFilter,
    setShowRewardDialog,
  } = props;
  const eventRewardListState = useSelector((state: AppState) => state.event?.eventRewardList);
  const history = useHistory();
  const location = useLocation();
  const [eventRewardList, setEventRewardList] = useState<some[]>([]);
  const id = (location as any).query?.id;

  useEffect(() => {
    setEventRewardList(eventRewardListState);
  }, [eventRewardListState]);

  const handleFilter = useCallback(
    (values: some) => {
      let listFilter: some[] = eventRewardListState;
      if (!isEmpty(values?.type)) {
        listFilter = listFilter.filter(item => item.reward?.type === values?.type);
      }
      if (!isEmpty(values?.rewardId)) {
        listFilter = listFilter.filter(item => item.reward?.id === values?.rewardId);
      }
      if (!isEmpty(values?.name)) {
        listFilter = listFilter.filter(item => item.name?.includes(values?.name));
      }

      if (!isEmpty(values?.type) || !isEmpty(values?.rewardId) || !isEmpty(values?.name)) {
        setEventRewardList([...listFilter]);
      } else {
        setEventRewardList(eventRewardListState);
      }
    },
    [eventRewardListState],
  );

  return (
    <div className={cssClass}>
      <div className={`${cssClass}-head`}>
        <div className={`${cssClass}-head-left`}>
          <Typography variant="subtitle2">
            {showAddReward ? 'Giải thưởng' : 'Danh sách giải thưởng'} (
            {eventRewardList?.length || 0})
          </Typography>
        </div>
        <div className={`${cssClass}-head-right`}>
          <div className={`${cssClass}-head-right-box-form`}>
            {!isEmpty(eventRewardListState) && (
              <EventRewardFilter
                eventRewardList={eventRewardList}
                rewardList={rewardList || []}
                typeList={typeList || []}
                disabledReward={disabledReward}
                filter={filter}
                setFilter={(values: some) => {
                  handleFilter({ ...filter, ...values });
                  setFilter && setFilter({ ...filter, ...values });
                }}
              />
            )}
            {!disabledReward && showAddReward && (
              <LoadingButton
                variant="contained"
                size="large"
                style={{ minWidth: 140 }}
                color="primary"
                onClick={() => {
                  history?.replace({ search: queryString.stringify({ id }) });
                  setShowRewardDialog && setShowRewardDialog(true);
                }}
                disableElevation
              >
                Thêm giải thưởng
              </LoadingButton>
            )}
          </div>
        </div>
      </div>
      <div className={`${cssClass}-body`}>
        {!isEmpty(eventRewardListState) && (
          <EventRewardTable
            eventRewardList={eventRewardList}
            typeList={typeList || []}
            disabledReward={disabledReward}
          />
        )}
        {isEmpty(eventRewardListState) && (
          <div className={`${cssClass}-body-empty`}>
            <Row style={{ justifyContent: 'center', marginTop: 50 }}>
              <Typography variant="subtitle1" style={{ color: GREY_400 }}>
                HIỆN CHƯA CÓ GIẢI THƯỞNG
              </Typography>
            </Row>
            <Row style={{ justifyContent: 'center', marginTop: 15 }}>
              <Typography variant="body2" style={{ color: 'red' }}>
                Vui lòng thêm giải thưởng
              </Typography>
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventRewardListFilter;
