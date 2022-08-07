import React, { useCallback } from 'react';
import { Grid, Dialog, DialogTitle, IconButton, Typography } from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';
import EventRewardForm from './EventRewardForm';

const cssClass = 'eventRewardDialog';

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  eventRewardItem: any;
}

const EventRewardUpdateDialog: React.FC<Props> = props => {
  const { setOpen, open, eventRewardItem } = props;

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <Dialog maxWidth="sm" open={open} onClose={handleClose} className={`${cssClass}`}>
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
        <Grid item xs={12} className={`EventRewardUpdateDialog ${cssClass}-left`}>
          <Typography
            variant="h6"
            style={{ marginTop: -10, marginBottom: 10, fontWeight: 'bold', textAlign: 'center' }}
          >
            Chỉnh sửa
          </Typography>
          <EventRewardForm isUpdate eventRewardItem={eventRewardItem} onClose={handleClose} />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default React.memo(EventRewardUpdateDialog);
