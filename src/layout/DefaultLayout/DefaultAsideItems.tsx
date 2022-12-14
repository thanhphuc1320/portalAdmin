/* eslint-disable */
import { Collapse, Tooltip, Typography } from '@material-ui/core';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, shallowEqual, useSelector } from 'react-redux';
import { PINK, WHITE } from '../../configs/colors';
import { some } from '../../constants';
import { RoutesTabType } from '../../models/permission';
import { Row } from '../../modules/common/components/elements';
import { RawLink } from '../../modules/common/components/Link';
import { AppState } from '../../redux/reducers';
import { ReactComponent as ArrowIcon } from '../../svg/ic_arrow_right.svg';
import { ASIDE_MIN_WIDTH } from '../constants';
import { getListRoutesActivate, hasPermission } from '../utils';
import { ButtonRow } from './DefaultAside';
import DefaultAsideItemsIcon from './DefaultAsideItemsIcon';

const mapStateToProps = (state: AppState) => {
  return {
    router: state.router,
  };
};

interface Props extends ReturnType<typeof mapStateToProps> {
  data: RoutesTabType;
  userData: some;
  pathname: string;
  open: boolean;
  listRouterActive: some[];
}

const DefaultAsideItems: React.FC<Props> = (props: Props) => {
  const { data, pathname, open, router, listRouterActive, userData } = props;
  const [openList, setOpen] = React.useState(false);
  const { statisticPost, statisticNotifications } = useSelector(
    (state: AppState) => state.common,
    shallowEqual,
  );

  const listRoutes = React.useMemo(() => {
    return data?.subMenu ? getListRoutesActivate(userData?.roleGroup?.role, data?.subMenu) : [];
  }, [data, userData]);

  const checkPermission = React.useMemo(() => {
    const listRole = userData?.roleGroup?.role;
    return data.isModule && !data.path
      ? listRoutes.length > 0
      : hasPermission(listRole, data.listRole);
  }, [data.isModule, data.listRole, data.path, listRoutes.length, userData]);

  const checkIsActive = React.useMemo(() => {
    let openTemp = false;
    /* eslint-disable */
    listRouterActive?.forEach((item: some) => {
      if (item.name === data.name) {
        openTemp = true;
      }
    });
    return openTemp;
  }, [data.name, listRouterActive]);

  const getOpenMenu = React.useMemo(() => {
    let tempOpen = true;
    if (!open) {
      tempOpen = false;
    }
    if (openList) {
      tempOpen = false;
    }
    return tempOpen;
  }, [open, openList]);

  const getOpenItem = React.useMemo(() => {
    let tempOpen = true;
    if (!open) {
      tempOpen = false;
    }
    if (checkIsActive) {
      tempOpen = false;
    }
    return tempOpen;
  }, [checkIsActive, open]);

  React.useEffect(() => {
    setOpen(checkIsActive);
  }, [checkIsActive, pathname]);

  if (data.hidden || !checkPermission) {
    return null;
  }

  return (
    <>
      {data.subMenu ? (
        <>
          <Tooltip
            title={data.title || data.name ? <FormattedMessage id={data.title || data.name} /> : ''}
            placement="right"
          >
            <ButtonRow
              style={{
                backgroundColor: openList ? PINK : undefined,
              }}
              onClick={() => setOpen(!openList)}
            >
              <Row style={{ width: ASIDE_MIN_WIDTH, justifyContent: 'center' }}>
                <DefaultAsideItemsIcon open={getOpenMenu} name={data.name} />
              </Row>
              <Typography
                variant="body2"
                style={{
                  flex: 1,
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: 150,
                  color: 'white',
                }}
              >
                {data.title ? (
                  <FormattedMessage id={data.title} />
                ) : (
                  data.name && <FormattedMessage id={data.name} />
                )}
              </Typography>
              <ArrowIcon
                style={{
                  transition: 'all 300ms',
                  transform: openList ? 'rotate(90deg)' : 'rotate(0deg)',
                  cursor: 'pointer',
                }}
              />
            </ButtonRow>
          </Tooltip>
          <Collapse in={openList && open}>
            {listRoutes.map((v: RoutesTabType, index: number) => (
              <DefaultAsideItems
                userData={userData}
                key={index}
                open={open}
                listRouterActive={listRouterActive}
                data={v}
                pathname={pathname}
                router={router}
              />
            ))}
          </Collapse>
        </>
      ) : (
        <Tooltip
          title={data.title || data.name ? <FormattedMessage id={data.title || data.name} /> : ''}
          placement="right"
        >
          <RawLink
            to={{
              pathname: data.path,
              state: {
                ...router.location.state,
                [`${data.path}`]: true,
              },
            }}
            style={{ display: 'flex', flex: 1 }}
          >
            <ButtonRow
              style={{
                backgroundColor: checkIsActive ? PINK : undefined,
                justifyContent: 'space-between',
              }}
            >
              <Row>
                <Row style={{ width: ASIDE_MIN_WIDTH, justifyContent: 'center' }}>
                  <DefaultAsideItemsIcon
                    open={getOpenItem}
                    name={data.name}
                    checkIsActive={checkIsActive}
                    statisticPost={statisticPost}
                    statisticNotifications={statisticNotifications}
                    openBadge={open}
                  />
                </Row>
                <Typography
                  variant="body2"
                  style={{
                    flex: 1,
                    fontWeight: data.isModule ? 500 : undefined,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: 125,
                    color: 'white',
                  }}
                >
                  {data.title ? (
                    <FormattedMessage id={data.title} />
                  ) : (
                    data.name && <FormattedMessage id={data.name} />
                  )}
                </Typography>
              </Row>
              {(open && data.name === 'MANAGEMENT_ARTICLE') ||
              data.name === 'MANAGEMENT_NOTIFICATION' ? (
                <Row
                  style={{
                    backgroundColor: '#8F0047',
                    borderRadius: 10,
                    color: WHITE,
                    width: 48,
                    height: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    style={{
                      color: 'white',
                    }}
                  >
                    {data.name === 'MANAGEMENT_ARTICLE' && statisticPost?.WAITING}
                    {data.name === 'MANAGEMENT_NOTIFICATION' &&
                      statisticNotifications?.numberOfUnread}
                  </Typography>
                </Row>
              ) : (
                ''
              )}
            </ButtonRow>
          </RawLink>
        </Tooltip>
      )}
    </>
  );
};

export default connect(mapStateToProps)(DefaultAsideItems);
