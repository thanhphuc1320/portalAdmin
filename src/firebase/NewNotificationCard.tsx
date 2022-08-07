import { ButtonBase, IconButton, Typography } from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';
import { push } from 'connected-react-router';
import { STATUS_TITLE_TABLE } from 'modules/social-admin/constants';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { some } from '../constants';
import { Row } from '../modules/common/components/elements';
import { NOTIFICATION_PAGE } from '../modules/social-admin/notification/constants';
import { ReactComponent as IconPendingPost } from '../svg/icon_pending_post_grey.svg';

interface Props {
  notification: some;
  onClose: () => void;
  jsonConvert: some;
  numberOfUnread: number;
}
// const MULTIPLE_POSTS_STATUS = 'MULTIPLE_POSTS_ARE_WAITING_FOR_APPROVAL_EVENT';
const NewNotificationCard: React.FunctionComponent<Props> = props => {
  const { onClose, jsonConvert, notification, numberOfUnread } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const jsonCheckUrl = (type: string, receiverType: string) => {
    if (type) {
      if (receiverType === 'GROUP') {
        return `/notifications`;
      }
      // return `/notifications?id=${jsonConvert?.id + 1}`;
      return `/notifications?status=UNREAD`;
    }
    return jsonConvert?.extraInfos?.numberWaitingPosts < 1
      ? `/article/update?postId=${jsonConvert.extraInfos?.postId}`
      : `/?page=${NOTIFICATION_PAGE}&status=${STATUS_TITLE_TABLE[1]?.id}`;
  };

  const tempUrl = jsonCheckUrl(jsonConvert?.extraInfos?.action, jsonConvert?.receiverType);

  let mess = notification?.body;
  if (jsonConvert?.id) {
    mess = `Bạn có ${numberOfUnread} thông báo mới cần phản hồi`;
  }

  return (
    <Row
      style={{
        width: '100%',
        justifyContent: 'space-between',
      }}
    >
      <Row>
        <div
          style={{
            paddingTop: 0,
            alignSelf: 'start',
            display: 'flex',
            marginRight: 10,
            justifyContent: 'center',
          }}
        >
          <IconPendingPost style={{ width: 60, height: 38 }} />
        </div>

        <Typography
          variant="body2"
          color="textPrimary"
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            marginBottom: 4,
          }}
        >
          {mess}
        </Typography>
        <ButtonBase
          onClick={() => {
            dispatch(push(tempUrl));
          }}
          style={{ textDecoration: 'none', flex: 1 }}
        >
          <Typography
            variant="body2"
            color="primary"
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              flex: 1,
              marginBottom: 4,
              marginLeft: 4,
            }}
          >
            {' '}
            Xem và kiểm duyệt ngay
          </Typography>
        </ButtonBase>
      </Row>
      <IconButton
        style={{
          marginBottom: 20,
          padding: 0,
        }}
        onClick={onClose}
      >
        <IconClose />
      </IconButton>
    </Row>
  );
};

export default NewNotificationCard;
