/* eslint-disable no-nested-ternary */
import React from 'react';
import { LoadingComponentProps } from 'react-loadable';
import { Button, Container, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { PageWrapper } from './elements';
import LoadingIcon from './LoadingIcon';

const RouteLoading: React.FC<LoadingComponentProps> = props => {
  const { error, pastDelay, retry } = props;

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageWrapper>
        <Container
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {error ? (
            <>
              <Typography variant="body2" color="error">
                <FormattedMessage id="asyncModuleLoadError" />
              </Typography>
              <Button color="secondary" variant="contained" onClick={retry}>
                <FormattedMessage id="retry" />
              </Button>
            </>
          ) : pastDelay ? (
            <LoadingIcon />
          ) : (
            <></>
          )}
        </Container>
      </PageWrapper>
    </div>
  );
};

export default RouteLoading;
