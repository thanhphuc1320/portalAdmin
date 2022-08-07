import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { Form, Formik } from 'formik';
import { useSnackbar } from 'notistack';

import { Box, Button, Dialog, DialogTitle, Grid, IconButton, Typography } from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';

import { API_PATHS } from 'configs/API';
import { GRAY, RED } from 'configs/colors';
import { FieldTextContent } from 'modules/common/components/FieldContent';
import LoadingButton from 'modules/common/components/LoadingButton';
import { fetchThunk } from 'modules/common/redux/thunk';
import { Col, snackbarSetting } from '../../../../common/components/elements';

import { ReactComponent as IconClearInput } from 'svg/clear_input.svg';
import * as yup from 'yup';
import './style.scss';

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  itemEdit: any;
  onUpdate: () => void;
}

const cssClass = 'source-dialog';
const ModalAdd: React.FC<Props> = props => {
  const { open, setOpen, itemEdit, onUpdate } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [dataAdd, setDataAdd] = React.useState({ name: '', link: '' });
  const [error, setError] = React.useState({ errorName: '', errorLink: '' });

  // eslint-disable-next-line no-useless-escape
  const httpsReg = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/;

  React.useEffect(() => {
    setDataAdd(itemEdit);
    setError({ errorName: '', errorLink: '' });
  }, [itemEdit]);

  const createSource = useCallback(
    async (value: any) => {
      if (!value.name || !value.link || !httpsReg.test(value.link)) {
        if (!value.name) {
          setError({ ...error, errorName: 'Bạn chưa nhập tên Fanpage' });
        } else if (!value.link) {
          setError({ ...error, errorLink: ' Bạn chưa nhập Link Page' });
        } else if (!httpsReg.test(value.link)) {
          setError({ ...error, errorLink: 'Không đúng định dạng' });
        }
      } else {
        setDataAdd(value);
        const params = {
          name: value.name,
          link: value.link,
          provider: 'TIKTOK',
        };

        let result: any;
        if (!itemEdit.id) {
          result = await dispatch(
            fetchThunk(API_PATHS.apiAdminSource, 'post', JSON.stringify(params)),
          );
        } else {
          result = await dispatch(
            fetchThunk(
              `${API_PATHS.apiAdminSource}?id=${value?.id}`,
              'put',
              JSON.stringify(params),
            ),
          );
        }

        if (result.code === 200) {
          setOpen(false);
          onUpdate();
          result?.message &&
            enqueueSnackbar(
              result?.message,
              snackbarSetting(key => closeSnackbar(key), {
                color: 'success',
              }),
            );
        } else if (result?.code === 500) {
          enqueueSnackbar(
            result?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
        } else {
          result?.errors[0] &&
            enqueueSnackbar(
              result?.errors[0]?.message,
              snackbarSetting(key => closeSnackbar(key), {
                color: 'error',
              }),
            );
          result?.errors[0]?.object === 'name'
            ? setError({
                ...error,
                errorName: 'Tên Fanpage đã tồn tại trong hệ thống. Vui lòng thử lại',
              })
            : setError({
                ...error,
                errorLink: 'Link Page đã tồn tại trong hệ thống. Vui lòng thử lại',
              });
        }
      }
    },
    [closeSnackbar, dispatch, enqueueSnackbar, error, httpsReg, itemEdit, onUpdate, setOpen],
  );

  const storeSchema = yup.object().shape({
    name: yup.string().required('Bạn chưa nhập tên Fanpage'),
    link: yup.string().required('Bạn chưa nhập link Page'),
  });

  const handleCheckInput = (val, setFieldValue) => {
    const valueText = val?.target?.value;
    if (valueText.length > 150) {
      setFieldValue('name', valueText.substring(0, 150));
      enqueueSnackbar(
        'Giới hạn 150 ký tự',
        snackbarSetting(key => closeSnackbar(key), {
          color: 'error',
        }),
      );
    } else {
      setFieldValue('name', valueText);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          ...dataAdd,
        }}
        onSubmit={async values => {
          createSource(values);
        }}
        validationSchema={storeSchema}
      >
        {({ values, resetForm, setFieldValue, errors }) => {
          return (
            <Form>
              <Dialog maxWidth="lg" open={open} onClose={() => setOpen(false)}>
                <DialogTitle style={{ paddingBottom: 0 }}>
                  <Typography className={`${cssClass}-title`}>
                    {`${itemEdit?.id ? 'Chỉnh sửa' : 'Thêm'} Sources`}
                  </Typography>
                  <IconButton
                    style={{ position: 'absolute', top: 8, right: 8, padding: 0 }}
                    onClick={() => setOpen(false)}
                  >
                    <IconClose />
                  </IconButton>
                </DialogTitle>
                <Box
                  className={`${cssClass}-body`}
                  style={{ width: 415, height: 'fit-content', padding: 20 }}
                >
                  <Col>
                    <Grid item xs={12} style={{ position: 'relative' }}>
                      <FieldTextContent
                        name="name"
                        placeholder="Nhập tên Fanpage..."
                        formControlStyle={{ width: '100%', marginRight: 0, minWidth: 'unset' }}
                        style={{
                          minWidth: 'unset',
                          width: '100%',
                          borderRadius: 4,
                          marginRight: 0,
                        }}
                        label={
                          <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                            Tên Fanpage
                          </Typography>
                        }
                        onChange={val => {
                          setError({ ...error, errorName: '' });
                          handleCheckInput(val, setFieldValue);
                        }}
                        errorMessage={errors?.name}
                        value={values?.name}
                        optional
                      />
                      {values?.name?.length > 1 && (
                        <IconClearInput
                          width={20}
                          height={20}
                          style={{ position: 'absolute', top: 32, right: 10, cursor: 'pointer' }}
                          onClick={() => {
                            setError({ ...error, errorName: '' });
                            setFieldValue('name', '');
                          }}
                        />
                      )}
                      {error?.errorName && (
                        <Typography variant="body2" style={{ color: RED }}>
                          {error?.errorName}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} style={{ position: 'relative' }}>
                      <FieldTextContent
                        name="link"
                        placeholder="https://"
                        formControlStyle={{ width: '100%', marginRight: 0, minWidth: 'unset' }}
                        style={{
                          minWidth: 'unset',
                          width: '100%',
                          borderRadius: 4,
                          marginRight: 0,
                        }}
                        label={
                          <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                            Link Page
                          </Typography>
                        }
                        onChange={val => {
                          setError({ ...error, errorLink: '' });
                          setFieldValue('link', val?.target?.value);
                        }}
                        value={values?.link}
                        errorMessage={errors?.link && String(errors?.link)}
                        optional
                      />
                      {values?.link?.length > 1 && (
                        <IconClearInput
                          width={20}
                          height={20}
                          style={{ position: 'absolute', top: 32, right: 10, cursor: 'pointer' }}
                          onClick={() => {
                            setError({ ...error, errorLink: '' });
                            setFieldValue('link', '');
                          }}
                        />
                      )}
                      {error?.errorLink && (
                        <Typography variant="body2" style={{ color: RED }}>
                          {error?.errorLink}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} container direction="row" justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="medium"
                        style={{ minWidth: 95, minHeight: 40, marginRight: 12, width: 180 }}
                        onClick={() => {
                          resetForm();
                          setOpen(false);
                        }}
                        disableElevation
                      >
                        <FormattedMessage id="cancel" />
                      </Button>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="medium"
                        onClick={() => {
                          createSource(values);
                        }}
                        loading={false}
                        style={{ minWidth: 95, minHeight: 40, marginRight: 12, width: 180 }}
                        disableElevation
                      >
                        {itemEdit?.id ? (
                          <FormattedMessage id="Cập nhật" />
                        ) : (
                          <FormattedMessage id="Tạo mới" />
                        )}
                      </LoadingButton>
                    </Grid>
                  </Col>
                </Box>
              </Dialog>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default ModalAdd;
