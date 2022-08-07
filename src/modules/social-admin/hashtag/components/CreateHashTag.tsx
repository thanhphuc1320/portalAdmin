import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { ROUTES } from 'configs/routes';
import { Form, Formik } from 'formik';
import LoadingButton from 'modules/common/components/LoadingButton';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
// import { useHistory, useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as yup from 'yup';
import { API_PATHS } from '../../../../configs/API';
import { BLACK_500, GRAY, PINK, WHITE } from '../../../../configs/colors';
import { some } from '../../../../constants';
import { AppState } from '../../../../redux/reducers';
import { ReactComponent as IconInputHashtag } from '../../../../svg/icon_input_hashtag.svg';
import { Col, Row, snackbarSetting } from '../../../common/components/elements';
import { FieldSelectContent, FieldTextContent } from '../../../common/components/FieldContent';
import LoadingIcon from '../../../common/components/LoadingIcon';
import { fetchThunk } from '../../../common/redux/thunk';
import { statusOption1 } from '../../constants';

interface Props {}

const useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: 480,
    margin: 'auto',
    boxShadow: ' 0px 1px 6px rgba(0, 0, 0, 0.15)',
    borderRadius: 4,
    padding: 24,
    '& .MuiFormHelperText-root.Mui-error': {
      padding: '6px 10px 18px 6px',
    },
  },
  button: {
    width: '50%',
    background: PINK,
    borderRadius: 3,
    border: '1px solid rgb(204 0 102)',
    margin: '0px 5px',
    padding: '10px 8px',
  },
});

const CreateHashTag: React.FC<Props> = () => {
  const classHashTag = useStyles();
  const history = useHistory();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [loading, setLoading] = React.useState(false);
  const [caIdList, setCaIdList] = useState<some[]>([]);
  const dataHashTag = { name: '', status: 'ACTIVE' };

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

  const createHashTag = useCallback(
    async (value: any) => {
      const params = {
        caId: value.caId,
        name: value.name,
        status: value.status,
      };
      setLoading(true);
      const json = await dispatch(
        fetchThunk(API_PATHS.getHashTagsList, 'post', JSON.stringify(params)),
      );
      if (json?.code === 200) {
        history.push('/hashtag');
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
    [closeSnackbar, dispatch, enqueueSnackbar, history],
  );

  useEffect(() => {
    fetchCaIdData();
  }, [fetchCaIdData]);

  if (loading) {
    return <LoadingIcon style={{ minHeight: 320 }} />;
  }

  const storeSchema = yup.object().shape({
    name: yup
      .string()
      .min(3, 'Nội dung hashtag từ 3-30 ký tự chữ và số liền nhau')
      .max(30)
      .required('Nội dung hashtag từ 3-30 ký tự chữ và số liền nhau')
      .trim(),
    caId: yup.string().required('Vui lòng chọn kênh bán'),
  });

  return (
    <>
      <Card className={classHashTag.root}>
        <Typography
          variant="h6"
          style={{ color: BLACK_500, fontWeight: 'bold', textAlign: 'center' }}
        >
          Tạo hashtag
        </Typography>
        <Formik
          initialValues={{ ...dataHashTag }}
          enableReinitialize
          onSubmit={async values => {
            createHashTag(values);
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
                    placeholder="Nhập hashtag"
                    inputProps={{
                      maxLength: 30,
                    }}
                    style={{}}
                    startAdornment={<IconInputHashtag style={{ padding: '0px 0px 0px 12px' }} />}
                    errorMessage={errors.name ? errors.name : undefined}
                  />
                  <FieldSelectContent
                    name="caId"
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
                      {statusOption1.map((element, index) => (
                        <FormControlLabel
                          key={index}
                          value={element.id}
                          control={<Radio size="small" color="primary" />}
                          label={<Typography variant="body2">{element.name}</Typography>}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Col>
                <Row
                  style={{
                    marginTop: 32,
                  }}
                >
                  <Button
                    className={classHashTag.button}
                    variant="outlined"
                    color="primary"
                    style={{ backgroundColor: WHITE }}
                    onClick={() => {
                      resetForm();
                      history.push({ pathname: ROUTES.hashtag.result });
                    }}
                  >
                    <Typography variant="button" style={{ color: PINK }}>
                      Hủy
                    </Typography>
                  </Button>

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
                    Tạo mới
                  </LoadingButton>
                </Row>
              </Form>
            );
          }}
        </Formik>
      </Card>
    </>
  );
};
export default React.memo(CreateHashTag);
