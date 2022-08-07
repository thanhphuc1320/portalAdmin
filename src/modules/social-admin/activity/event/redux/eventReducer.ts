import { createAction, ActionType, getType } from 'typesafe-actions';
import { some } from 'configs/utils';

export const setEventRewardList = createAction('event/setEventRewardList', (list: some[]) => {
  return list;
})();

export const setConditionsSelected = createAction('event/setConditionsSelected', (obj: any) => {
  return obj;
})();

const actions = {
  setEventRewardList,
  setConditionsSelected,
};

export interface EventState {
  eventRewardList: some[];
  conditionsSelected: any;
}

export default function reducer(
  state: EventState = { eventRewardList: [], conditionsSelected: {} },
  action: ActionType<typeof actions>,
): EventState {
  switch (action.type) {
    case getType(setEventRewardList):
      return { ...state, eventRewardList: action.payload };
    case getType(setConditionsSelected):
      return { ...state, conditionsSelected: action.payload };
    default:
      return state;
  }
}
