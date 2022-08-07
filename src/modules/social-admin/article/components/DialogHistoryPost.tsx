import {
  Button,
  Dialog,
  DialogActions,
  DialogProps,
  DialogTitle,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';
import { API_PATHS } from 'configs/API';
import { DATE_FORMAT_SHOW } from 'models/moment';
import { snackbarSetting } from 'modules/common/components/elements';
import { fetchThunk } from 'modules/common/redux/thunk';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import queryString from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';

interface Props extends DialogProps {
  open: boolean;
  onClose(): void;
}
interface Column {
  id: 'userName' | 'time' | 'timeFormat';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'userName', label: 'Tài khoản', minWidth: 170 },
  { id: 'timeFormat', label: 'Thời gian', minWidth: 100 },
];

const DialogHistoryPost: React.FC<Props> = props => {
  const { open, onClose, ...rest } = props;
  const [historyData, onHistoryData] = useState([]);

  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const location = useLocation();
  const { query } = location as any;

  const getHistory = useCallback(async () => {
    const searchStr = queryString.stringify({
      id: query?.postId,
    });
    const json = await dispatch(fetchThunk(`${API_PATHS.historyApprove}?${searchStr}`, 'get'));
    if (json?.code === 200) {
      const tempContent = json.data.content.map(ele => {
        return {
          ...ele,
          timeFormat: moment(ele.time).format(DATE_FORMAT_SHOW),
        };
      });
      onHistoryData(tempContent);
    } else {
      json?.message &&
        enqueueSnackbar(
          json?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
    }
  }, [closeSnackbar, dispatch, enqueueSnackbar, query]);

  useEffect(() => {
    getHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {...rest}
    >
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>
            Lịch sử chỉnh sửa
          </Typography>
        </div>
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
      <Divider />
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {historyData.map((row: any, index: number) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  {columns.map(column => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <DialogActions style={{ paddingRight: 16, justifyContent: 'flex-end', paddingTop: 12 }}>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          style={{ minWidth: 108, marginRight: 12 }}
          onClick={onClose}
          disableElevation
        >
          <FormattedMessage id="close" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogHistoryPost;
