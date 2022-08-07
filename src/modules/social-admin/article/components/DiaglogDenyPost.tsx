import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';
import { API_PATHS } from 'configs/API';
import { BLACK_500, RED } from 'configs/colors';
import { useFormikContext } from 'formik';
import { Col, snackbarSetting } from 'modules/common/components/elements';
import { FieldTextContent } from 'modules/common/components/FieldContent';
import LoadingButton from 'modules/common/components/LoadingButton';
import { fetchThunk } from 'modules/common/redux/thunk';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { isEmpty } from 'configs/utils';

interface Props extends DialogProps {
  open: boolean;
  onClose(): void;
  onAccept(): void;
  onReject?: () => void;
  acceptLabel?: string;
  rejectLabel?: string;
  linkPostingRule: string;
  setLinkPostingRule(value: string): void;
}

const DiaglogDenyPost: React.FC<Props> = props => {
  const {
    open,
    onClose,
    onAccept,
    onReject,
    acceptLabel,
    rejectLabel,
    linkPostingRule,
    setLinkPostingRule,
    ...rest
  } = props;

  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { setFieldValue, errors, values } = useFormikContext();

  const [denyReasonList, actionsDenyReasonList] = useState([]);
  const [denyReason, setDenyReason] = useState<string>();

  const getDenyReasons = useCallback(async () => {
    const json = await dispatch(fetchThunk(`${API_PATHS.denyReasons}`, 'get'));
    if (json?.code === 200) {
      actionsDenyReasonList(json.data);
    } else {
      json?.message &&
        enqueueSnackbar(
          json?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
    }
  }, [closeSnackbar, dispatch, enqueueSnackbar]);

  useEffect(() => {
    getDenyReasons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" {...rest}>
      <DialogTitle>
        <Typography
          variant="h6"
          style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'center' }}
        >
          Từ chối duyệt bài viết
        </Typography>
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
      <DialogContent>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            <Typography variant="subtitle1" style={{ color: BLACK_500 }}>
              Bạn vui lòng cho biết lý do từ chối duyệt để thông báo cho người dùng
            </Typography>
          </FormLabel>
          <RadioGroup value={denyReason}>
            {denyReasonList.map((ele: any, idx: number) => (
              <FormControlLabel
                value={`${ele.id}`}
                key={idx}
                control={<Radio />}
                label={
                  <Typography variant="body2" style={{ color: BLACK_500 }}>
                    {ele.reason}
                  </Typography>
                }
                onChange={() => {
                  setDenyReason(`${ele.id}`);
                  setFieldValue('reasonDeny', ele.reason);
                }}
              />
            ))}
            <FormControlLabel
              value="0"
              control={<Radio />}
              label={
                <Typography variant="body2" style={{ color: BLACK_500 }}>
                  Lý do khác
                </Typography>
              }
              onChange={() => {
                setDenyReason('0');
                setFieldValue('reasonDeny', '');
              }}
            />
          </RadioGroup>
        </FormControl>
        {denyReason === '0' && (
          <Col>
            <FieldTextContent
              name="reasonDeny"
              formControlStyle={{ marginRight: 0, maxWidth: 548 }}
              placeholder="Nhập 10 - 255 ký tự"
              inputProps={{
                maxLength: 255,
              }}
              multiline
              rows={6}
              optional
            />
            {(errors as any).reasonDeny && (
              <span style={{ color: RED, marginTop: -12 }}>{(errors as any).reasonDeny}</span>
            )}
          </Col>
        )}
        <Col>
          <FieldTextContent
            name="linkPostingRule"
            label="Chính sách và nội dung đăng bài"
            placeholder="Link: http://docs.google.com"
            value={linkPostingRule}
            onChange={event => {
              setLinkPostingRule(event.target.value);
            }}
            formControlStyle={{ marginRight: 0, maxWidth: 548 }}
            optional
          />
          {(errors as any).linkPostingRule && (
            <span style={{ color: RED, marginTop: -12 }}>{(errors as any).linkPostingRule}</span>
          )}
        </Col>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center', padding: '20px 0px' }}>
        {onReject && (
          <LoadingButton
            variant="outlined"
            size="large"
            color="primary"
            style={{ width: 195 }}
            onClick={onReject}
            disableElevation
          >
            <FormattedMessage id={rejectLabel || 'cancel'} />
          </LoadingButton>
        )}
        <LoadingButton
          disabled={!(values as any).reasonDeny && !(errors as any).reasonDeny}
          variant="contained"
          color="primary"
          size="large"
          style={{ width: 195 }}
          onClick={() => {
            if (isEmpty(errors)) {
              onAccept();
            } else {
              enqueueSnackbar(
                'Bạn phải chọn 1 trong các lý do chặn bài viết và nhập link đầy đủ!',
                snackbarSetting(key => closeSnackbar(key), {
                  color: 'warning',
                }),
              );
            }
          }}
          disableElevation
        >
          <FormattedMessage id={acceptLabel || 'accept'} />
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DiaglogDenyPost;
