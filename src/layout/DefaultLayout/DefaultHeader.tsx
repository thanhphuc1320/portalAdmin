import { AppBar } from '@material-ui/core';
import * as React from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { GREEN_50, GREY_300 } from '../../configs/colors';
import Badge from '../../modules/account/component/Badge';
import { Row } from '../../modules/common/components/elements';
import { ReactComponent as Logo } from '../../svg/logo.svg';
import { HEADER_HEIGHT } from '../constants';

interface Props {
  noSticky?: boolean;
}

const DefaultHeader: React.FunctionComponent<Props> = props => {
  const { noSticky } = props;
  return (
    <AppBar
      position={noSticky ? 'relative' : 'sticky'}
      style={{
        height: HEADER_HEIGHT,
        backgroundColor: GREEN_50,
        boxShadow: 'none',
        borderRadius: 0,
        borderBottom: `1px solid ${GREY_300}`,
      }}
    >
      <Row style={{ height: '100%', paddingRight: '16px' }}>
        <Row
          style={{
            marginLeft: '24px',
            justifyContent: 'flex-start',
          }}
        >
          <Logo style={{ height: 36 }} />
        </Row>
        <Row style={{ flex: 1, justifyContent: 'flex-end', marginRight: 24 }}>
          <Badge />
        </Row>
      </Row>
    </AppBar>
  );
};

export default DefaultHeader;
