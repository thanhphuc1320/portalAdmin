import { Grid, Paper, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import LoadingButton from 'modules/common/components/LoadingButton';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { fetchThunk } from 'modules/common/redux/thunk';
import { API_PATHS } from 'configs/API';
import * as yup from 'yup';
import { GRAY } from 'configs/colors';
import { some, isEmpty } from 'configs/utils';
import { Row, snackbarSetting } from 'modules/common/components/elements';
import { FieldSelectContent, FieldTextContent } from 'modules/common/components/FieldContent';
import UploadImage from 'modules/common/components/UploadImage';
import { UNLIMITED_CHARACTERS, UNLIMITED_NUMBER } from '../constants';
import './style.scss';

const cssClass = 'form-reward-create-update';

const initReward = {
  caId: undefined,
  name: '',
  value: undefined,
  description: '',
  imageUrl: '',
  link: '',
  type: '',
  valueType: '',
  quantity: undefined,
  isActive: true,
};

interface Props {
  loading?: boolean;
  caIdList?: some[];
  typeList?: some[];
  valueTypeList?: some[];
  onFetchValueTypeList?(type: string): void;
}

const FormReward: React.FC<Props> = props => {
  const { caIdList, typeList, valueTypeList, onFetchValueTypeList } = props;
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [data, setData] = useState<any>(initReward);
  const isUpdate = location?.pathname.includes('update');
  const id = (location as any).query?.rewardId || undefined;

  const getDataReward = useCallback(async () => {
    const json = await dispatch(fetchThunk(`${API_PATHS.getAdminRewardList}?code=${id}`, 'get'));
    if (json?.code === 200) {
      const dataReward = json?.data?.content[0];
      setData(dataReward);
      onFetchValueTypeList && onFetchValueTypeList(dataReward?.type);
    } else {
      json?.message &&
        enqueueSnackbar(
          json?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
    }
  }, [closeSnackbar, dispatch, enqueueSnackbar, onFetchValueTypeList, id]);

  useEffect(() => {
    id && getDataReward();
  }, [id, getDataReward]);

  const onSave = useCallback(
    async (value: any) => {
      const params = {
        caId: value.caId,
        name: value.name,
        value: value.value,
        description: value.description,
        imageUrl: value.imageUrl,
        link: value.link,
        type: value.type,
        valueType: value.valueType,
        unit: value.unit,
        quantity: value.quantity === UNLIMITED_CHARACTERS ? UNLIMITED_NUMBER : value.quantity,
        isActive: value.isActive,
      };

      const formData = JSON.stringify(params);
      const json = isUpdate
        ? await dispatch(fetchThunk(`${API_PATHS.updateReward}?id=${data?.id}`, 'put', formData))
        : await dispatch(fetchThunk(API_PATHS.createReward, 'post', formData));

      if (json?.code === 200) {
        const message = isUpdate ? json?.message : 'B???n ???? t???o th??nh c??ng gi???i th?????ng m???i';
        enqueueSnackbar(
          message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'success',
          }),
        );
        history.push('/reward');
      } else {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
      }
    },
    [closeSnackbar, dispatch, enqueueSnackbar, history, data, isUpdate],
  );

  const storeSchema = yup.object().shape({
    name: yup
      .string()
      .min(4, 'Nh???p t???i thi???u 4 k?? t???')
      .required('Vui l??ng nh???p T??n gi???i th?????ng')
      .trim(),
    description: yup
      .string()
      .min(4, 'Nh???p t???i thi???u 4 k?? t???')
      .required('Vui l??ng nh???p m?? t??? gi???i th?????ng'),
    caId: yup.number().required('Vui l??ng ch???n k??nh chia s???'),
    type: yup.string().required('Vui l??ng ch???n lo???i'),
    quantity: yup.string().required('Vui l??ng nh???p s??? l?????ng'),
    value: yup.number().required('Vui l??ng nh???p Gi?? tr???'),
    valueType: yup.string().required('Vui l??ng ch???n'),
    link: yup.string().required('Vui l??ng nh???p link'),
  });

  return (
    <div className={`${cssClass}`}>
      <Formik
        enableReinitialize
        initialValues={{
          ...data,
          quantity: data?.quantity === UNLIMITED_NUMBER ? UNLIMITED_CHARACTERS : data?.quantity,
        }}
        onSubmit={(values, { setErrors, setSubmitting }) => {
          if (isEmpty(values?.quantity) || values?.quantity === 0) {
            setErrors({ quantity: 'Vui l??ng nh???p s??? l?????ng' });
            return;
          }
          onSave(values);
          setSubmitting(false);
        }}
        validationSchema={storeSchema}
      >
        {({ values, setFieldValue, errors }) => {
          return (
            <Form
              style={{
                borderRadius: 4,
                marginBottom: 26,
              }}
            >
              <Grid
                container
                component={Paper}
                style={{
                  margin: '20px 0px',
                  padding: 16,
                  boxShadow: ' 0px 1px 6px rgb(0 0 0 / 15%)',
                }}
              >
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FieldTextContent
                    name="name"
                    label={
                      <Row style={{ justifyContent: 'space-between', width: '98%' }}>
                        <Typography variant="subtitle2">T??n gi???i th?????ng</Typography>
                        <Typography style={{ color: GRAY }} variant="caption">
                          Nh???p t???i thi???u 4 k?? t???, t???i ??a 10.000 k?? t???
                        </Typography>
                      </Row>
                    }
                    placeholder="Nh???p t??n gi???i th?????ng"
                    inputProps={{ maxLength: 10000 }}
                    formControlStyle={{ width: '100%' }}
                    style={{ width: '100%' }}
                    optional
                    errorMessage={errors.name && String(errors.name)}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FieldTextContent
                    name="description"
                    multiline
                    rows={4}
                    label={
                      <Row style={{ justifyContent: 'space-between', width: '98%' }}>
                        <Typography variant="subtitle2">M?? t??? gi???i th?????ng</Typography>
                        <Typography style={{ color: GRAY }} variant="caption">
                          Nh???p t???i thi???u 4 k?? t???, t???i ??a 10.000 k?? t???
                        </Typography>
                      </Row>
                    }
                    placeholder="M?? t??? gi???i th?????ng"
                    inputProps={{ maxLength: 10000 }}
                    formControlStyle={{ width: '100%' }}
                    style={{ width: '100%' }}
                    optional
                    errorMessage={errors.description && String(errors.description)}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                component={Paper}
                style={{
                  margin: '20px 0px',
                  padding: 16,
                  boxShadow: ' 0px 1px 6px rgb(0 0 0 / 15%)',
                }}
              >
                <Grid item xs={12}>
                  <Row
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: '1px solid #ccc',
                      margin: '0px -15px 15px -15px',
                      padding: '5px 15px',
                    }}
                  >
                    <Typography variant="subtitle1">Th??m ???nh gi???i th?????ng</Typography>
                    <Typography variant="body2" style={{ color: GRAY, marginLeft: 4 }}>
                      (???nh t??? l??? 16:9 ho???c 1:1)
                    </Typography>
                  </Row>
                </Grid>
                <Grid item xs={12}>
                  <UploadImage
                    url={values.imageUrl}
                    setUrl={link => setFieldValue('imageUrl', link)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" style={{ color: GRAY, marginTop: 15 }}>
                    Dung l?????ng cho ph??p m???i ???nh nh??? h??n 5Mb.
                  </Typography>
                </Grid>
              </Grid>

              <Grid
                container
                spacing={1}
                component={Paper}
                style={{
                  margin: '20px 0px',
                  padding: 15,
                  boxShadow: ' 0px 1px 6px rgb(0 0 0 / 15%)',
                }}
              >
                <Grid item xs={6} sm={4} md={6} lg={4} xl={4}>
                  <FieldSelectContent
                    name="caId"
                    placeholder="Ch???n k??nh"
                    classNameList={`${cssClass}-select-list`}
                    formControlStyle={{ width: '90%' }}
                    style={{ width: '90%' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Ch???n k??nh chia s???
                      </Typography>
                    }
                    options={caIdList || []}
                    optional
                    onSelectOption={value => {
                      setFieldValue('caId', value);
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={6} lg={4} xl={4}>
                  <FieldSelectContent
                    name="type"
                    placeholder="Ch???n lo???i"
                    classNameList={`${cssClass}-select-list`}
                    formControlStyle={{ width: '90%' }}
                    style={{ width: '90%' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Lo???i
                      </Typography>
                    }
                    options={typeList || []}
                    optional
                    onSelectOption={value => {
                      setFieldValue('type', value);
                      onFetchValueTypeList && onFetchValueTypeList(value);
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={6} lg={4} xl={4}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', width: '80%' }}>
                    <FieldTextContent
                      name="value"
                      onChange={e => {
                        setFieldValue('value', e.target.value);
                      }}
                      label={
                        <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                          Gi?? tr???
                        </Typography>
                      }
                      formControlStyle={{ width: '102%', minWidth: 'unset', margin: 0 }}
                      style={{ width: '102%', minWidth: 'unset', margin: 0 }}
                      placeholder="Nh???p gi?? tr???"
                      inputProps={{ maxLength: 10000, autoComplete: 'off' }}
                      optional
                    />
                    <FieldSelectContent
                      name="valueType"
                      placeholder="Ch???n"
                      classNameContainer={`${cssClass}-select`}
                      classNameList={`${cssClass}-select-list`}
                      formControlStyle={{ width: 100, minWidth: 'unset', margin: 0 }}
                      style={{
                        width: 100,
                        minWidth: 'unset',
                        margin: 0,
                        borderRadius: '0px 4px 4px 0px',
                      }}
                      options={valueTypeList || []}
                      optional
                      onSelectOption={value => {
                        setFieldValue('valueType', value);
                      }}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={4} md={6} lg={4} xl={4}>
                  <FieldTextContent
                    name="quantity"
                    onChange={e => {
                      const qty = e.target.value;
                      if (qty === UNLIMITED_CHARACTERS) {
                        setFieldValue('quantity', UNLIMITED_CHARACTERS);
                      } else {
                        const qtyNew =
                          Number.isInteger(Number(qty)) &&
                          Number(qty) > 0 &&
                          Number(qty) <= 999999999
                            ? qty
                            : undefined;
                        setFieldValue('quantity', qtyNew);
                      }
                    }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        S??? l?????ng
                      </Typography>
                    }
                    formControlStyle={{ width: '90%', minWidth: 'unset', margin: 0 }}
                    style={{ width: '90%', minWidth: 'unset', margin: 0 }}
                    placeholder="Nh???p s??? l?????ng"
                    inputProps={{ maxLength: 10000, autoComplete: 'off' }}
                    optional
                  />
                </Grid>
                <Grid item xs={6} sm={8} md={6} lg={8} xl={8}>
                  <FieldTextContent
                    name="link"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Link
                      </Typography>
                    }
                    formControlStyle={{ width: '95%', minWidth: 'unset', margin: 0 }}
                    style={{ width: '95%', minWidth: 'unset', margin: 0 }}
                    placeholder="Nh???p link"
                    inputProps={{ maxLength: 10000 }}
                    optional
                  />
                </Grid>
              </Grid>

              <Row style={{ marginTop: 24, justifyContent: 'flex-end' }}>
                <LoadingButton
                  variant="outlined"
                  color="primary"
                  size="large"
                  style={{ minWidth: 140, marginRight: 20 }}
                  disableElevation
                  onClick={() => history.push('/reward')}
                >
                  H???y
                </LoadingButton>

                {!isUpdate && (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    style={{ minWidth: 140, marginRight: 20 }}
                    color="primary"
                    disableElevation
                  >
                    T???o gi???i th?????ng
                  </LoadingButton>
                )}
                {isUpdate && (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    style={{ minWidth: 140 }}
                    color="primary"
                    disableElevation
                  >
                    C???p nh???t gi???i th?????ng
                  </LoadingButton>
                )}
              </Row>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
export default React.memo(FormReward);
