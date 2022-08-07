import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@material-ui/core';
import { CardCustom, Col, Row } from 'modules/common/components/elements';
import styled from 'styled-components';
import { GREY_100, GREY_500, PRIMARY, PRIMARY_LIGHT } from 'configs/colors';
import { ReactComponent as Flight } from 'svg/icon-serv-flight.svg';
import { ReactComponent as Hotel } from 'svg/icon-serv-hotel.svg';
import { ReactComponent as Location } from 'svg/location.svg';

export const GreyTextCard = styled.div`
  padding: 4px 12px;
  background-color: ${GREY_100};
  border-radius: 4;
`;

interface Props {
  countHotel?: number;
  countFlight?: number;
  serviceType: string;
  onChange?(value: string): void;
}

const CardHotelItem: React.FC<Props> = props => {
  const { serviceType } = props;
  return (
    <Row style={{ justifyContent: 'center', marginBottom: 20, marginTop: 20 }}>
      <CardCustom
        style={{
          marginRight: 25,
          backgroundColor: serviceType === 'FLIGHT' ? PRIMARY_LIGHT : '#E5EBED',
          width: 150,
          height: 40,
          borderRadius: '4px',
          flex: 'none',
          padding: '0 5px',
          justifyContent: 'center',
        }}
        // onClick={() => {
        //   onChange('FLIGHT');
        // }}
      >
        <Row>
          <Flight style={{ marginRight: 10, width: 20, height: 20 }} />
          <Col>
            <Typography
              variant="body1"
              style={{
                color: serviceType === 'FLIGHT' ? PRIMARY : GREY_500,
              }}
            >
              <FormattedMessage id="FLIGHT" />
            </Typography>
          </Col>
        </Row>
      </CardCustom>
      <CardCustom
        style={{
          marginRight: 25,
          backgroundColor: serviceType === 'HOTEL' ? PRIMARY_LIGHT : '#E5EBED',
          width: 150,
          height: 40,
          borderRadius: '4px',
          flex: 'none',
          padding: '0 5px',
          justifyContent: 'center',
        }}
        onClick={() => {
          // onChange('HOTEL');
        }}
      >
        <Row>
          <Hotel style={{ marginRight: 10, width: 20, height: 20 }} />
          <Col>
            <Typography
              variant="body1"
              style={{
                color: serviceType === 'HOTEL' ? PRIMARY : GREY_500,
              }}
            >
              <FormattedMessage id="HOTEL" />
            </Typography>
          </Col>
        </Row>
      </CardCustom>
      <CardCustom
        style={{
          marginRight: 25,
          backgroundColor: serviceType === 'LOCATION' ? PRIMARY_LIGHT : '#E5EBED',
          width: 150,
          height: 40,
          borderRadius: '4px',
          flex: 'none',
          padding: '0 5px',
          justifyContent: 'center',
        }}
        // onClick={() => {
        //   onChange('LOCATION');
        // }}
      >
        <Row>
          <Location style={{ marginRight: 10, width: 20, height: 20 }} />
          <Col>
            <Typography
              variant="body1"
              style={{
                color: serviceType === 'LOCATION' ? PRIMARY : GREY_500,
              }}
            >
              <FormattedMessage id="location" />
            </Typography>
          </Col>
        </Row>
      </CardCustom>
    </Row>
  );
};

export default CardHotelItem;
