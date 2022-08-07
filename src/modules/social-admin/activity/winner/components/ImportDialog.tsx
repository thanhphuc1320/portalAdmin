import { Dialog, DialogTitle, IconButton, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { fetchThunk } from 'modules/common/redux/thunk';
import { API_PATHS } from 'configs/API';
import IconClose from '@material-ui/icons/CloseOutlined';
import LoadingButton from 'modules/common/components/LoadingButton';
import { Row, snackbarSetting } from 'modules/common/components/elements';
import UploadFileCSV from 'modules/common/components/UploadFileCSV';
import { GRAY_DARK } from 'configs/colors';
import { isEmpty } from 'configs/utils';

const cssClass = 'winner-import-dialog';

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  setImportSuccess: (value: boolean) => void;
  onClose: () => void;
  linkSample?: string;
}

const ImportDialog: React.FC<Props> = props => {
  const { setOpen, open, onClose, setImportSuccess, linkSample } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [message, setMessage] = useState<string>('');

  const handleImport = useCallback(
    async (url: string) => {
      if (!isEmpty(url)) {
        setOpen(false);
        const dataSave = {
          resourceUrl: url,
          contentType: 'text/csv',
        };

        const formData = JSON.stringify(dataSave);
        const json = await dispatch(
          fetchThunk(`${API_PATHS.putAdminWinnersImport}`, 'put', formData),
        );
        if (json?.code === 200) {
          setImportSuccess(true);
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'success',
            }),
          );
        } else {
          json?.message &&
            enqueueSnackbar(
              json?.message,
              snackbarSetting(key => closeSnackbar(key), {
                color: 'error',
              }),
            );
        }
      }
      setMessage('');
    },
    [closeSnackbar, dispatch, enqueueSnackbar, setImportSuccess, setOpen],
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    setMessage('');
  }, [setOpen, setMessage]);

  return (
    <Dialog maxWidth="xs" open={open} onClose={handleClose} className={`${cssClass}`}>
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

      <Row style={{ margin: 10, justifyContent: 'center' }}>
        <Typography variant="h6" style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Import
        </Typography>
      </Row>
      <Row style={{ justifyContent: 'center' }}>
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          Vui lòng nhập thông tin theo mẫu{' '}
          <a
            href={linkSample || '#'}
            style={{ color: '#276ef1', fontWeight: 'bold', textDecoration: 'none' }}
            download
          >
            Sample.csv
          </a>{' '}
          và tải lên
        </Typography>
      </Row>

      <Row style={{ margin: '20px 20px 0px 20px', justifyContent: 'center' }}>
        <UploadFileCSV setUrl={handleImport} />
      </Row>
      {!isEmpty(message) && (
        <Row style={{ margin: '5px 20px' }}>
          <Typography variant="body2" style={{ color: 'red' }}>
            {message}
          </Typography>
        </Row>
      )}

      <Row style={{ margin: '15px 20px', justifyContent: 'center' }}>
        <LoadingButton
          variant="outlined"
          size="large"
          style={{ minWidth: 185, marginRight: 10 }}
          color="primary"
          disableElevation
          loading={false}
          onClick={onClose}
        >
          Hủy
        </LoadingButton>

        <LoadingButton
          variant="contained"
          size="large"
          style={{ minWidth: 185, marginLeft: 10 }}
          color="primary"
          disableElevation
          loading={false}
          onClick={() => setMessage('Vui lòng chọn file csv')}
        >
          Lưu
        </LoadingButton>
      </Row>
    </Dialog>
  );
};

export default React.memo(ImportDialog);
