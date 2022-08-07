import React, { useCallback } from 'react';
import { Grid, Dialog, DialogTitle, IconButton, Typography } from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';
import queryString from 'query-string';
import { useHistory, useLocation } from 'react-router';
import { some } from 'configs/utils';
import EventRewardForm from './EventRewardForm';
import EventRewardListFilter from './EventRewardListFilter';

const cssClass = 'eventRewardDialog';

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  typeList: some[];
  rewardList: some[];
}

const EventRewardDialog: React.FC<Props> = props => {
  const { setOpen, open, typeList, rewardList } = props;
  const history = useHistory();
  const location = useLocation();
  const id = (location as any).query?.id;

  const handleClose = useCallback(() => {
    history?.replace({ search: queryString.stringify({ id }) });
    setOpen(false);
  }, [id, history, setOpen]);

  return (
    <Dialog fullWidth maxWidth={false} open={open} onClose={handleClose} className={`${cssClass}`}>
      <DialogTitle style={{ paddingBottom: 0 }}>
        <IconButton
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            padding: 0,
          }}
          onClick={handleClose}
        >
          <IconClose />
        </IconButton>
      </DialogTitle>
      <Grid container className={`${cssClass}-container`}>
        <Grid item xs={3} className={`${cssClass}-left`}>
          <Typography
            variant="h6"
            style={{ marginBottom: 15, fontWeight: 'bold', textAlign: 'center' }}
          >
            Thêm giải thưởng
          </Typography>
          <EventRewardForm onClose={handleClose} />
        </Grid>
        <Grid item xs={9} className={`${cssClass}-right`}>
          <EventRewardListFilter
            typeList={typeList || []}
            rewardList={rewardList || []}
            disabledReward={false}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default React.memo(EventRewardDialog);
