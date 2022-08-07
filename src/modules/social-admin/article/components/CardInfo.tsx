import { Typography } from '@material-ui/core';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { GREY_100, GREY_500, PRIMARY, PRIMARY_LIGHT } from '../../../../configs/colors';
// import { some } from '../../../../constants';
import { ReactComponent as Activity } from '../../../../svg/icon-serv-activities.svg';
import { ReactComponent as Flight } from '../../../../svg/icon-serv-flight.svg';
import { ReactComponent as Hotel } from '../../../../svg/icon-serv-hotel.svg';
import { ReactComponent as Train } from '../../../../svg/icon-serv-train.svg';
import { CardCustom, Col, Row } from '../../../common/components/elements';

export const GreyTextCard = styled.div`
  padding: 4px 12px;
  background-color: ${GREY_100};
  border-radius: 4;
`;

interface Props {
  countHotel?: number;
  countFlight?: number;
  serviceType: string;
  onChange(value: string): void;
  isHideHotel?: boolean;
  isHideFlight?: boolean;
  isHideTrain?: boolean;
  isHideActivity?: boolean;
}

const CardInfo: React.FC<Props> = props => {
  const {
    onChange,
    serviceType,
    countFlight,
    isHideHotel,
    isHideFlight,
    isHideTrain,
    isHideActivity,
  } = props;

  return (
    <Row style={{ justifyContent: 'space-between', marginBottom: 20 }}>
      {!isHideHotel && (
        <CardCustom
          style={{
            marginRight: 25,
            maxWidth: 369,
            backgroundColor: serviceType === 'HOTEL' ? PRIMARY_LIGHT : undefined,
          }}
          onClick={() => onChange('HOTEL')}
        >
          <Row>
            <Hotel style={{ marginRight: 16 }} />
            <Col>
              <Typography
                variant="body1"
                style={{ color: serviceType === 'HOTEL' ? PRIMARY : GREY_500 }}
              >
                <FormattedMessage id="HOTEL" />
              </Typography>
            </Col>
          </Row>
        </CardCustom>
      )}

      {!isHideFlight && (
        <CardCustom
          style={{
            marginRight: 25,
            maxWidth: 369,
            backgroundColor: serviceType === 'FLIGHT' ? PRIMARY_LIGHT : undefined,
          }}
          onClick={() => onChange('FLIGHT')}
        >
          <Row>
            <Flight style={{ marginRight: 16 }} />
            <Col>
              <Typography
                variant="body1"
                style={{
                  color: serviceType === 'FLIGHT' ? PRIMARY : GREY_500,
                }}
              >
                <FormattedMessage id="FLIGHT" /> ({countFlight})
              </Typography>
            </Col>
          </Row>
        </CardCustom>
      )}

      {!isHideTrain && (
        <CardCustom
          style={{
            marginRight: 25,
            maxWidth: 369,
            backgroundColor: serviceType === 'TRAIN' ? PRIMARY_LIGHT : undefined,
          }}
          onClick={() => onChange('TRAIN')}
        >
          <Row>
            <Train style={{ marginRight: 16 }} />
            <Col>
              <Typography
                variant="body1"
                style={{
                  color: serviceType === 'TRAIN' ? PRIMARY : GREY_500,
                }}
              >
                <FormattedMessage id="TRAIN" />
              </Typography>
            </Col>
          </Row>
        </CardCustom>
      )}

      {!isHideActivity && (
        <CardCustom
          style={{
            marginRight: 25,
            maxWidth: 369,
            backgroundColor: serviceType === 'ACTIVITY' ? PRIMARY_LIGHT : undefined,
          }}
          onClick={() => onChange('ACTIVITY')}
        >
          <Row>
            <Activity style={{ marginRight: 16 }} />
            <Col>
              <Typography
                variant="body1"
                style={{ color: serviceType === 'ACTIVITY' ? PRIMARY : GREY_500 }}
              >
                <FormattedMessage id="ACTIVITY" />
              </Typography>
            </Col>
          </Row>
        </CardCustom>
      )}
    </Row>
  );
};

export default CardInfo;
