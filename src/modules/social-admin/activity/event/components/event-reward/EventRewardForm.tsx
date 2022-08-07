import { Grid, FormControlLabel, Typography, Checkbox } from '@material-ui/core';
import { Form, Formik } from 'formik';
import LoadingButton from 'modules/common/components/LoadingButton';
import React, { useState, useCallback, useEffect } from 'react';
import * as yup from 'yup';
import moment from 'moment';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { fetchThunk } from 'modules/common/redux/thunk';
import { setEventRewardList } from 'modules/social-admin/activity/event/redux/eventReducer';
import { setNotistackMessage } from 'modules/common/redux/reducer';
import { DATE_FORMAT_TIMEZONE } from 'models/moment';
import { API_PATHS } from 'configs/API';
import { some, isEmpty } from 'configs/utils';
import { GRAY } from 'configs/colors';
import { Row } from 'modules/common/components/elements';
import { FieldSelectContent, FieldTextContent } from 'modules/common/components/FieldContent';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import UploadImage from 'modules/common/components/UploadImage';
import { UNLIMITED_CHARACTERS, UNLIMITED_NUMBER } from '../../constants';

const cssClass = 'form-reward-create-update';

const initEventReward = {
  name: '',
  caIds: undefined,
  rewardId: undefined,
  rewardCode: '',
  rewardName: '',
  displayName: '',
  quantity: undefined,
  quantityRemaining: undefined,
  link: undefined,
  imageUrl: '',
  isDefault: false,
};

interface Props {
  loading?: boolean;
  setLoading?(value: any): void;
  onSaveData?(values: any): void;
  onClose?(): void;
  isUpdate?: boolean;
  eventRewardItem?: any;
}
const EventRewardForm: React.FC<Props> = props => {
  const { isUpdate, eventRewardItem, loading, onClose } = props;
  const caIDListPost = useSelector((state: AppState) => state.common.caIDListPost);
  const eventRewardList = useSelector((state: AppState) => state.event.eventRewardList);
  const userData = useSelector((state: AppState) => state.account.userData, shallowEqual);
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [rewardList, setRewardList] = useState<some[]>([]);
  const [rewardSelected, setRewardSelected] = useState<any>();
  const [userProfile, setUserProfile] = useState<any>();
  const [dataForm, setDataForm] = useState<any>(initEventReward);
  const [isManualLink, setIsManualLink] = useState<boolean>(false);
  const [isManualImage, setIsManualImage] = useState<boolean>(false);

  const getRewardList = useCallback(
    async (caIds: number[]) => {
      if (isEmpty(caIds)) {
        setRewardList([]);
        return;
      }
      const json = await dispatch(
        fetchThunk(`${API_PATHS.getAdminRewardList}?caIds=${caIds}&page=0&size=100`, 'get'),
      );
      if (json?.code === 200) {
        setRewardList(json?.data?.content);
      } else {
        json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
      }
    },
    [dispatch],
  );

  const getProfile = useCallback(
    async (userId: number) => {
      if (isEmpty(userId)) {
        setUserProfile({});
        return;
      }
      const json = await dispatch(
        fetchThunk(`${API_PATHS.getUserProfile}?userId=${userId}`, 'get'),
      );
      if (json?.code === 200) {
        setUserProfile(json?.data);
      } else {
        json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    isUpdate && setDataForm(eventRewardItem);
    if (isUpdate && !isEmpty(eventRewardItem) && eventRewardItem?.reward?.caId) {
      getRewardList([eventRewardItem?.reward?.caId]);
      setRewardSelected(eventRewardItem?.reward);
      getProfile(eventRewardItem?.createdBy);
    }
  }, [isUpdate, eventRewardItem, getProfile, getRewardList]);

  const onAddEventReward = useCallback(
    (dataSave: any) => {
      dataSave.createdAt = moment().format(DATE_FORMAT_TIMEZONE);
      if (dataSave?.isDefault) {
        const tempEventRewardList: some[] = [];
        eventRewardList?.map((item: any, index: number) => {
          tempEventRewardList[index] = item;
          tempEventRewardList[index].isDefault = false;
        });
        dispatch(setEventRewardList([...tempEventRewardList, dataSave]));
      } else {
        dispatch(setEventRewardList([...eventRewardList, dataSave]));
      }
    },
    [eventRewardList, dispatch],
  );

  const onUpdateEventReward = useCallback(
    (dataSave: any, createdId: string) => {
      eventRewardList?.map((item: any, index: number) => {
        if (item?.createdAt === createdId) {
          eventRewardList[index] = { ...item, ...dataSave };
        }
        if (dataSave?.isDefault && item?.createdAt !== createdId) {
          eventRewardList[index].isDefault = false;
        }
      });
      dispatch(setEventRewardList([...eventRewardList]));
      onClose && onClose();
    },
    [eventRewardList, onClose, dispatch],
  );

  const onSave = useCallback(
    async (values: any) => {
      const dataSave = {
        name: values?.name,
        caIds: values?.caIds,
        rewardId: values?.rewardId,
        reward: rewardSelected,
        displayName: values?.displayName,
        isDefault: values?.isDefault,
        quantity: values?.quantity === UNLIMITED_CHARACTERS ? UNLIMITED_NUMBER : values?.quantity,
        link: values?.link || isManualLink ? values?.link : rewardSelected?.link,
        imageUrl: values?.imageUrl || isManualImage ? values?.imageUrl : rewardSelected?.imageUrl,
      };
      if (isUpdate && eventRewardItem?.createdAt) {
        onUpdateEventReward(dataSave, eventRewardItem?.createdAt);
      } else {
        onAddEventReward(dataSave);
      }

      setRewardSelected(undefined);
    },
    [
      isUpdate,
      rewardSelected,
      isManualImage,
      isManualLink,
      eventRewardItem,
      onAddEventReward,
      onUpdateEventReward,
    ],
  );

  const storeSchema = yup.object().shape({
    name: yup
      .string()
      .min(4, 'Nhập tối thiểu 4 ký tự')
      .required('Vui lòng nhập loại giải')
      .trim(),
    caIds: yup.array().required('Vui lòng chọn kênh phân phối'),
    rewardId: yup.number().required('Vui lòng chọn giải thưởng'),
    displayName: yup.string().required('Vui lòng nhập tên hiển thị'),
    quantity: yup.string().required('Vui lòng nhập số lượng'),
  });

  return (
    <div className={`${cssClass}`}>
      <Formik
        enableReinitialize
        initialValues={{
          ...dataForm,
          rewardId: dataForm?.reward?.id,
          caIds: dataForm?.reward?.caId ? [dataForm?.reward?.caId] : undefined,
          quantity:
            dataForm?.quantity === UNLIMITED_NUMBER ? UNLIMITED_CHARACTERS : dataForm?.quantity,
        }}
        onSubmit={(values, { setErrors, setSubmitting, resetForm }) => {
          if (!isUpdate && eventRewardList?.find(item => item.name === values?.name)) {
            setErrors({ name: 'Loại giải không được trùng tên' });
            return;
          }
          if (isEmpty(values?.quantity) || values?.quantity === 0) {
            setErrors({ quantity: 'Vui lòng nhập số lượng' });
            return;
          }
          onSave(values);
          resetForm({});
          setSubmitting(false);
        }}
        validationSchema={storeSchema}
      >
        {({ values, setFieldValue, errors }) => {
          return (
            <Form style={{ borderRadius: 4, marginBottom: 15 }}>
              <Grid container>
                <Grid item xs={12}>
                  <FieldTextContent
                    name="name"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Loại giải
                      </Typography>
                    }
                    placeholder="Nhập loại giải"
                    inputProps={{ maxLength: 10000, autoComplete: 'off' }}
                    formControlStyle={{ width: '100%', minWidth: 'unset', marginRight: 0 }}
                    style={{ width: '100%' }}
                    optional
                    errorMessage={errors.name && String(errors.name)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FieldSelectContent
                    multiple
                    name="caIds"
                    placeholder="Chọn kênh phân phối"
                    formControlStyle={{ width: '100%', minWidth: 'unset', marginRight: 0 }}
                    style={{ width: '100%' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        CaID
                      </Typography>
                    }
                    options={caIDListPost || []}
                    optional
                    onSelectOption={(value: any) => {
                      setFieldValue('caIds', value);
                      getRewardList(value);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <FormControlAutoComplete<some>
                      id="rewardId"
                      placeholder="Chọn"
                      label={
                        <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                          Reward Code
                        </Typography>
                      }
                      value={
                        rewardList?.find((v: some) => v.id === (values as any).rewardId) || null
                      }
                      onChange={(e: any, valueItem: some | null) => {
                        setFieldValue('rewardId', valueItem?.id);
                        !values?.link && setIsManualLink(false);
                        !values?.imageUrl && setIsManualImage(false);
                        const tempReward2 = rewardList?.find(item => item.id === valueItem?.id);
                        setRewardSelected(tempReward2);
                        setFieldValue('quantity', undefined);
                      }}
                      options={rewardList as some[]}
                      getOptionLabel={(one: some) => one.code}
                      getOptionSelected={(option: some, value: some) => {
                        return option?.id === value?.id;
                      }}
                      optional
                      formControlStyle={{ width: '48%', minWidth: 'unset', marginRight: 0 }}
                      errorMessage={errors.rewardId && String(errors.rewardId)}
                    />

                    <FormControlAutoComplete<some>
                      id="rewardId"
                      placeholder="Chọn"
                      label={
                        <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                          Reward Name
                        </Typography>
                      }
                      value={
                        rewardList?.find((v: some) => v.id === (values as any).rewardId) || null
                      }
                      onChange={(e: any, valueItem: some | null) => {
                        setFieldValue('rewardId', valueItem?.id);
                        !values?.link && setIsManualLink(false);
                        !values?.imageUrl && setIsManualImage(false);
                        const tempReward2 = rewardList?.find(item => item.id === valueItem?.id);
                        setRewardSelected(tempReward2);
                        setFieldValue('quantity', undefined);
                      }}
                      options={rewardList as some[]}
                      getOptionLabel={(one: some) => one.name}
                      getOptionSelected={(option: some, value: some) => {
                        return option?.id === value?.id;
                      }}
                      optional
                      formControlStyle={{ width: '50%', minWidth: 'unset', marginRight: 0 }}
                      errorMessage={errors.rewardId && String(errors.rewardId)}
                    />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <FieldTextContent
                    name="displayName"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Tên hiển thị giải thưởng
                      </Typography>
                    }
                    placeholder="Nhập tên hiển thị giải thưởng đến người dùng"
                    inputProps={{ maxLength: 10000, autoComplete: 'off' }}
                    formControlStyle={{ width: '100%', minWidth: 'unset', marginRight: 0 }}
                    style={{ width: '100%' }}
                    optional
                    errorMessage={errors.displayName && String(errors.displayName)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <FieldTextContent
                      name="quantityRemaining"
                      value={
                        rewardSelected?.quantity === UNLIMITED_NUMBER
                          ? UNLIMITED_CHARACTERS
                          : rewardSelected?.quantity
                      }
                      label={
                        <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                          Số giải thưởng còn lại
                        </Typography>
                      }
                      formControlStyle={{ width: '95%', minWidth: 'unset', marginRight: 0 }}
                      style={{ width: '95%' }}
                      placeholder="Số lượng theo Reward"
                      inputProps={{ autoComplete: 'off' }}
                      optional
                      disabled
                    />

                    <FieldTextContent
                      name="quantity"
                      onChange={e => {
                        const qty = e.target.value;
                        if (qty === UNLIMITED_CHARACTERS) {
                          setFieldValue('quantity', UNLIMITED_CHARACTERS);
                        } else if (Number(rewardSelected?.quantity) === UNLIMITED_NUMBER) {
                          const quantityNew =
                            Number.isInteger(Number(qty)) && Number(qty) > 0 ? qty : 0;
                          setFieldValue('quantity', quantityNew);
                        } else if (Number(qty) < 0) {
                          setFieldValue('quantity', UNLIMITED_CHARACTERS);
                        } else {
                          let qtyNew = Number.isInteger(Number(qty)) && Number(qty) > 0 ? qty : 0;
                          qtyNew =
                            qtyNew > rewardSelected?.quantity ? rewardSelected?.quantity : qtyNew;
                          setFieldValue('quantity', qtyNew);
                        }
                      }}
                      label={
                        <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                          Số giải thưởng áp dụng
                        </Typography>
                      }
                      formControlStyle={{ width: '100%', minWidth: 'unset', marginRight: 0 }}
                      style={{ width: '100%' }}
                      placeholder="Nhập số lượng"
                      inputProps={{ autoComplete: 'off' }}
                      optional
                    />
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <FieldTextContent
                    name="link"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Link
                      </Typography>
                    }
                    placeholder="Nhập link"
                    value={values?.link || isManualLink ? values?.link : rewardSelected?.link}
                    onChange={e => {
                      setIsManualLink(true);
                      setFieldValue('link', e.target.value);
                    }}
                    formControlStyle={{ width: '100%', minWidth: 'unset', marginRight: 0 }}
                    style={{ width: '100%' }}
                    inputProps={{ maxLength: 10000, autoComplete: 'off' }}
                    optional
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} style={{ marginTop: -15 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={values.isDefault}
                      color="primary"
                      onChange={e => {
                        setFieldValue(`isDefault`, e.target.checked);
                      }}
                    />
                  }
                  label={<Typography variant="body2">Đặt làm giải thưởng mặc định</Typography>}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                  Hình ảnh
                </Typography>
                <UploadImage
                  url={
                    values?.imageUrl || isManualImage ? values?.imageUrl : rewardSelected?.imageUrl
                  }
                  setUrl={imageUrl => {
                    setIsManualImage(true);
                    setFieldValue('imageUrl', imageUrl);
                  }}
                  widthImg={100}
                  heightImg={80}
                  style={{ margin: 0, padding: 0 }}
                />
              </Grid>

              {isUpdate && (
                <div>
                  <Typography
                    style={{ color: GRAY, display: 'block', marginTop: 15 }}
                    variant="body2"
                  >
                    Ngày tạo
                  </Typography>
                  <Typography
                    style={{ fontWeight: 'bold', display: 'block', margin: '2px 0px 7px 0px' }}
                    variant="body2"
                  >
                    {dataForm?.createdAt &&
                      moment(dataForm?.createdAt).format('DD/MM/YYYY - HH:mm')}
                  </Typography>

                  <Typography
                    style={{ color: GRAY, display: 'block', marginTop: 5 }}
                    variant="body2"
                  >
                    Người tạo
                  </Typography>
                  <Typography
                    style={{ fontWeight: 'bold', display: 'block', margin: '2px 0px 7px 0px' }}
                    variant="body2"
                  >
                    {userProfile?.name || userData?.simpleInfo?.name}
                  </Typography>
                </div>
              )}

              <Row style={{ marginTop: 15, justifyContent: 'center' }}>
                <LoadingButton
                  variant="outlined"
                  color="primary"
                  size="large"
                  style={{ minWidth: 140, marginRight: 25 }}
                  disableElevation
                  loading={false}
                  onClick={onClose}
                >
                  {isUpdate ? 'Hủy' : 'Đóng'}
                </LoadingButton>

                {!isUpdate && (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    style={{ minWidth: 140, marginRight: 20 }}
                    color="primary"
                    disableElevation
                    loading={false}
                  >
                    Thêm
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
                    loading={loading}
                  >
                    Lưu
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
export default React.memo(EventRewardForm);
