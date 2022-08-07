import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { setNotistackMessage } from '../redux/reducer';
import { snackbarSetting } from 'modules/common/components/elements';
import { isEmpty } from 'configs/utils';

const mapStateToProps = (state: AppState) => {
  return {
    router: state.router,
    notistackMessage: state.common.notistackMessage,
    notistackType: state.common.notistackType,
  };
};
interface Props extends ReturnType<typeof mapStateToProps> {
  dispatch: ThunkDispatch<AppState, null, Action<string>>;
}

const MessageSnackbar: React.FC<Props> = props => {
  const { dispatch, notistackMessage, notistackType } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const shownotistackMessage = useCallback(() => {
    if (!isEmpty(notistackMessage)) {
      enqueueSnackbar(
        notistackMessage,
        snackbarSetting(key => closeSnackbar(key), {
          color: notistackType,
        }),
      );
      dispatch(setNotistackMessage('', 'error'));
    }
  }, [closeSnackbar, dispatch, enqueueSnackbar, notistackMessage, notistackType]);

  useEffect(() => {
    notistackMessage && shownotistackMessage();
  }, [notistackMessage, shownotistackMessage]);

  return <></>;
};

export default connect(mapStateToProps)(MessageSnackbar);
