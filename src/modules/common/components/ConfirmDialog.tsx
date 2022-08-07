import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Typography,
} from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';
import { FormattedMessage } from 'react-intl';

interface Props extends DialogProps {
  open: boolean;
  onClose(): void;
  onAccept(): void;
  titleHead?: React.ReactNode;
  titleLabel?: React.ReactNode;
  onReject?: () => void;
  acceptLabel?: string;
  rejectLabel?: string;
  onExited?: () => void;
}

const ConfirmDialog: React.FC<Props> = props => {
  const {
    open,
    onClose,
    onExited,
    onAccept,
    titleLabel,
    titleHead,
    onReject,
    acceptLabel,
    rejectLabel,
    children,
    ...rest
  } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          minWidth: 450,
        },
      }}
      maxWidth="lg"
      onExited={onExited}
      {...rest}
    >
      <DialogTitle style={{ paddingBottom: 0 }}>
        {titleLabel && (
          <div style={{ padding: 8 }}>
            {titleHead}
            {titleLabel}
          </div>
        )}
        <IconButton
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            padding: 0,
          }}
          onClick={onClose}
        >
          <IconClose />
        </IconButton>
      </DialogTitle>
      {children ? <>{children}</> : <DialogContent />}
      <DialogActions style={{ padding: 16, justifyContent: 'center' }}>
        {onReject && (
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            style={{ minWidth: 150, minHeight: 40 }}
            onClick={onReject}
            disableElevation
          >
            <Typography variant="body2" color="primary">
              <FormattedMessage id={rejectLabel || 'reject'} />
            </Typography>
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          size="medium"
          style={{ minWidth: 150, minHeight: 40, marginRight: 12 }}
          onClick={onAccept}
          disableElevation
        >
          <FormattedMessage id={acceptLabel || 'accept'} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
