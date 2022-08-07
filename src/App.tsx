import 'moment/locale/vi';
import React from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { ROUTES } from './configs/routes';
import { DefaultLayout } from './layout/DefaultLayout';
import Login from './modules/auth/pages/Login';
import AuthProblemDialog from './modules/common/components/AuthProblemDialog';
import NetworkProblemDialog from './modules/common/components/NetworkProblemDialog';
import MessageSnackbar from './modules/common/components/MessageSnackbar';
import ProtectedRoute from './modules/common/components/ProtectedRoute';
import RedirectRoute from './modules/common/components/RedirectRoute';
import { AppState } from './redux/reducers';

function mapStateToProps(state: AppState) {
  return {
    router: state.router,
    auth: state.auth,
  };
}

interface Props extends ReturnType<typeof mapStateToProps> {}

const App: React.FC<Props> = props => {
  const { router, auth } = props;

  return (
    <>
      <NetworkProblemDialog />
      <AuthProblemDialog />
      <MessageSnackbar />
      <Switch location={router.location}>
        {/* <RedirectRoute auth={auth.auth} path={ROUTES.forgotPass} component={ForgotPassword} />
        <RedirectRoute auth={auth.auth} path={ROUTES.changePassword} component={ChangePassword} /> */}
        <RedirectRoute auth={auth.auth} path={ROUTES.login} component={Login} />
        <ProtectedRoute auth={auth.auth} path="/" component={DefaultLayout} />
      </Switch>
    </>
  );
};

export default connect(mapStateToProps)(App);
