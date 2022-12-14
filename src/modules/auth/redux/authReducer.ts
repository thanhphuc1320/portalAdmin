import { ActionType, createAction, getType } from 'typesafe-actions';
import { some } from '../../../constants';

export enum AuthDialog {
  login,
  loginAfterResetPass,
  forgotPassword,
  forgotPasswordOTP,
  forgotPasswordEMAIL,
  forgotPasswordREPASS,
  signUp,
  verifyAgency,
}
export interface AuthState {
  readonly auth: boolean;
  readonly authenticating: boolean;
  readonly validatingToken: boolean;
  readonly authDialog?: AuthDialog;
  readonly userData?: Readonly<some>;
  readonly messageNotify: some[];
}

export const inAction = createAction('auth/in', (skipSaga: boolean) => ({ skipSaga }))();
export const out = createAction('auth/out')();

export const setAuthenticating = createAction('auth/setAuthenticating', (val: boolean) => ({
  val,
}))();

export const setValidatingToken = createAction('auth/setValidatingToken', (val: boolean) => ({
  val,
}))();

export const setAuthDialog = createAction(
  'auth/setAuthDialog',
  (val: AuthDialog, dest?: string) => ({ val, dest }),
)();

export const closeAuthDialog = createAction('auth/closeAuthDialog')();

export const setMessageNotify = (data: some[]) => ({
  type: 'SET_MESSAGE_NOTIFY',
  payload: data,
});

const actions = {
  in_: inAction,
  out,
  setAuthenticating,
  setValidatingToken,
  setAuthDialog,
  closeAuthDialog,
};

type ActionT = ActionType<typeof actions>;

export const defaultSignUpState = {
  email: '',
  password: '',
  rePassword: '',
  telephone: '',
  username: '',
};

export default function reducer(
  state: AuthState = {
    authenticating: false,
    validatingToken: false,
    auth: false,
    messageNotify: [],
  },
  action: ActionT,
): AuthState {
  switch (action.type) {
    case getType(inAction):
      return { ...state, auth: true };
    case getType(out):
      return { ...state, auth: false };
    case getType(setAuthenticating):
      return { ...state, authenticating: action.payload.val };
    case getType(setValidatingToken):
      return { ...state, validatingToken: action.payload.val };
    case getType(setAuthDialog):
      return { ...state, authDialog: action.payload.val };
    case getType(closeAuthDialog):
      return { ...state, authDialog: undefined };

    default:
      return state;
  }
}
