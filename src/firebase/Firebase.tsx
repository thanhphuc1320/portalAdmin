import { Paper } from '@material-ui/core';
import { API_PATHS } from 'configs/API';
import { fetchThunk } from 'modules/common/redux/thunk';
import { OptionsObject, useSnackbar } from 'notistack';
import * as React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { setMessageNotify } from '../modules/auth/redux/authReducer';
import { AppState } from '../redux/reducers';
import firebase from './firebaseConfig';
import NewNotificationCard from './NewNotificationCard';

interface Props {}
// export const firebaseUnregister = () => {
//   return async (dispatch: any) => {
//     const messaging = firebase.messaging();
//     messaging
//       .requestPermission()
//       .then(async () => {
//         const token = await messaging.getToken();
//         if (token) {
//           await dispatch(fetchThunk(`${API_PATHS.firebaseUnregister}?token=${token}`, 'delete'));
//           remove(ACCESS_TOKEN);
//         }
//       })
//       .catch(err => {});
//   };
// };
const Firebase: React.FunctionComponent<Props> = props => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { messageNotify } = useSelector((state: AppState) => state.auth, shallowEqual);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const messaging = firebase.messaging();

  // React.useEffect(() => {
  // messaging
  //   .requestPermission()
  //   .then(async () => {
  //     const token = await messaging.getToken();
  //     if (token) {
  //       await dispatch(
  //         fetchThunk(
  //           `${API_PATHS.firebase} `,
  //           'post',
  //           JSON.stringify({ platform: 'WEB', token }),
  //         ),
  //       );
  //     }
  //   })
  //   .catch(err => {});
  // }, [messaging]);

  React.useEffect(() => {
    messaging.onMessage(async (res: any) => {
      dispatch(setMessageNotify([...(messageNotify || []), res?.data]));

      const tempData = res.data?.data;
      const strConVert = res?.notification?.body?.replaceAll('"', '');
      const json = tempData?.replaceAll(strConVert, '');
      const jsonConvert = JSON.parse(json);

      const actionStatisticNotifications = await dispatch(
        fetchThunk(API_PATHS.statisticNotifications, 'get'),
      );

      enqueueSnackbar('message', {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        preventDuplicate: false,
        autoHideDuration: 30000,
        // persist: true,
        content: (key: string) => (
          <div
            style={{
              minWidth: 400,
              padding: '12px 16px',
              // display: jsonConvert?.id ? 'none' : 'block',
            }}
          >
            <Paper
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                justifyContent: 'space-between',
                borderRadius: 8,
                marginBottom: 8,
                width: '100%',
              }}
            >
              <NewNotificationCard
                jsonConvert={jsonConvert}
                numberOfUnread={actionStatisticNotifications?.data?.numberOfUnread}
                notification={res?.notification}
                onClose={() => closeSnackbar(key)}
              />
            </Paper>
          </div>
        ),
      } as OptionsObject);
    });
  }, [closeSnackbar, dispatch, enqueueSnackbar, messageNotify, messaging]);
  return <>{props?.children}</>;
};

export default Firebase;
