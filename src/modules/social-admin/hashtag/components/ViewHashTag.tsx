import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { ROUTES } from 'configs/routes';
import { Form, Formik } from 'formik';
import { DATE_FORMAT_SHOW } from 'models/moment';
import ConfirmDialog from 'modules/common/components/ConfirmDialog';
import LoadingButton from 'modules/common/components/LoadingButton';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
// import { useHistory, useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as yup from 'yup';
import { API_PATHS } from '../../../../configs/API';
import { BLACK_200, BLACK_400, BLACK_500, GRAY, PINK, RED } from '../../../../configs/colors';
import { some } from '../../../../constants';
import { AppState } from '../../../../redux/reducers';
import { ReactComponent as IconDeleteRed } from '../../../../svg/icon_delete_red.svg';
import { ReactComponent as IconInputHashtag } from '../../../../svg/icon_input_hashtag.svg';
import { Col, Row, snackbarSetting } from '../../../common/components/elements';
import { FieldSelectContent, FieldTextContent } from '../../../common/components/FieldContent';
import LoadingIcon from '../../../common/components/LoadingIcon';
import { fetchThunk } from '../../../common/redux/thunk';
import { statusOption1 } from '../../constants';

interface DataHashTagProps {
  name: string;
  status: string;
  id?: number;
  createdByName?: string;
  createdAt?: string;
  numOfUsers?: number;
  createdBy?: string;
  source?: string;
  numOfPosts?: number;
  caId?: number;
}
interface Props {}

const useStyles = makeStyles({
  root: {
    maxWidth: 480,
    margin: 'auto',
    width: '100%',
    borderRadius: 4,
    '& .MuiFormHelperText-root.Mui-error': {
      padding: '6px 10px 18px 6px',
    },
  },
  wrapperHashTag: {
    boxShadow: ' 0px 1px 6px rgba(0, 0, 0, 0.15)',
    width: '100%',
    padding: 24,
  },
  button: {
    width: '50%',
    background: PINK,
    borderRadius: 3,
    border: '1px solid rgb(204 0 102)',
    margin: '0px 5px',
    padding: '12px 8px',
  },
  borderNone: {
    border: 'none',
    '& .MuiIconButton-label': {
      display: 'none',
    },
  },
});

const ViewHashTag: React.FC<Props> = () => {
  const classHashTag = useStyles();
  const location = useLocation();

  const idHashTag = Number((location as any).query?.id) || undefined;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [caIdList, setCaIdList] = useState<some[]>([]);
  const [dataHashTag, setDataHashTag] = useState<DataHashTagProps>({ name: '', status: 'ACTIVE' });
  const [deleteHashTags, onDeleteHashTags] = useState(false);
  const [checkView, setCheckView] = useState(location.pathname === ROUTES.hashtag.view);

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

  const getHashTag = useCallback(async () => {
    setLoading(true);
    const tempId = Number((location as any).query?.id) || undefined;
    const json = await dispatch(fetchThunk(`${API_PATHS.getHashTagsList}?id=${tempId}`, 'get'));
    if (json?.code === 200) {
      setDataHashTag(json?.data?.content[0]);
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
  }, [closeSnackbar, dispatch, enqueueSnackbar, location]);

  const actionEditHashTags = useCallback(
    async value => {
      const params = {
        name: value.name,
        status: value.status,
      };
      setLoading(true);
      const json = await dispatch(
        fetchThunk(`${API_PATHS.getHashTagsList}?id=${idHashTag}`, 'put', JSON.stringify(params)),
      );

      if (json?.code === 200) {
        getHashTag();
        history.push({ pathname: ROUTES.hashtag.result });
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
      setLoading(false);
    },
    [closeSnackbar, dispatch, enqueueSnackbar, getHashTag, history, idHashTag],
  );

  const actionDeleteHashTags = useCallback(
    async (values: any) => {
      setLoading(true);
      const json = await dispatch(
        fetchThunk(`${API_PATHS.getHashTagsList}?id=${values?.id}`, 'delete'),
      );
      if (json?.code === 200) {
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
      setLoading(false);
    },
    [closeSnackbar, dispatch, enqueueSnackbar, setLoading],
  );

  useEffect(() => {
    fetchCaIdData();
    if (idHashTag) getHashTag();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <LoadingIcon style={{ minHeight: 320 }} />;
  }

  const storeSchema = yup.object().shape({
    name: yup
      .string()
      .min(3)
      .max(30)
      .required('Nội dung hashtag từ 3-30 ký tự chữ và số liền nhau')
      .trim(),
    caId: yup.string().required('Vui lòng chọn kênh bán'),
  });

  return (
    <div className={classHashTag.root}>
      <Card className={classHashTag.wrapperHashTag}>
        <Typography
          variant="h6"
          style={{ color: BLACK_500, fontWeight: 'bold', textAlign: 'center' }}
        >
          {checkView ? (
            <FormattedMessage id="detail.viewTitle" />
          ) : (
            <FormattedMessage id="detail.updateTitle" />
          )}
        </Typography>
        <Formik
          initialValues={{ ...dataHashTag }}
          enableReinitialize
          onSubmit={async values => {
            if (checkView) {
              setCheckView(false);
            } else {
              actionEditHashTags(values);
            }
          }}
          validationSchema={storeSchema}
        >
          {({ values, resetForm, setFieldValue, errors }) => {
            return (
              <Form>
                <Col style={{}}>
                  <FieldTextContent
                    name="name"
                    formControlStyle={{
                      marginRight: 0,
                    }}
                    label={
                      <Typography variant="caption" style={{ color: GRAY, fontWeight: 'bold' }}>
                        Hashtag
                      </Typography>
                    }
                    classes={{
                      root: checkView ? classHashTag.borderNone : '',
                    }}
                    disabled={checkView}
                    placeholder="Nhập hashtag"
                    inputProps={{
                      maxLength: 30,
                    }}
                    style={{}}
                    focused={false}
                    startAdornment={<IconInputHashtag style={{ padding: '0px 0px 0px 11px' }} />}
                    errorMessage={errors.name ? errors.name : undefined}
                  />

                  <FieldSelectContent
                    name="caId"
                    disabled
                    classes={{
                      root: checkView ? classHashTag.borderNone : '',
                    }}
                    label={
                      <Typography variant="caption" style={{ color: GRAY, fontWeight: 'bold' }}>
                        Kênh bán
                      </Typography>
                    }
                    style={{ marginBottom: 10 }}
                    formControlStyle={{
                      marginRight: 0,
                      width: 210,
                    }}
                    placeholder="Chọn kênh bán"
                    options={caIdList}
                    getOptionLabel={value => value.name}
                    onSelectOption={(value: some) => {
                      setFieldValue('caId', value);
                    }}
                  />
                  <FormControl component="fieldset">
                    <Typography variant="caption" style={{ color: GRAY, fontWeight: 'bold' }}>
                      Trạng thái
                    </Typography>
                    <RadioGroup
                      value={(values as any).status}
                      onChange={event => {
                        setFieldValue('status', (event.target as HTMLInputElement).value);
                      }}
                    >
                      {statusOption1.map((element, index) => {
                        // eslint-disable-next-line no-nested-ternary
                        return !checkView ? (
                          <FormControlLabel
                            key={index}
                            value={element.id}
                            control={<Radio size="small" color="primary" />}
                            label={<Typography variant="body2">{element.name}</Typography>}
                          />
                        ) : element?.id === dataHashTag?.status ? (
                          <FormControlLabel
                            key={index}
                            value={element.id}
                            control={<Radio size="small" style={{ color: BLACK_200 }} />}
                            label={<Typography variant="body2">{element.name}</Typography>}
                          />
                        ) : (
                          <Typography
                            variant="button"
                            style={{
                              color: BLACK_200,
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              padding: 8,
                              marginLeft: 22,
                            }}
                          >
                            {element?.name}
                          </Typography>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                </Col>
                <Row style={{ marginTop: 8, flexWrap: 'wrap' }}>
                  <Grid item xs={4} style={{ marginBottom: 20 }}>
                    <Typography variant="caption" style={{ color: BLACK_400 }}>
                      Hashtag ID
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ color: BLACK_500, padding: '4px 0px 8px' }}
                    >
                      {dataHashTag?.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} style={{ marginBottom: 20 }}>
                    <Typography variant="caption" style={{ color: BLACK_400 }}>
                      Người tạo
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ color: BLACK_500, padding: '4px 0px 8px' }}
                    >
                      {dataHashTag?.createdByName}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} style={{ marginBottom: 20 }}>
                    <Typography variant="caption" style={{ color: BLACK_400 }}>
                      User ID
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{
                        color: BLACK_500,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px 0px 8px',
                      }}
                    >
                      {dataHashTag?.createdBy}
                    </Typography>
                  </Grid>
                </Row>
                <Row style={{ marginTop: 8, flexWrap: 'wrap' }}>
                  <Grid item xs={4} style={{ marginBottom: 20 }}>
                    <Typography variant="caption" style={{ color: BLACK_400 }}>
                      Nguồn gốc
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ color: BLACK_500, padding: '4px 0px 8px' }}
                    >
                      {dataHashTag?.source}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} style={{ marginBottom: 20 }}>
                    <Typography variant="caption" style={{ color: BLACK_400 }}>
                      Thời gian tạo
                    </Typography>
                    <Typography variant="body2" style={{ color: BLACK_500, padding: '8px 0px' }}>
                      {moment(dataHashTag?.createdAt)?.format(DATE_FORMAT_SHOW)}
                    </Typography>
                  </Grid>
                </Row>
                <Row style={{ marginTop: 8, flexWrap: 'wrap' }}>
                  <Grid item xs={4} style={{ marginBottom: 20 }}>
                    <Typography variant="caption" style={{ color: BLACK_400 }}>
                      Số bài viết sử dụng
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ color: BLACK_500, padding: '4px 0px 8px' }}
                    >
                      {dataHashTag?.numOfPosts}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} style={{ marginBottom: 20 }}>
                    <Typography variant="caption" style={{ color: BLACK_400 }}>
                      Số người sử dụng
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ color: BLACK_500, padding: '4px 0px 8px' }}
                    >
                      {dataHashTag?.numOfUsers}
                    </Typography>
                  </Grid>
                </Row>
                <Row
                  style={{
                    marginTop: 32,
                  }}
                >
                  <Button
                    className={classHashTag.button}
                    variant="outlined"
                    style={{ minWidth: 140, height: 40, background: 'transparent' }}
                    onClick={() => {
                      resetForm();
                      history.push({ pathname: ROUTES.hashtag.result });
                    }}
                  >
                    <Typography variant="button" style={{ color: PINK }}>
                      Hủy
                    </Typography>
                  </Button>
                  {checkView ? (
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      size="large"
                      style={{ minWidth: 140, marginRight: 20 }}
                      color="primary"
                      disableElevation
                      loading={false}
                      className={classHashTag.button}
                    >
                      Chỉnh sửa
                    </LoadingButton>
                  ) : (
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      size="large"
                      style={{ minWidth: 140, marginRight: 20 }}
                      color="primary"
                      disableElevation
                      loading={false}
                      className={classHashTag.button}
                    >
                      Cập nhật
                    </LoadingButton>
                  )}
                </Row>
              </Form>
            );
          }}
        </Formik>
      </Card>
      {!checkView && (
        <Row style={{ justifyContent: 'center', marginTop: 22 }}>
          <Button
            onClick={() => {
              onDeleteHashTags(true);
            }}
          >
            <IconDeleteRed style={{ marginRight: 7 }} />
            <Typography variant="button" style={{ color: RED, fontWeight: 700 }}>
              Xoá hashtag
            </Typography>
          </Button>
        </Row>
      )}
      <ConfirmDialog
        open={deleteHashTags}
        onAccept={() => {
          history.push({ pathname: ROUTES.hashtag.result });
          dataHashTag && actionDeleteHashTags(dataHashTag);
          onDeleteHashTags(false);
        }}
        titleLabel={
          <Typography variant="body1">Bạn có chắc chắn muốn xóa hashtag này không?</Typography>
        }
        onClose={() => onDeleteHashTags(false)}
        onReject={() => onDeleteHashTags(false)}
      />
    </div>
  );
};
export default React.memo(ViewHashTag);
