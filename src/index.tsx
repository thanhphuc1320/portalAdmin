import { MuiThemeProvider } from '@material-ui/core';
import { ConnectedRouter } from 'connected-react-router';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';
import App from './App';
import { MUI_THEME, THEME } from './configs/setupTheme';
import './index.scss';
import '../src/scss/app.scss';
import ConnectedIntlProvider from './modules/intl/components/ConnectedIntlProvider';
import configureStore, { history } from './redux/configureStore';
import * as serviceWorker from './serviceWorker';
import Firebase from './firebase/Firebase';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    // eslint-disable-next-line func-names
    .then(function(registration) {
      console.log('Registration successful, scope is:', registration.scope);
    })
    // eslint-disable-next-line func-names
    .catch(function(err) {
      console.log('Service worker registration failed, error:', err);
    });
}

const store = configureStore({});
const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <PersistGate loading={null} persistor={persistor}>
        <ConnectedIntlProvider>
          <ThemeProvider theme={THEME}>
            <MuiThemeProvider theme={MUI_THEME}>
              <SnackbarProvider maxSnack={3}>
                <Firebase>
                  <App />
                </Firebase>
              </SnackbarProvider>
            </MuiThemeProvider>
          </ThemeProvider>
        </ConnectedIntlProvider>
      </PersistGate>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
