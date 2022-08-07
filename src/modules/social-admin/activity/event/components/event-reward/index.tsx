import React from 'react';
import { Paper } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/reducers';
import { some } from 'configs/utils';
import EventRewardListFilter from './EventRewardListFilter';
import EventRewardCreateDialog from './EventRewardCreateDialog';
import './style.scss';

const cssClass = 'event-reward-paper';

interface Props {
  caIds?: number[];
  typeList?: some[];
  rewardList?: some[];
  disabledReward: boolean;
  filter?: any;
  setFilter?(filter: some): void;
}

const EventReward: React.FC<Props> = props => {
  const { typeList, rewardList, disabledReward, filter, setFilter } = props;
  const eventRewardList = useSelector((state: AppState) => state.event?.eventRewardList);
  const [showRewardDialog, setShowRewardDialog] = React.useState(false);

  const rewardListFilter = rewardList?.filter(item =>
    eventRewardList?.find(e => e?.reward?.id === item?.id),
  );

  return (
    <Paper className={`${cssClass}`}>
      <EventRewardListFilter
        typeList={typeList || []}
        rewardList={rewardListFilter || []}
        disabledReward={disabledReward}
        showAddReward
        setShowRewardDialog={setShowRewardDialog}
        filter={filter}
        setFilter={setFilter}
      />
      <EventRewardCreateDialog
        typeList={typeList || []}
        rewardList={rewardListFilter || []}
        open={showRewardDialog}
        setOpen={setShowRewardDialog}
      />
    </Paper>
  );
};
export default React.memo(EventReward);
