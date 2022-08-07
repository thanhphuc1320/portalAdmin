import { createAction, ActionType, getType } from 'typesafe-actions';
import { some } from 'configs/utils';

export const setFlightList = createAction('article/setFlightList', (list: some[]) => {
  return list;
})();

const actions = {
  setFlightList,
};

export interface ArticleState {
  flightList: some[];
}

export default function reducer(
  state: ArticleState = { flightList: [] },
  action: ActionType<typeof actions>,
): ArticleState {
  switch (action.type) {
    case getType(setFlightList):
      return { ...state, flightList: action.payload };
    default:
      return state;
  }
}
