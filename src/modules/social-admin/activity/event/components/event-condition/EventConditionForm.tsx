import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import { Form, Formik } from 'formik';
import LoadingButton from 'modules/common/components/LoadingButton';
import { useLocation } from 'react-router';
import { isArray } from 'lodash';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { setEventRewardList } from 'modules/social-admin/activity/event/redux/eventReducer';
import { GRAY, PRIMARY } from 'configs/colors';
import { Row } from 'modules/common/components/elements';
import { FieldTextContent } from 'modules/common/components/FieldContent';
import EventConditionFormItem from './EventConditionFormItem';
import { NumberFormatCustomNonDecimal } from 'modules/common/components/Form';
import { some, isEmpty } from 'configs/utils';
import {
  EVENT_TARGETS,
  FREQUENCY,
  LIMIT_ACHIEVEMENT,
  UNLIMITED_CHARACTERS,
  UNLIMITED_NUMBER,
} from 'modules/social-admin/activity/event/constants';

const cssClass = 'event-condition-form';

interface Props {
  onClose?(): void;
  disabledReward: boolean;
}
const EventConditionForm: React.FC<Props> = props => {
  const { onClose, disabledReward } = props;
  const location = useLocation();
  const isUpdate = location?.pathname.includes('update');
  const { conditionsSelected, eventRewardList } = useSelector((state: AppState) => state.event);
  const userData = useSelector((state: AppState) => state.account.userData, shallowEqual);
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [conditionFrequency, setConditionFrequency] = useState<any>();
  const [conditionsCompare, setConditionsCompare] = useState<some[]>([]);
  const [isRequired, setIsRequired] = useState<boolean>(false);
  const [isInvalidValue, setIsInvalidValue] = useState<boolean>(false);

  const isEdit = conditionsSelected?.isEdit;
  const conditionIndex = conditionsSelected?.conditionIndex;
  const rewardIndex = conditionsSelected?.rewardIndex;
  const metaTargets = conditionsSelected?.metaTargets;
  const metaConditions = conditionsSelected?.metaConditions;
  const eventReward = conditionsSelected?.eventReward;
  const eventConditions = eventReward?.eventConditions;
  const conditionsCompareTemp = conditionsSelected?.conditionsNotTargetReward;

  useEffect(() => {
    setConditionsCompare(conditionsCompareTemp);
  }, [conditionsCompareTemp]);

  const checkError = useCallback(() => {
    let isErr = false;
    for (let i = 0; i < conditionsCompare?.length; i += 1) {
      if (
        isEmpty(conditionsCompare[i]?.target) ||
        isEmpty(conditionsCompare[i]?.condition) ||
        isEmpty(conditionsCompare[i]?.value)
      ) {
        isErr = true;
        break;
      }
    }
    return isErr;
  }, [conditionsCompare]);

  const onAddRow = useCallback(() => {
    if (checkError()) {
      setIsRequired(true);
      return;
    }
    setIsRequired(false);
    const times = new Date().getTime();
    const initCondition = {
      key: times,
      target: '',
      condition: '',
      value: null,
      conditionDescription: '',
      conditionDetailName: '=',
      createdBy: userData?.simpleInfo?.id,
      createdByName: userData?.simpleInfo?.name,
      targetDetailName: '',
      targetName: '',
    };
    setConditionsCompare([...conditionsCompare, initCondition]);
  }, [conditionsCompare, userData, checkError]);

  useEffect(() => {
    const limitAchievement = eventConditions?.find(item => item.target === LIMIT_ACHIEVEMENT);
    const targetFrequency = eventConditions?.find(item => item.target === FREQUENCY);
    const frequencyArray = targetFrequency?.value?.split('|');
    setConditionFrequency({
      limitAchievement: limitAchievement?.value || null,
      frequencyLimit: (frequencyArray?.length > -1 && frequencyArray[0]) || null,
      frequencyTime: (frequencyArray?.length > 0 && frequencyArray[1]) || null,
    });
  }, [eventConditions]);

  const onSave = useCallback(() => {
    if (checkError()) {
      setIsRequired(true);
      return;
    }

    if (conditionFrequency?.frequencyLimit > 0 || conditionFrequency?.frequencyTime > 0) {
      if (conditionFrequency?.frequencyLimit > 0 && conditionFrequency?.frequencyTime > 0) {
        setIsInvalidValue(false);
      } else {
        setIsInvalidValue(true);
        return;
      }
    }

    setIsRequired(false);
    if (rewardIndex > -1 && conditionsCompare?.length > 0) {
      const conditionFrequencyList: some[] = [];
      if (conditionFrequency?.frequencyLimit > 0 && conditionFrequency?.frequencyTime) {
        conditionFrequencyList.push({
          target: FREQUENCY,
          condition: FREQUENCY,
          value: `${conditionFrequency?.frequencyLimit}|${conditionFrequency?.frequencyTime}`,
        });
      }
      if (conditionFrequency?.limitAchievement > 0) {
        conditionFrequencyList.push({
          target: LIMIT_ACHIEVEMENT,
          condition: LIMIT_ACHIEVEMENT,
          value: conditionFrequency?.limitAchievement,
        });
      }
      const eventConditionsNew = conditionsCompare?.concat(conditionFrequencyList);
      eventRewardList[rewardIndex].eventConditions = eventConditionsNew;
      dispatch(setEventRewardList([...eventRewardList]));
      onClose && onClose();
    }
  }, [
    dispatch,
    eventRewardList,
    rewardIndex,
    conditionsCompare,
    conditionFrequency,
    checkError,
    onClose,
  ]);

  const targetsNotTargetReward = metaTargets?.filter(
    target => target.id !== EVENT_TARGETS.EVENT_REWARD,
  );

  const checkDisabled = useCallback(() => {
    if (!(conditionsCompare?.length > 0)) {
      return true;
    }
    if (isInvalidValue || isRequired) {
      return true;
    }
  }, [conditionsCompare, isInvalidValue, isRequired]);

  return (
    <div className={`${cssClass}`} style={{ padding: '0px 20px' }}>
      <div>
        <Typography
          variant="h6"
          style={{ marginBottom: 15, fontWeight: 'bold', textAlign: 'center' }}
        >
          {isEdit ? 'Chỉnh sửa' : 'Thêm điều kiện'}
        </Typography>
      </div>
      <Formik enableReinitialize initialValues={{}} onSubmit={onSave}>
        {() => {
          return (
            <Form
              style={{
                borderRadius: 4,
                marginBottom: 26,
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <Typography style={{ color: PRIMARY, fontWeight: 'bold' }} variant="body2">
                    Điều kiện
                  </Typography>

                  <div className={`${cssClass}-condition-list`}>
                    <Row style={{ justifyContent: 'flex-end' }}>
                      {!isEdit && (
                        <Button
                          color="primary"
                          startIcon={<AddBoxOutlinedIcon style={{ borderRadius: 10 }} />}
                          onClick={onAddRow}
                        >
                          <Typography style={{ color: PRIMARY }} variant="subtitle1">
                            Thêm
                          </Typography>
                        </Button>
                      )}
                    </Row>
                    {isArray(conditionsCompare) &&
                      conditionsCompare.map((item: any, index: number) => {
                        return (
                          <div key={index}>
                            <EventConditionFormItem
                              key={index}
                              index={index}
                              dataRow={item}
                              isEdit={isEdit}
                              isDisabled={conditionIndex !== index && isEdit}
                              setDataRow={newItem => {
                                if (index > -1) {
                                  conditionsCompare[index] = newItem;
                                  setConditionsCompare([...conditionsCompare]);
                                  if (
                                    !isEmpty(conditionsCompare[index]?.target) &&
                                    !isEmpty(conditionsCompare[index]?.condition) &&
                                    !isEmpty(conditionsCompare[index]?.value)
                                  ) {
                                    setIsRequired(false);
                                  }
                                }
                              }}
                              onRemove={() => {
                                if (conditionsCompare?.length > 0 && index > -1) {
                                  conditionsCompare.splice(index, 1);
                                  setConditionsCompare([...conditionsCompare]);
                                  setIsRequired(false);
                                }
                              }}
                              targets={targetsNotTargetReward}
                              metaConditions={metaConditions}
                            />
                          </div>
                        );
                      })}
                  </div>
                  {isRequired && (
                    <div style={{ textAlign: 'center' }}>
                      <Typography style={{ color: 'red' }} variant="body2">
                        Vui lòng điền đầy đủ thông tin
                      </Typography>
                    </div>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    style={{ color: PRIMARY, fontWeight: 'bold', display: 'block' }}
                    variant="body2"
                  >
                    Thông tin giải thưởng
                  </Typography>

                  <div style={{ padding: 10 }}>
                    <Typography style={{ color: GRAY, display: 'block' }} variant="body2">
                      Loại giải
                    </Typography>
                    <Typography
                      style={{ fontWeight: 'bold', display: 'block', margin: '2px 0px 7px 0px' }}
                      variant="body2"
                    >
                      {eventReward?.name}
                    </Typography>

                    <Typography style={{ color: GRAY, display: 'block' }} variant="body2">
                      Reward Name
                    </Typography>
                    <Typography
                      style={{ fontWeight: 'bold', display: 'block', margin: '2px 0px 7px 0px' }}
                      variant="body2"
                    >
                      {eventReward?.reward?.name}
                    </Typography>

                    <Typography style={{ color: GRAY, display: 'block' }} variant="body2">
                      Số lượng áp dụng
                    </Typography>
                    <Typography
                      style={{ fontWeight: 'bold', display: 'block', margin: '2px 0px 7px 0px' }}
                      variant="body2"
                    >
                      {' '}
                      {eventReward?.quantity === UNLIMITED_NUMBER
                        ? UNLIMITED_CHARACTERS
                        : eventReward?.quantity}
                    </Typography>
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <Typography style={{ color: PRIMARY, fontWeight: 'bold' }} variant="body2">
                    Tần suất trao giải thưởng / người dùng
                  </Typography>
                  <Row>
                    <Typography style={{ color: GRAY }} variant="body2">
                      Tối đa
                    </Typography>
                    <FieldTextContent
                      name="frequencyLimit"
                      value={conditionFrequency?.frequencyLimit}
                      onChange={e => {
                        const x = Math.abs(Number(e?.target?.value));
                        if (
                          conditionFrequency?.limitAchievement > 0 &&
                          x >= conditionFrequency?.limitAchievement
                        ) {
                          setIsInvalidValue(true);
                        } else {
                          setIsInvalidValue(false);
                        }

                        setConditionFrequency({
                          ...conditionFrequency,
                          ...{ frequencyLimit: x },
                        });
                      }}
                      formControlStyle={{ width: 50, minWidth: 'unset', margin: '20px 5px 0 5px' }}
                      style={{ width: 50 }}
                      inputProps={{ maxLength: 10000, autoComplete: 'off' }}
                      inputComponent={NumberFormatCustomNonDecimal as any}
                      optional
                      disabled={disabledReward}
                    />
                    <Typography style={{ color: GRAY }} variant="body2">
                      giải thưởng trong
                    </Typography>
                    <FieldTextContent
                      name="frequencyTime"
                      value={conditionFrequency?.frequencyTime}
                      onChange={e => {
                        setConditionFrequency({
                          ...conditionFrequency,
                          ...{ frequencyTime: Math.abs(Number(e?.target?.value)) },
                        });
                        setIsInvalidValue(false);
                      }}
                      formControlStyle={{ width: 50, minWidth: 'unset', margin: '20px 5px 0 5px' }}
                      style={{ width: 50 }}
                      inputProps={{ maxLength: 10000, autoComplete: 'off' }}
                      inputComponent={NumberFormatCustomNonDecimal as any}
                      optional
                      disabled={disabledReward}
                    />
                    <Typography style={{ color: GRAY }} variant="body2">
                      ngày
                    </Typography>
                  </Row>

                  {isInvalidValue && (
                    <Row>
                      <Typography style={{ color: 'red' }} variant="caption">
                        Giá trị không hợp lệ
                      </Typography>
                    </Row>
                  )}

                  <Row>
                    <Typography style={{ color: GRAY }} variant="body2">
                      Tối đa
                    </Typography>
                    <FieldTextContent
                      name="limitAchievement"
                      value={conditionFrequency?.limitAchievement}
                      onChange={e => {
                        const z = Math.abs(Number(e?.target?.value));
                        if (
                          conditionFrequency?.frequencyLimit > 0 &&
                          z < conditionFrequency?.frequencyLimit
                        ) {
                          setIsInvalidValue(true);
                        } else {
                          setIsInvalidValue(false);
                        }

                        setConditionFrequency({
                          ...conditionFrequency,
                          ...{ limitAchievement: z },
                        });
                      }}
                      formControlStyle={{ width: 50, minWidth: 'unset', margin: '20px 5px 0 5px' }}
                      style={{ width: 50 }}
                      inputProps={{ maxLength: 10000, autoComplete: 'off' }}
                      inputComponent={NumberFormatCustomNonDecimal as any}
                      optional
                      disabled={disabledReward}
                    />
                    <Typography style={{ color: GRAY }} variant="body2">
                      giải thưởng trong toàn bộ chương trình
                    </Typography>
                  </Row>
                </Grid>
              </Grid>

              <Row style={{ marginTop: 24, justifyContent: 'flex-end' }}>
                <LoadingButton
                  variant="outlined"
                  color="primary"
                  size="large"
                  style={{ minWidth: 200, marginRight: 20 }}
                  disableElevation
                  loading={false}
                  onClick={onClose}
                >
                  Hủy
                </LoadingButton>

                {!isUpdate && (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    style={{ minWidth: 200, marginRight: 20 }}
                    color="primary"
                    disableElevation
                    loading={false}
                    disabled={checkDisabled()}
                  >
                    Xác nhận
                  </LoadingButton>
                )}
                {isUpdate && (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    style={{ minWidth: 200, marginRight: 20 }}
                    color="primary"
                    disableElevation
                    loading={false}
                    disabled={checkDisabled()}
                  >
                    Xác nhận
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
export default React.memo(EventConditionForm);
