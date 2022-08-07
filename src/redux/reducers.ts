import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { PersistConfig, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import { Action, createAction, getType } from 'typesafe-actions';
import accountReducer, { AccountState } from '../modules/account/redux/accountReducer';
import authReducer, { AuthState } from '../modules/auth/redux/authReducer';
import commonReducer, { CommonState } from '../modules/common/redux/reducer';
import intlReducer, { IntlState } from '../modules/intl/redux/reducer';
import eventReducer, { EventState } from 'modules/social-admin/activity/event/redux/eventReducer';
import articleReducer, { ArticleState } from 'modules/social-admin/article/redux/articleReducer';

export const clearStoreAfterLogout = createAction('clearStoreAfterLogout')();

const persistConfig: PersistConfig<any> = {
  storage,
  key: 'root',
  transforms: [],
  whitelist: ['auth', 'account', 'common'],
  // blacklist: ['router', 'intl'],
};

export interface AppState {
  router: RouterState;
  intl: IntlState;
  common: CommonState;
  auth: AuthState;
  account: AccountState;
  event: EventState;
  article: ArticleState;
}

export default (history: History) => {
  const rawRootReducer = combineReducers({
    router: connectRouter(history),
    intl: intlReducer,
    common: commonReducer,
    auth: authReducer,
    account: accountReducer,
    event: eventReducer,
    article: articleReducer,
  });

  return persistReducer(
    persistConfig,
    (state: AppState | undefined, action: Action<string>): AppState => {
      if (state && action.type === getType(clearStoreAfterLogout)) {
        return rawRootReducer(
          {
            ...state,
          },
          action,
        );
      }
      return rawRootReducer(state, action);
    },
  );
};
