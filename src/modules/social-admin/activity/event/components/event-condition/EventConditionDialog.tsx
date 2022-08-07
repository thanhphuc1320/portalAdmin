import React, { useCallback } from 'react';
import { Grid, Dialog, DialogTitle, IconButton } from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';
import EventConditionForm from './EventConditionForm';

const cssClass = 'eventRewardDialog';
export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  disabledReward: boolean;
}

const EventRewardDialog: React.FC<Props> = props => {
  const { setOpen, open, disabledReward } = props;

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <Dialog maxWidth="lg" open={open} onClose={handleClose} className={`${cssClass}`}>
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
      <Grid container>
        <Grid item xs={12}>
          <EventConditionForm onClose={handleClose} disabledReward={disabledReward} />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default React.memo(EventRewardDialog);
