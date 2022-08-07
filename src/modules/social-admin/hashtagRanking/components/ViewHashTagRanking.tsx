import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  withStyles,
} from '@material-ui/core';
import { ROUTES } from 'configs/routes';
import { DATE_FORMAT_SHOW } from 'models/moment';
import LoadingButton from 'modules/common/components/LoadingButton';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { API_PATHS } from '../../../../configs/API';
import { BLACK, GRAY, GREY_100, PINK, RED_400, WHITE } from '../../../../configs/colors';
import { some } from '../../../../constants';
import { AppState } from '../../../../redux/reducers';
import { Col, Row, snackbarSetting } from '../../../common/components/elements';
import LoadingIcon from '../../../common/components/LoadingIcon';
import { fetchThunk } from '../../../common/redux/thunk';
import { statusOption1, statusOption2 } from '../../constants';

const StyledTableCell = withStyles(() =>
  createStyles({
    head: {
      backgroundColor: GREY_100,
      whiteSpace: 'nowrap',
    },
    body: {
      fontSize: 14,
    },
    root: {
      borderBottom: 'none',
      fontSize: 13,
      color: GRAY,
    },
  }),
)(TableCell);

const StyledTableRow = withStyles(() =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: WHITE,
      },
    },
  }),
)(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

interface Props {}
const ViewHashTagRanking: React.FC<Props> = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [loading, setLoading] = React.useState(false);
  const [caIdList, setCaIdList] = useState<some[]>([]);
  const [dataHashTag, setDataHashTag] = useState({
    name: '',
    caId: 0,
    createdAt: '',
    id: null,
    status: '',
    createdByName: '',
    startDate: '',
    endDate: '',
    createdBy: 0,
  });
  const [dataRows, setDataRows] = useState<some[]>([
    { name: '', status: '', id: null, serviceType: '', source: '' },
  ]);

  const classes = useStyles();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const location = useLocation();
  const history = useHistory();
  const idUpdate = Number((location as any).query?.id) || undefined;

  const fetchHashTagRanking = useCallback(async () => {
    setLoading(true);
    const json = await dispatch(fetchThunk(`${API_PATHS.getHashTagRanking}?id=${idUpdate}`, 'get'));
    if (json?.data) {
      setDataHashTag(json.data?.content[0]);
      const tempDataRows = json.data?.content[0]?.items?.map(element => {
        return { ...element.hashTag, serviceType: element.serviceType };
      });
      setDataRows(tempDataRows);
    } else {
      json?.message &&
        enqueueSnackbar(
          json?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
    }
    setLoading(false);
  }, [closeSnackbar, dispatch, enqueueSnackbar, idUpdate]);

  const fetchCaIdData = useCallback(async () => {
    setLoading(true);
    const json = await dispatch(fetchThunk(API_PATHS.getCaIdList, 'get'));
    if (json?.data) {
      setCaIdList(json.data);
    } else {
      json?.message &&
        enqueueSnackbar(
          json?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
    }
    setLoading(false);
  }, [closeSnackbar, dispatch, enqueueSnackbar, setLoading]);

  const actionCopyHashTag = useCallback(async () => {
    const json = await dispatch(fetchThunk(`${API_PATHS.copyHashTags}?id=${idUpdate}`, 'post'));
    if (json?.code === 200) {
      history.push('/hashtag-ranking');
      json?.message &&
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
  }, [closeSnackbar, dispatch, enqueueSnackbar, history, idUpdate]);

  useEffect(() => {
    fetchCaIdData();
    fetchHashTagRanking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <LoadingIcon style={{ minHeight: 320, margin: '0px auto 0px auto' }} />;
  }
  return (
    <>
      <Paper
        style={{
          padding: 16,
          maxWidth: 1112,
          background: 'transparent',
          boxShadow: 'none',
          margin: '0px auto 0px auto',
        }}
      >
        <Row
          style={{
            flexWrap: 'wrap',
            boxShadow: ' 0px 1px 6px rgba(0, 0, 0, 0.15)',
            marginBottom: 22,
            borderRadius: 4,
            padding: 19,
            width: '100%',
            boxSizing: 'border-box',
            backgroundColor: WHITE,
          }}
        >
          <Col style={{ minWidth: 170, marginRight: 38 }}>
            <Typography variant="body2" style={{ marginBottom: 12, color: GRAY }}>
              Khoảng thời gian áp dụng
            </Typography>
            <Typography variant="subtitle2" style={{}}>
              {dataHashTag?.startDate.replaceAll('-', '/')} -{' '}
              {dataHashTag?.endDate.replaceAll('-', '/')}
            </Typography>
            {/* <Typography variant="subtitle2" style={{}}>
              {caIdList.find(element => element?.id === dataHashTag?.caId)?.name}
            </Typography> */}
          </Col>
          <Col style={{ minWidth: 170 }}>
            <Typography variant="body2" style={{ marginBottom: 12, color: GRAY }}>
              Tài khoản tạo bảng
            </Typography>
            <Typography variant="subtitle2" style={{}}>
              {dataHashTag?.createdByName}
            </Typography>
          </Col>
          <Col style={{ minWidth: 100 }}>
            <Typography variant="body2" style={{ marginBottom: 12, color: GRAY }}>
              User ID
            </Typography>
            <Typography variant="subtitle2" style={{}}>
              {dataHashTag?.createdBy}
            </Typography>
          </Col>
          <Col style={{ minWidth: 170 }}>
            <Typography variant="body2" style={{ marginBottom: 12, color: GRAY }}>
              Thời điểm tạo bảng
            </Typography>
            <Typography variant="subtitle2" style={{}}>
              {moment(dataHashTag?.createdAt)?.format(DATE_FORMAT_SHOW)}
            </Typography>
          </Col>

          <Col style={{ minWidth: 170 }}>
            <Typography variant="body2" style={{ marginBottom: 12, color: GRAY }}>
              Kênh bán áp dụng
            </Typography>
            <Typography variant="subtitle2" style={{}}>
              {caIdList.find(element => element?.id === dataHashTag?.caId)?.name}
            </Typography>
          </Col>
          <Col style={{ minWidth: 170 }}>
            <Typography variant="body2" style={{ marginBottom: 12, color: GRAY }}>
              Trạng thái
            </Typography>
            <Typography variant="subtitle2" style={{ color: RED_400 }}>
              {statusOption2.find(element => element?.id === dataHashTag?.status)?.name}
            </Typography>
          </Col>
        </Row>

        <TableContainer
          component={Paper}
          style={{
            padding: 19,
            width: 'auto',
            boxShadow: ' 0px 1px 6px rgba(0, 0, 0, 0.15)',
            borderRadius: 4,
          }}
        >
          <Row>
            <Typography variant="subtitle1">{dataHashTag?.name}</Typography>
          </Row>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Vị trí</StyledTableCell>
                <StyledTableCell align="left">Hashtag</StyledTableCell>
                <StyledTableCell align="left">Trạng thái</StyledTableCell>
                <StyledTableCell align="left">Hashtag ID</StyledTableCell>
                <StyledTableCell align="left">Lượt tìm kiếm</StyledTableCell>
                <StyledTableCell align="left">Nguồn gốc</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataRows.map((row: any, index: number) => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell align="left" style={{ color: BLACK }}>
                    <Typography style={{ fontWeight: 700, color: PINK }} variant="body2">
                      {index + 1}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="left" style={{ color: BLACK }}>
                    <Typography variant="body2">{row.name}</Typography>
                  </StyledTableCell>
                  <StyledTableCell align="left" style={{ color: BLACK }}>
                    <Typography variant="body2">
                      {statusOption1.find(element => element?.id === row.status)?.name}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="left" style={{ color: BLACK }}>
                    <Typography variant="body2">{row.id}</Typography>
                  </StyledTableCell>
                  <StyledTableCell align="left" style={{ color: BLACK }}>
                    {row.numOfViews}
                  </StyledTableCell>
                  <StyledTableCell align="left" style={{ color: BLACK }}>
                    <Typography variant="body2">{row.source}</Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Row style={{ marginTop: 24, justifyContent: 'space-between' }}>
          <Grid>
            <Button
              variant="outlined"
              style={{
                minWidth: 80,
                minHeight: 40,
                marginRight: 20,
                backgroundColor: 'transparent',
              }}
              onClick={() => {
                history.goBack();
              }}
            >
              <Typography variant="button" style={{ color: BLACK, fontWeight: 500 }}>
                Trở về
              </Typography>
            </Button>
          </Grid>
          <Grid>
            <LoadingButton
              variant="contained"
              size="large"
              style={{
                minWidth: 140,
                marginRight: 20,
                backgroundColor: 'transparent',
                color: PINK,
                border: '1px solid',
                fontWeight: 500,
              }}
              color="secondary"
              disableElevation
              loading={false}
              onClick={() => {
                actionCopyHashTag();
              }}
            >
              Nhân bản
            </LoadingButton>
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              style={{ minWidth: 140, fontWeight: 500 }}
              color="primary"
              disableElevation
              loading={false}
              onClick={() => {
                history.push({ pathname: ROUTES.hashtagRanking.update, search: `?id=${idUpdate}` });
              }}
            >
              Chỉnh sửa
            </LoadingButton>
          </Grid>
        </Row>
      </Paper>
    </>
  );
};
export default React.memo(ViewHashTagRanking);
