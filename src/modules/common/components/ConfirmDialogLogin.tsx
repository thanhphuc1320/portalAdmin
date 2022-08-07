import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogProps,
  Divider,
  IconButton,
  Typography,
} from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';
import { FormattedMessage } from 'react-intl';
import { Row } from './elements';
import LoadingButton from './LoadingButton';

interface Props extends DialogProps {
  open: boolean;
  loading?: boolean;
  disabled?: boolean;
  acceptLabel?: string;
  rejectLabel?: string;
  styleCloseBtn?: React.CSSProperties;
  styleHeader?: React.CSSProperties;
  onClose(): void;
  onAccept(): void;
  titleLabel?: React.ReactNode;
  footerLabel?: React.ReactNode;
  onReject?: () => void;
  onExited?: () => void;
  footer?: React.ReactNode;
}

const ConfirmDialogLogin: React.FC<Props> = props => {
  const {
    open,
    styleCloseBtn,
    styleHeader,
    loading,
    onClose,
    onExited,
    onAccept,
    onReject,
    titleLabel,
    // footerLabel,
    acceptLabel,
    rejectLabel,
    children,
    disabled,
    footer,
    ...rest
  } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: { minWidth: 420 },
      }}
      maxWidth="md"
      onExited={onExited}
      {...rest}
    >
      {titleLabel ? (
        <>
          <Row style={styleHeader}>
            <div style={{ flex: 1 }}>{titleLabel}</div>
            <IconButton style={{ padding: '8px', ...styleCloseBtn }} onClick={onClose}>
              <IconClose />
            </IconButton>
          </Row>
          <Divider />
        </>
      ) : (
        <IconButton
          style={{
            position: 'absolute',
            right: 0,
            padding: 8,
            ...styleCloseBtn,
          }}
          onClick={onClose}
        >
          <IconClose />
        </IconButton>
      )}
      {children}

      {footer || (
        <>
          <Divider />
          <DialogActions style={{ padding: 16, justifyContent: 'flex-end' }}>
            <LoadingButton
              loading={loading}
              variant="contained"
              color="secondary"
              size="medium"
              style={{
                minWidth: 150,
                opacity: disabled ? 0.65 : 1,
              }}
              onClick={onAccept}
              disableElevation
              disabled={disabled}
            >
              <Typography variant="body2">
                <FormattedMessage id={acceptLabel || 'IDS_ACCEPT'} />
              </Typography>
            </LoadingButton>
            {onReject && (
              <Button
                variant="outlined"
                size="medium"
                style={{ minWidth: 150, marginLeft: 24 }}
                onClick={onReject}
                disableElevation
              >
                <Typography variant="body2">
                  <FormattedMessage id={rejectLabel || 'IDS_REJECT'} />
                </Typography>
              </Button>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default ConfirmDialogLogin;
