import React, { useState, useEffect } from 'react';
import { Box, Button, DialogActions, Typography } from '@material-ui/core';
import { set, get } from 'js-cookie';
import { useSnackbar } from 'notistack';
import GoogleLogin from 'react-google-login';
import { Controller, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { API_PATHS } from '../../../configs/API';
import { BLUE, GREY_500 } from '../../../configs/colors';
import { isEmpty } from '../../../configs/utils';
import { some, SUCCESS_CODE } from '../../../constants';
import { AppState } from '../../../redux/reducers';
import { ReactComponent as IconGoogle } from '../../../svg/ic_google.svg';
import ConfirmDialogLogin from '../../common/components/ConfirmDialogLogin';
import { Col, Row, snackbarSetting } from '../../common/components/elements';
import FormControlTextField from '../../common/components/FormControlTextField';
import LoadingButton from '../../common/components/LoadingButton';
import { fetchThunk } from '../../common/redux/thunk';
import { ACCESS_TOKEN, USER_DATA, CA_ID, googleInfo } from '../constants';
import { authIn } from '../redux/authThunks';

interface Props {}

const LoginForm: React.FC<RouteComponentProps<any> & Props> = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = useState<null | some>(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { handleSubmit, control } = useForm({
    defaultValues: { account: '', password: '' },
  });

  useEffect(() => {
    if (get(ACCESS_TOKEN) && get(USER_DATA)) {
      const tempData = get(USER_DATA) || '';
      const data = JSON.parse(tempData);
      dispatch(authIn(data));
    }
  }, [dispatch]);

  const onSubmit = async (values: { account: any; password: any }) => {
    try {
      setLoading(true);
      // const res: some = await actionLogin({ ...data });
      // handleResLogin(res);
      const json = await dispatch(
        fetchThunk(
          API_PATHS.login,
          'post',
          JSON.stringify({ account: values.account, password: values.password }),
          false,
        ),
      );
      if (json?.code === SUCCESS_CODE) {
        set(ACCESS_TOKEN, json.data?.loginToken);
        dispatch(authIn(json.data));
        localStorage.setItem(CA_ID, '9999');
      } else {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleOauth = async (dataViaGG = {}) => {
    try {
      setLoading(true);
      const json = await dispatch(
        fetchThunk(API_PATHS.actionLoginOauth, 'post', JSON.stringify({ ...dataViaGG }), false),
      );
      if (json?.code === SUCCESS_CODE) {
        set(ACCESS_TOKEN, json.data?.loginToken);
        dispatch(authIn(json.data));
      } else {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const responseOnSuccessGoogle = async (response: any) => {
    localStorage.setItem(CA_ID, '9999');
    const dataViaFbGg = {
      accessToken: response.tokenId || '',
      type: 'GOOGLE',
    };
    handleOauth(dataViaFbGg);
  };
  const responseOnFailureGoogle = () => {};
  const onClose = () => setOpen(null);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: 500 }} autoComplete="none">
        <Col style={{ padding: '36px 30px' }}>
          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
            <FormattedMessage id="loginToSystem" />
          </Typography>
          <Controller
            as={React.forwardRef((itemProps: any, ref) => (
              <FormControlTextField
                {...itemProps}
                formControlStyle={{ width: '100%', marginTop: 16 }}
                label={<FormattedMessage id="userName" />}
                placeholder="Nhập User name"
                inputProps={{ maxLength: 50, autoComplete: 'none' }}
                optional
                inputRef={ref}
              />
            ))}
            name="account"
            control={control}
          />
          <Controller
            as={React.forwardRef((itemProps: any, ref) => (
              <FormControlTextField
                {...itemProps}
                formControlStyle={{ width: '100%', marginTop: 12 }}
                label={<FormattedMessage id="password" />}
                placeholder="Nhập mật khẩu"
                inputProps={{ maxLength: 20, autoComplete: 'none' }}
                type="password"
                optional
                inputRef={ref}
              />
            ))}
            name="password"
            control={control}
          />
          <Row style={{ marginTop: '18px', justifyContent: 'space-between' }}>
            <LoadingButton
              style={{
                minWidth: 120,
                width: '100%',
                height: 36,
                background: BLUE,
              }}
              type="submit"
              variant="contained"
              color="secondary"
              disableElevation
              loading={loading}
            >
              <Typography variant="subtitle2">
                <FormattedMessage id="login" />
              </Typography>
            </LoadingButton>
          </Row>
          <GoogleLogin
            clientId={googleInfo.ID}
            buttonText="Login"
            onSuccess={responseOnSuccessGoogle}
            onFailure={responseOnFailureGoogle}
            cookiePolicy="single_host_origin"
            render={(renderProps: any) => (
              <Button
                style={{
                  minWidth: 120,
                  width: '100%',
                  height: 36,
                  margin: '16px 0',
                }}
                variant="outlined"
                color="primary"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: GREY_500,
                  }}
                >
                  <IconGoogle style={{ marginRight: 12 }} />
                  <Typography variant="subtitle2">
                    <FormattedMessage id="loginWithGoogle" />
                  </Typography>
                </Box>
              </Button>
            )}
          />
        </Col>
      </form>
      <ConfirmDialogLogin
        titleLabel={
          <Typography variant="subtitle1" style={{ margin: '12px 16px' }}>
            <FormattedMessage id="IDS_LOGIN_FAIL" />
          </Typography>
        }
        maxWidth="xs"
        open={!isEmpty(open)}
        onClose={onClose}
        onReject={onClose}
        onAccept={onClose}
        footer={
          <DialogActions
            style={{
              padding: 16,
              justifyContent: 'flex-end',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <Box>
              <LoadingButton
                variant="contained"
                color="secondary"
                size="medium"
                style={{ minWidth: 108 }}
                onClick={onClose}
                disableElevation
              >
                <FormattedMessage id="IDS_CHAT_CLOSE" />
              </LoadingButton>
            </Box>
          </DialogActions>
        }
      >
        <Typography variant="body2" style={{ margin: '24px 16px 8px 16px' }}>
          <FormattedMessage id="IDS_LOGIN_FAIL_MESSAGE" />
          &nbsp;
          <b>{open?.id}</b>
        </Typography>
      </ConfirmDialogLogin>
    </>
  );
};

export default withRouter(LoginForm);
