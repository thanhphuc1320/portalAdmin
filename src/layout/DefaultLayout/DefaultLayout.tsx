import { Container, useMediaQuery } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { GREY_100 } from '../../configs/colors';
import { ROUTES_TAB } from '../../configs/routes';
import { MUI_THEME } from '../../configs/setupTheme';
import { Col, PageWrapper } from '../../modules/common/components/elements';
import LoadingIcon from '../../modules/common/components/LoadingIcon';
import {
  fetchGeneralData,
  fetchStatisticPost,
  fetchStatisticPostNotifications,
} from '../../modules/common/redux/reducer';
import { AppState } from '../../redux/reducers';
import { flatRoutes, getListRoutesActivate } from '../utils';
import DefaultAside from './DefaultAside';
import DefaultBreadcrumbs from './DefaultBreadcrumbs';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';

const mapStateToProps = (state: AppState) => {
  return {
    userData: state.account.userData,
  };
};

interface Props extends ReturnType<typeof mapStateToProps> {
  dispatch: ThunkDispatch<AppState, null, Action<string>>;
}

const DefaultLayout: React.FunctionComponent<Props> = props => {
  const { dispatch, userData } = props;
  const location = useLocation();
  const [openSideBar, setOpenSideBar] = React.useState(true);
  const matches = useMediaQuery(MUI_THEME.breakpoints.up('md'));

  React.useEffect(() => {
    setOpenSideBar(matches);
  }, [matches]);

  React.useEffect(() => {
    dispatch(fetchGeneralData());

    dispatch(fetchStatisticPostNotifications());

    dispatch(fetchStatisticPost());
    const interval = setInterval(() => {
      dispatch(fetchStatisticPost());
    }, 30000);
    return () => clearInterval(interval);
    // return () => {
    //   document.getElementById('zendesk')?.remove();
    //   const elements = document.getElementsByClassName('zopim');
    //   while (elements?.length > 0) {
    //     elements?.[0].parentNode?.removeChild(elements[0]);
    //   }
    // };
  }, [dispatch]);

  const listRoutes = React.useMemo(() => {
    return getListRoutesActivate(userData?.roleGroup?.role, flatRoutes(ROUTES_TAB));
  }, [userData]);

  return (
    <>
      {/* <Helmet
        key={`${moment()}`}
        link={[{ rel: 'shortcut icon', href: '/logo.png' }]}
        script={
          userData
            ? [
                {
                  id: 'zendesk',
                  type: 'text/javascript',
                  innerHTML: `window.$zopim || (function (d, s) {
            var z = $zopim = function (c) { z._.push(c) }, $ = z.s =
              d.createElement(s), e = d.getElementsByTagName(s)[0]; z.set = function (o) {
                z.set.
                _.push(o)
              }; z._ = []; z.set._ = []; $.async = !0; $.setAttribute("charset", "utf-8");
            $.src = "https://v2.zopim.com/?65HOiqr6wy3uprSP7044dd24nTOhZSyN"; z.t = +new Date; $.
              type = "text/javascript"; e.parentNode.insertBefore($, e)
          })(document, "script");`,
                },
              ]
            : undefined
        }
      /> */}
      <PageWrapper style={{ background: GREY_100, flexDirection: 'row' }}>
        <DefaultAside
          open={openSideBar}
          onClose={() => {
            setOpenSideBar(!openSideBar);
          }}
        />
        <Col
          style={{
            flex: 1,
            minHeight: '100vh',
            overflow: 'hidden',
          }}
        >
          <DefaultHeader />
          <DefaultBreadcrumbs />
          <Container
            style={{
              paddingTop: 16,
              maxWidth: 'none',
              flex: 1,
              padding: '16px 24px 24px 24px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <React.Suspense fallback={<LoadingIcon style={{ marginTop: 240 }} />}>
              <Switch location={location}>
                {listRoutes.map(
                  (route, index) =>
                    route.component && (
                      <Route
                        key={index}
                        exact={route.exact}
                        path={route.path}
                        component={route.component}
                      />
                    ),
                )}
              </Switch>
            </React.Suspense>
          </Container>
          <DefaultFooter />
        </Col>
      </PageWrapper>
    </>
  );
};

export default connect(mapStateToProps)(DefaultLayout);
