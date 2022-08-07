import React, { useCallback, useEffect, useState } from 'react';
import { Grid, Paper, Typography, Avatar } from '@material-ui/core';
import { Form, Formik } from 'formik';
import moment, { Moment } from 'moment';
import { isArray } from 'lodash';
import LoadingButton from 'modules/common/components/LoadingButton';
import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { fetchThunk } from 'modules/common/redux/thunk';
import { setNotistackMessage } from 'modules/common/redux/reducer';
import { fetchCaIDListPost } from 'modules/common/redux/actions';
import { setEventRewardList } from 'modules/social-admin/activity/event/redux/eventReducer';
import { API_PATHS } from 'configs/API';
import * as yup from 'yup';
import { GRAY, RED } from 'configs/colors';
import { isEmpty, some } from 'configs/utils';
import { DATE_TIME_HOUR_FORMAT } from 'models/moment';
import { FieldTextContent, FieldSelectContent } from 'modules/common/components/FieldContent';
import DatetimePickerField from 'modules/common/components/DatetimePickerField';
import { Row } from 'modules/common/components/elements';
import UploadImage from 'modules/common/components/UploadImage';
import EventReward from './event-reward';
import EventCondition from './event-condition';
import { EVENT_STATUS, CONDITIONS_TARGET_REWARD, DATE_TIME_HOUR_FORMAT_DB } from '../constants';
import './style.scss';

const cssClass = 'form-reward-create-update';

const fieldsEvent = [
  'name',
  'description',
  'caIds',
  'beginAt',
  'endAt',
  'bannerUrl',
  'bannerLink',
  'eventRewards',
  'save',
];

const initEvent = {
  name: '',
  description: '',
  caIds: undefined,
  beginAt: undefined,
  endAt: undefined,
  bannerUrl: '',
  bannerLink: '',
  eventRewards: [],
  isActive: false,
};

interface Props {}

const EventForm: React.FC<Props> = () => {
  const history = useHistory();
  const location = useLocation();
  const eventRewardList = useSelector((state: AppState) => state.event.eventRewardList);
  const caIDListPost = useSelector((state: AppState) => state.common.caIDListPost);
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const [data, setData] = useState<some>(initEvent);
  const [typeList, setTypeList] = useState<some[]>([]);
  const [rewardList, setRewardList] = useState<some[]>([]);
  const [disabledList, setDisabledList] = useState<some>([]);
  const [filter, setFilter] = useState<some>();
  const [eventRewardListFilter, setEventRewardListFilter] = useState<some[]>([]);

  const isUpdate = location?.pathname.includes('update');
  const id = (location as any).query?.id || undefined;
  const onlyView = (location as any).query?.onlyView || undefined;

  const resetEventRewardList = useCallback(() => {
    dispatch(setEventRewardList([]));
  }, [dispatch]);

  useEffect(() => {
    resetEventRewardList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setEventRewardListFilter(eventRewardList);
  }, [eventRewardList]);

  const getDataEvent = useCallback(async () => {
    const json = await dispatch(fetchThunk(`${API_PATHS.getAdminEvents}?id=${id}`, 'get'));
    if (json?.code === 200) {
      const event = json?.data?.content[0];
      setData(event);
      dispatch(setEventRewardList(event?.eventRewards || []));
    } else {
      dispatch(setEventRewardList([]));
      json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
    }
  }, [dispatch, id]);

  const fetchTypeList = useCallback(async () => {
    const json = await dispatch(
      fetchThunk(`${API_PATHS.getAdminRewardTypeList}?page=0&size=1000`, 'get'),
    );
    if (json?.data) {
      setTypeList(json.data);
    } else {
      json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
    }
  }, [dispatch]);

  const getRewardList = useCallback(async () => {
    const json = await dispatch(
      fetchThunk(`${API_PATHS.getAdminRewardList}?page=0&size=1000`, 'get'),
    );
    if (json?.code === 200) {
      setRewardList(json?.data?.content);
    } else {
      json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
    }
  }, [dispatch]);

  useEffect(() => {
    id && getDataEvent();
    fetchTypeList();
    getRewardList();
    dispatch(fetchCaIDListPost());
  }, [id, dispatch, getDataEvent, fetchTypeList, getRewardList]);

  const handleFilter = useCallback(
    (values: some) => {
      let listFilter: some[] = eventRewardList;
      if (!isEmpty(values?.type)) {
        listFilter = listFilter.filter(item => item.reward?.type === values?.type);
      }
      if (!isEmpty(values?.rewardId)) {
        listFilter = listFilter.filter(item => item.reward?.id === values?.rewardId);
      }
      if (!isEmpty(values?.name)) {
        listFilter = listFilter.filter(item => item.name?.includes(values?.name));
      }

      if (!isEmpty(values?.type) || !isEmpty(values?.rewardId) || !isEmpty(values?.name)) {
        setEventRewardListFilter([...listFilter]);
      } else {
        setEventRewardListFilter(eventRewardList);
      }
    },
    [eventRewardList],
  );

  const checkEditEvent = useCallback(() => {
    if (onlyView) {
      setDisabledList(fieldsEvent);
      return;
    }
    if (isEmpty(data?.beginAt)) {
      return '';
    }
    const start = moment(data?.beginAt);
    const now = moment();
    if (start > now) {
      setDisabledList([]);
      return EVENT_STATUS.UPCOMING;
    }
    if (isEmpty(data?.endAt)) {
      if (start <= now) {
        setDisabledList(['caIds', 'beginAt', 'endAt', 'eventRewards']);
        return EVENT_STATUS.RUNNING;
      }
      return '';
    }

    const end = moment(data?.endAt);
    if (start <= now && end > now) {
      setDisabledList(['caIds', 'beginAt', 'endAt', 'eventRewards']);
      return EVENT_STATUS.RUNNING;
    }
    if (end <= now) {
      setDisabledList(fieldsEvent);
      return EVENT_STATUS.FINISHED;
    }
    return '';
  }, [onlyView, data]);

  useEffect(() => {
    isUpdate && checkEditEvent();
  }, [isUpdate, checkEditEvent]);

  const checkIsDisabledSave = useCallback(() => {
    let isDisabledSave = false;
    eventRewardListFilter?.map((eR: any) => {
      if (!eR?.isDefault) {
        const conditionTargetReward =
          isArray(eR?.eventConditions) &&
          eR?.eventConditions?.find((eC: any) => CONDITIONS_TARGET_REWARD.includes(eC?.condition));
        if (!conditionTargetReward) {
          isDisabledSave = true;
        }
      }
    });
    return isDisabledSave;
  }, [eventRewardListFilter]);

  const onSave = useCallback(
    async (value: any) => {
      const eventRewardSave = eventRewardList?.map(item => {
        return {
          ...item,
          ...{ conditions: item?.eventConditions },
          ...{ rewardId: item?.reward?.id },
        };
      });
      const formData = {
        code: data?.code,
        name: value?.name,
        description: value?.description,
        caIds: value?.caIds,
        beginAt: value?.beginAt,
        endAt: value?.endAt,
        bannerUrl: value.bannerUrl,
        bannerLink: value.bannerLink,
        eventRewards: eventRewardSave,
        isActive: value.isActive,
      };
      const body = JSON.stringify(formData);
      const json = isUpdate
        ? await dispatch(fetchThunk(`${API_PATHS.getAdminEvents}?id=${data?.id}`, 'put', body))
        : await dispatch(fetchThunk(API_PATHS.getAdminEvents, 'post', body));

      if (json?.code === 200) {
        const message = isUpdate ? json?.message : 'Bạn đã tạo thành công sự kiện mới';
        message && dispatch(setNotistackMessage(message, 'success'));
        history.push('/event');
      } else {
        json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
      }
    },
    [dispatch, history, data, eventRewardList, isUpdate],
  );

  const storeSchema = yup.object().shape({
    name: yup
      .string()
      .min(4, 'Nhập tối thiểu 4 ký tự')
      .max(200, 'Nhập tối thiểu 200 ký tự')
      .required('Vui lòng nhập Tên sự kiện')
      .trim(),
    description: yup
      .string()
      .min(4, 'Nhập tối thiểu 4 ký tự')
      .max(10000, 'Nhập tối thiểu 200 ký tự'),
    caIds: yup.array().required('Vui lòng chọn kênh chia sẻ'),
    beginAt: yup.date().required('Vui lòng nhập ngày bắt đầu'),
  });

  return (
    <div className={`${cssClass}`}>
      <Formik
        enableReinitialize
        initialValues={data}
        onSubmit={(values, { setErrors, setSubmitting }) => {
          if (
            values?.beginAt &&
            values?.endAt &&
            moment(values?.beginAt) >= moment(values?.endAt)
          ) {
            setErrors({ endAt: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu' });
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
                        <Typography variant="subtitle2">Tên sự kiện</Typography>
                        <Typography style={{ color: GRAY }} variant="caption">
                          Nhập tối thiểu 4 ký tự, tối đa 200 ký tự
                        </Typography>
                      </Row>
                    }
                    placeholder="Nhập tên sự kiện"
                    inputProps={{ maxLength: 200, autoComplete: 'off' }}
                    formControlStyle={{ width: '100%' }}
                    style={{ width: '100%' }}
                    optional
                    errorMessage={errors?.name && String(errors?.name)}
                    disabled={disabledList?.includes('name')}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FieldTextContent
                    name="description"
                    multiline
                    rows={4}
                    label={
                      <Row style={{ justifyContent: 'space-between', width: '98%' }}>
                        <Typography variant="subtitle2">Mô tả sự kiện</Typography>
                        <Typography style={{ color: GRAY }} variant="caption">
                          Nhập tối thiểu 4 ký tự, tối đa 10.000 ký tự
                        </Typography>
                      </Row>
                    }
                    placeholder="Nhập mô tả sự kiện"
                    inputProps={{ maxLength: 10000, autoComplete: 'off' }}
                    formControlStyle={{ width: '100%' }}
                    style={{ width: '100%' }}
                    optional
                    errorMessage={errors.description && String(errors.description)}
                    disabled={disabledList?.includes('description')}
                  />
                </Grid>

                <Grid item xs={6} sm={6} md={4} lg={3} xl={3} style={{ marginTop: 15 }}>
                  <FieldSelectContent
                    multiple
                    name="caIds"
                    placeholder="Chọn"
                    options={caIDListPost || []}
                    onSelectOption={value => {
                      setFieldValue('caIds', value);
                    }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Kênh phân phối
                      </Typography>
                    }
                    formControlStyle={{ width: 240 }}
                    style={{ width: 240 }}
                    optional
                    errorMessage={errors?.caIds && String(errors?.caIds)}
                    disabled={disabledList?.includes('caIds')}
                  />
                </Grid>

                <Grid item xs={6} sm={6} md={4} lg={3} xl={3} style={{ marginTop: 15 }}>
                  {disabledList?.includes('beginAt') && (
                    <div>
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Khoảng thời gian
                      </Typography>
                      <br />
                      <Typography variant="caption">
                        {data?.beginAt ? moment(data?.beginAt).format(DATE_TIME_HOUR_FORMAT) : ''} -{' '}
                        {data?.endAt ? moment(data?.endAt).format(DATE_TIME_HOUR_FORMAT) : ''}
                      </Typography>
                    </div>
                  )}

                  {!disabledList?.includes('beginAt') && (
                    <Row>
                      <DatetimePickerField
                        id="beginAt"
                        label={
                          <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                            Khoảng thời gian
                          </Typography>
                        }
                        placeholder="Từ ngày"
                        inputStyle={{ width: 170, marginRight: 5, minWidth: 'unset' }}
                        optional
                        date={values?.beginAt ? moment(values?.beginAt) : undefined}
                        onChange={(beginAt: Moment | null) => {
                          setFieldValue(
                            'beginAt',
                            beginAt ? moment(beginAt).format(DATE_TIME_HOUR_FORMAT_DB) : '',
                          );
                        }}
                        disablePast
                        errorMessage={errors?.beginAt && String(errors?.beginAt)}
                      />

                      <DatetimePickerField
                        id="endAt"
                        placeholder="Đến ngày"
                        inputStyle={{ width: 170, marginTop: 12, minWidth: 'unset' }}
                        optional
                        date={values?.endAt ? moment(values?.endAt) : undefined}
                        minDate={values?.beginAt}
                        onChange={(endAt: Moment | null) => {
                          setFieldValue(
                            'endAt',
                            endAt ? moment(endAt).format(DATE_TIME_HOUR_FORMAT_DB) : null,
                          );
                        }}
                        disablePast
                        errorMessage={errors?.endAt && String(errors?.endAt)}
                      />
                    </Row>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Row style={{ margin: '15px 0px 5px 0px' }}>
                    <Typography variant="subtitle2" style={{ color: GRAY }}>
                      Ảnh banner
                    </Typography>
                    <Typography variant="body2" style={{ color: GRAY, marginLeft: 4 }}>
                      (Khi click vào ảnh banner, dung lượng cho phép mỗi ảnh nhỏ hơn 5MB).
                    </Typography>
                  </Row>
                  {disabledList?.includes('bannerUrl') && (
                    <Avatar
                      variant="square"
                      src={values?.bannerUrl}
                      style={{ width: 128, height: 128 }}
                    />
                  )}
                  {!disabledList?.includes('bannerUrl') && (
                    <UploadImage
                      url={values?.bannerUrl}
                      setUrl={link => setFieldValue('bannerUrl', link)}
                    />
                  )}
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Row style={{ margin: '15px 0px 5px 0px' }}>
                    <Typography variant="subtitle2" style={{ color: GRAY }}>
                      Link kết nối
                    </Typography>
                    <Typography variant="body2" style={{ color: GRAY, marginLeft: 4 }}>
                      (khi click vào ảnh banner).
                    </Typography>
                  </Row>
                  <FieldTextContent
                    name="bannerLink"
                    style={{ width: '100%' }}
                    formControlStyle={{ width: '100%' }}
                    placeholder="Nhập link"
                    inputProps={{ maxLength: 10000, autoComplete: 'off' }}
                    disabled={disabledList?.includes('bannerLink')}
                    optional
                  />
                </Grid>
              </Grid>

              <EventReward
                caIds={values?.caIds}
                typeList={typeList}
                rewardList={rewardList}
                filter={filter}
                setFilter={(obj: some) => {
                  handleFilter({ ...filter, ...obj });
                  setFilter && setFilter({ ...filter, ...obj });
                }}
                disabledReward={disabledList?.includes('eventRewards')}
              />
              <EventCondition
                eventRewardListFilter={eventRewardListFilter}
                disabledReward={disabledList?.includes('eventRewards')}
              />

              {checkIsDisabledSave() && (
                <Typography
                  variant="subtitle2"
                  style={{ color: RED, textAlign: 'right', marginTop: 20 }}
                >
                  Điều kiện nhận thưởng không hợp lệ
                </Typography>
              )}

              <Row style={{ marginTop: 24, justifyContent: 'flex-end' }}>
                <LoadingButton
                  variant="outlined"
                  color="primary"
                  size="large"
                  style={{ minWidth: 140, marginRight: 20 }}
                  disableElevation
                  onClick={() => history.push('/event')}
                >
                  Hủy
                </LoadingButton>

                {!disabledList?.includes('save') && (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    style={{ minWidth: 140, marginRight: 20 }}
                    color="primary"
                    disableElevation
                    disabled={checkIsDisabledSave()}
                  >
                    {isUpdate ? 'Cập nhật sự kiện' : ' Tạo sự kiện'}
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
export default React.memo(EventForm);
