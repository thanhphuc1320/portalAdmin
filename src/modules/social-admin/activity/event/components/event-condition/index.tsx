import {
  Paper,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { fetchThunk } from 'modules/common/redux/thunk';
import { setNotistackMessage } from 'modules/common/redux/reducer';
import { setConditionsSelected } from 'modules/social-admin/activity/event/redux/eventReducer';
import { API_PATHS } from 'configs/API';
import { BLACK, GRAY, GREY_100, PRIMARY } from 'configs/colors';
import { some, isEmpty } from 'configs/utils';
import EventConditionDialog from './EventConditionDialog';
import EventConditionTable from './EventConditionTable';
import { Row } from 'modules/common/components/elements';
import {
  EVENT_TARGETS,
  FREQUENCY,
  LIMIT_ACHIEVEMENT,
} from 'modules/social-admin/activity/event/constants';
import { GREY_400 } from 'configs/colors';
import './style.scss';

const cssClass = 'event-condition-paper';

interface Props {
  eventRewardListFilter: some[];
  disabledReward: boolean;
}

const EventReward: React.FC<Props> = props => {
  const { eventRewardListFilter, disabledReward } = props;
  const eventRewardList = useSelector((state: AppState) => state.event.eventRewardList);
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [showConditionDialog, setShowConditionDialog] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<string | false>('panel-0');
  const [metaTargets, setMetaTargets] = useState<some[]>([]);
  const [metaConditions, setMetaConditions] = useState<some[]>([]);

  const getTargets = useCallback(async () => {
    const json = await dispatch(fetchThunk(`${API_PATHS.getAdminEventTargets}`, 'get'));
    if (json?.code === 200) {
      setMetaTargets(json?.data || []);
    } else {
      json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
    }
  }, [dispatch]);

  const getConditions = useCallback(async () => {
    const json = await dispatch(
      fetchThunk(`${API_PATHS.getAdminEventConditions}?type=LOGIC`, 'get'),
    );
    if (json?.code === 200) {
      setMetaConditions(json?.data || []);
    } else {
      json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
    }
  }, [dispatch]);

  useEffect(() => {
    getTargets();
    getConditions();
  }, [getTargets, getConditions]);

  const getArrayTypesEventReward = useCallback(() => {
    const types =
      metaTargets?.find(target => target.id === EVENT_TARGETS.EVENT_REWARD)?.types || [];
    return types?.map(type => type?.id);
  }, [metaTargets]);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const typesEventReward = getArrayTypesEventReward();

  return (
    <Paper className={`${cssClass}`}>
      <div className={`${cssClass}-head`}>
        <Typography variant="subtitle2">
          ??i???u ki???n nh???n th?????ng ({eventRewardListFilter?.length || 0})
        </Typography>
      </div>
      <div className={`${cssClass}-body`}>
        {!isEmpty(eventRewardListFilter) &&
          eventRewardListFilter?.map((item: any, rewardIndex: number) => {
            const tempEventConditions: some[] = item?.eventConditions || [];
            const conditionsNotTargetReward = tempEventConditions?.filter(
              item2 => !typesEventReward?.includes(item2?.target),
            );

            const limitAchievement = tempEventConditions?.find(
              item3 => item3?.target === LIMIT_ACHIEVEMENT,
            );
            const targetFrequency = tempEventConditions?.find(item => item?.target === FREQUENCY);
            const frequencyArray = targetFrequency?.value?.split('|');
            const conditionFrequency = {
              limitAchievement: limitAchievement?.value || null,
              frequencyLimit: (frequencyArray?.length > -1 && frequencyArray[0]) || null,
              frequencyTime: (frequencyArray?.length > 0 && frequencyArray[1]) || null,
            };

            return (
              <Accordion
                key={rewardIndex}
                expanded={expanded === `panel-${rewardIndex}`}
                onChange={handleChange(`panel-${rewardIndex}`)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <div className={`${cssClass}-reward-head`}>
                    <div className={`${cssClass}-reward-head-left`}>
                      <Typography variant="subtitle2" style={{ color: PRIMARY }}>
                        {item?.name} ({conditionsNotTargetReward?.length || 0})
                      </Typography>
                    </div>
                    <div className={`${cssClass}-reward-head-right`}>
                      {!disabledReward && (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={e => {
                            dispatch(
                              setConditionsSelected({
                                isEdit: false,
                                conditionIndex: -1,
                                rewardIndex: rewardIndex,
                                eventReward: item,
                                conditionsNotTargetReward: conditionsNotTargetReward,
                                metaTargets: metaTargets,
                                metaConditions: metaConditions,
                              }),
                            );
                            e.stopPropagation();
                            setShowConditionDialog(true);
                          }}
                        >
                          Th??m
                        </Button>
                      )}
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails style={{ backgroundColor: GREY_100 }}>
                  <div className={`${cssClass}-condition`}>
                    <div className={`${cssClass}-condition-top`}>
                      {!isEmpty(conditionsNotTargetReward) && (
                        <EventConditionTable
                          key={rewardIndex}
                          rewardIndex={rewardIndex}
                          loading={false}
                          disabledReward={disabledReward}
                          metaConditions={metaConditions}
                          conditionsNotTargetReward={conditionsNotTargetReward}
                          targetFrequency={targetFrequency}
                          limitAchievement={limitAchievement}
                          onEditIndex={(e, conditionIndex) => {
                            dispatch(
                              setConditionsSelected({
                                isEdit: true,
                                rewardIndex: rewardIndex,
                                conditionIndex: conditionIndex,
                                eventReward: item,
                                conditionsNotTargetReward: conditionsNotTargetReward,
                                metaTargets: metaTargets,
                                metaConditions: metaConditions,
                              }),
                            );
                            e.stopPropagation();
                            setShowConditionDialog(true);
                          }}
                        />
                      )}
                    </div>
                    <div className={`${cssClass}-condition-bottom`}>
                      <div className={`${cssClass}-condition-bottom-infos`}>
                        <Typography
                          variant="caption"
                          style={{ color: BLACK, fontWeight: 'bold', marginRight: 35 }}
                        >
                          T???n su???t trao gi???i th?????ng / ng?????i d??ng
                        </Typography>

                        <Typography variant="body2" style={{ color: GRAY, marginRight: 35 }}>
                          - T???i ??a{' '}
                          <Typography style={{ color: BLACK, fontWeight: 'bold' }}>
                            {conditionFrequency?.frequencyLimit > 0
                              ? conditionFrequency?.frequencyLimit
                              : '...'}
                          </Typography>{' '}
                          gi???i th?????ng trong{' '}
                          <Typography style={{ color: BLACK, fontWeight: 'bold' }}>
                            {conditionFrequency?.frequencyTime > 0
                              ? conditionFrequency?.frequencyTime
                              : '...'}
                          </Typography>{' '}
                          ng??y
                        </Typography>

                        <Typography variant="body2" style={{ color: GRAY }}>
                          - T???i ??a{' '}
                          <Typography style={{ color: BLACK, fontWeight: 'bold' }}>
                            {conditionFrequency?.limitAchievement > 0
                              ? conditionFrequency?.limitAchievement
                              : '...'}
                          </Typography>{' '}
                          gi???i th?????ng cho to??n b??? ch????ng tr??nh
                        </Typography>
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            );
          })}

        {isEmpty(eventRewardList) && (
          <div className={`${cssClass}-body-empty`}>
            <div className={`${cssClass}-body-empty`}>
              <Row style={{ justifyContent: 'center', marginTop: 50 }}>
                <Typography variant="subtitle1" style={{ color: GREY_400 }}>
                  HI???N CH??A C?? ??I???U KI???N NH???N TH?????NG
                </Typography>
              </Row>
              <Row style={{ justifyContent: 'center', marginTop: 15 }}>
                <Typography variant="body2" style={{ color: 'red' }}>
                  Vui l??ng th??m ??i???u ki???n nh???n th?????ng
                </Typography>
              </Row>
            </div>
          </div>
        )}
      </div>
      <EventConditionDialog
        open={showConditionDialog}
        setOpen={setShowConditionDialog}
        disabledReward={disabledReward}
      />
    </Paper>
  );
};
export default React.memo(EventReward);
