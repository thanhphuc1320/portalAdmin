import { Badge } from '@material-ui/core';
import BorderColorRoundedIcon from '@material-ui/icons/BorderColorRounded';
import RemoveIcon from '@material-ui/icons/Remove';
import React from 'react';
import { WHITE } from 'configs/colors';
import { some } from '../../constants';
import { ServiceType } from 'models/permission';
import 'scss/svg.scss';
import { ReactComponent as IconlyBoldDocument } from 'svg/iconly-bold-document.svg';
import { ReactComponent as IconNotification } from 'svg/icon_notification.svg';
import { ReactComponent as IconHashtag } from 'svg/icon_number_hashtag.svg';
import { ReactComponent as IconlyicAvatar } from 'svg/ic_avatar.svg';
import { ReactComponent as IconFollower } from 'svg/ic_follower.svg';
import { ReactComponent as IconEvent } from 'svg/event.svg';
import { ReactComponent as IconReward } from 'svg/reward.svg';
import { ReactComponent as IconWinner } from 'svg/winner.svg';
import { ReactComponent as IconPin } from 'svg/icon_pin.svg';
import { ReactComponent as IconItem } from 'svg/icon_item.svg';
import { ReactComponent as IconSensor } from 'svg/word.svg';
import { ReactComponent as IconUser } from 'svg/user.svg';
import { ReactComponent as IconSource } from 'svg/sources.svg';

export const getMenuIcon = (
  name: ServiceType | string,
  statisticPost: some | undefined,
  statisticNotifications: some | undefined,
) => {
  switch (name) {
    case 'CREATE_ARTICLE':
      return <BorderColorRoundedIcon style={{ color: WHITE, width: 32, height: 32 }} />;
    case 'MANAGEMENT_ARTICLE':
      return (
        <Badge badgeContent={statisticPost?.WAITING} color="secondary">
          <IconlyBoldDocument style={{ color: WHITE, width: 27, height: 32 }} />
        </Badge>
      );
    case 'MANAGEMENT_WINNER':
      return <IconWinner style={{ color: WHITE, width: 27, height: 32 }} />;
    case 'MANAGEMENT_PIN':
      return <IconPin style={{ color: WHITE, width: 27, height: 32 }} />;
    case 'MANAGEMENT_EVENT':
      return <IconEvent style={{ color: WHITE, width: 27, height: 32 }} />;
    case 'MANAGEMENT_ITEM':
      return <IconItem style={{ color: WHITE, width: 27, height: 32 }} />;
    case 'MANAGEMENT_REWARD':
      return <IconReward style={{ color: WHITE, width: 27, height: 32 }} />;
    case 'MANAGEMENT_HASHTAG':
      return <IconHashtag style={{ color: WHITE, width: 27, height: 32 }} />;
    case 'MANAGEMENT_HASHTAG_RANKING':
      return <IconlyicAvatar style={{ color: WHITE, width: 27, height: 32 }} />;
    case 'MANAGEMENT_FOLLOWER':
      return <IconFollower style={{ color: WHITE, width: 23, height: 32 }} />;
    case 'SOURCES':
      return <IconSource style={{ color: WHITE, width: 27, height: 32 }} />;
    case 'MANAGEMENT_NOTIFICATION':
      return (
        <Badge badgeContent={statisticNotifications?.numberOfUnrespond} color="secondary">
          <IconNotification style={{ color: WHITE, width: 23, height: 32 }} />
        </Badge>
      );
    case 'MANAGEMENT_CENSOR':
      return <IconSensor style={{ color: WHITE, width: 23, height: 32 }} />;
    case 'MANAGEMENT_USER':
      return <IconUser style={{ color: WHITE, width: 23, height: 32 }} />;
    default:
      return <RemoveIcon style={{ color: WHITE, width: 12, marginLeft: 20 }} />;
  }
};

interface Props {
  name: string;
  open: boolean;
  checkIsActive?: boolean;
  statisticPost?: some;
  openBadge?: boolean;
  statisticNotifications?: some;
}

const DefaultAsideItemsIcon: React.FC<Props> = (props: Props) => {
  const { name, statisticPost, openBadge, statisticNotifications } = props;

  const getIcon = React.useMemo(() => {
    const tempStatisticPost = !openBadge ? statisticPost : undefined;
    const tempStatisticNotifications = !openBadge ? statisticNotifications : undefined;
    return getMenuIcon(name, tempStatisticPost, tempStatisticNotifications);
  }, [name, openBadge, statisticNotifications, statisticPost]);

  return <>{getIcon}</>;
};

export default DefaultAsideItemsIcon;
