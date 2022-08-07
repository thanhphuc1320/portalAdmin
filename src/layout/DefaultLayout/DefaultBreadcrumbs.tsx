import { Button, Card, Theme, Typography, withStyles } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import queryString from 'query-string';
import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { GREY_500, PRIMARY, WHITE } from '../../configs/colors';
import { ROUTES, ROUTES_TAB } from '../../configs/routes';
import { some } from '../../constants';
import { Row } from '../../modules/common/components/elements';
import { goToAction, isHasPermission } from '../../modules/common/redux/reducer';
import { AppState } from '../../redux/reducers';
import { ReactComponent as IconPlus } from '../../svg/Plus.svg';
import { getListRoutesContain } from '../utils';

interface Props {}

const ColorButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(WHITE),
    backgroundColor: PRIMARY,
    '&:hover': {
      backgroundColor: PRIMARY,
    },
  },
}))(Button);

const DefaultBreadcrumbs: React.FC<Props> = () => {
  const intl = useIntl();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const history = useHistory();
  const { location } = history;
  const { pathname, search } = location;
  const queryParams = (queryString.parse(search) as unknown) as any;

  const isActive = React.useMemo(() => {
    return dispatch(isHasPermission(pathname));
  }, [dispatch, pathname]);

  const getList = React.useMemo(() => {
    return getListRoutesContain(ROUTES_TAB, pathname);
  }, [pathname]);

  const getTitle = React.useMemo(() => {
    const currentPath = getList[0];
    if (currentPath && currentPath.isModule && (currentPath.title || currentPath.name)) {
      return currentPath.title || currentPath.name;
    }

    const currentPathSub = getList[1];
    if (
      currentPathSub &&
      currentPathSub.isModule &&
      (currentPathSub.title || currentPathSub.name)
    ) {
      return currentPathSub.title || currentPathSub.name;
    }
    return null;
  }, [getList]);

  const getSubTitle = React.useMemo(() => {
    const currentPath = getList[0];
    const currentPathSub = getList[1];
    if (currentPath && !currentPathSub && (currentPath.title || currentPath.subName)) {
      return currentPath.title || currentPath.subName;
    }

    if (currentPathSub && (currentPathSub.title || currentPathSub.subName)) {
      return currentPathSub.title || currentPathSub.subName;
    }
    return null;
  }, [getList]);

  if (!isActive) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{getTitle && intl.formatMessage({ id: getTitle })}</title>
      </Helmet>
      <Card
        style={{
          boxShadow: '5px 5px 9px rgba(0, 0, 0, 0.05), -5px -5px 9px rgba(0, 0, 0, 0.05)',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Row style={{ justifyContent: 'space-between', width: '100%' }}>
          <Row>
            <Typography variant="h5" style={{ marginRight: '14px' }}>
              {queryParams?.breadcrumbName ?? <FormattedMessage id={getTitle || ' '} />}
            </Typography>
            {getList.map((v: some, index: number) => (
              <Row key={index}>
                {index === getList.length - 1 && !v.isModule ? (
                  <Typography variant="body1">
                    {queryParams?.breadcrumbName ? (
                      ''
                    ) : (
                      <>
                        <FiberManualRecordIcon
                          style={{ color: GREY_500, fontSize: 6, margin: '0px 12px 2px 0px' }}
                        />
                        {(v.title || v.name) && <FormattedMessage id={v.title || v.name} />}
                      </>
                    )}
                  </Typography>
                ) : (
                  <></>
                )}
              </Row>
            ))}
          </Row>
          {!!getSubTitle && (
            <ColorButton
              variant="contained"
              startIcon={<IconPlus style={{ marginLeft: 8 }} />}
              onClick={() =>
                dispatch(
                  goToAction({
                    pathname: pathname === '/' ? ROUTES.article.create : `${pathname}/create`,
                  }),
                )
              }
            >
              <Typography variant="body2" style={{ color: WHITE }}>
                {getSubTitle}
              </Typography>
            </ColorButton>
          )}
        </Row>
      </Card>
    </>
  );
};

export default DefaultBreadcrumbs;
