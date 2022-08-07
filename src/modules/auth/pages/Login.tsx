import { Paper, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import { useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import { isEmpty } from '../../../configs/utils';
import { Col, PageContainer } from '../../common/components/elements';
import { UUID } from '../constants';
import { GREY_400 } from '../../../configs/colors';
import BgLogin from '../../../svg/login_banner.svg';
import { ReactComponent as LogoVNTravel } from '../../../svg/ic_logoBanner.svg';
import LoginForm from '../components/LoginForm';

interface Props {}
const Login: React.FC<Props> = () => {
  const intl = useIntl();

  const fetchDeviceId = async () => {
    if (isEmpty(localStorage.getItem(UUID))) {
      localStorage.setItem(UUID, uuidv4());
    }
  };

  useEffect(() => {
    fetchDeviceId(); // eslint-disable-next-line
  }, []);

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'login' })}</title>
      </Helmet>
      <PageContainer>
        <Paper
          elevation={6}
          style={{
            display: 'flex',
            borderRadius: '12px',
            flexDirection: 'row',
          }}
        >
          <Col
            style={{
              position: 'relative',
              backgroundImage: `url(${BgLogin})`,
              backgroundSize: 'cover',
              borderRadius: '12px 0px 0px 12px',
              marginLeft: -3,
              marginTop: -2,
              width: 400,
              padding: 32,
              marginBottom: -5,
            }}
          >
            <LogoVNTravel />
          </Col>
          <LoginForm />
        </Paper>
        <Typography variant="body2" style={{ marginTop: 32, textAlign: 'center', color: GREY_400 }}>
          {`${new Date().getFullYear()} VNTravel Group. All rights reserved`}
        </Typography>
      </PageContainer>
    </>
  );
};

export default Login;
