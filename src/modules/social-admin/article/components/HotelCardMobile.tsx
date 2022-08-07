import { Box, CardMedia, Typography } from '@material-ui/core';
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';
import React from 'react';
import { useIntl } from 'react-intl';
import { GRAY_DARK } from '../../../../configs/colors';
import { some } from '../../../../constants';
import { ReactComponent as HotelStart3 } from '../../../../svg/hotel-star-3.svg';
import { ReactComponent as DiscountTicket } from '../../../../svg/icon-discount-ticket.svg';
import { ReactComponent as Hotel } from '../../../../svg/icon-serv-hotel.svg';
import { Col, Row } from '../../../common/components/elements';

interface Props {
  hotelData: some;
}

function HotelCardMobile(props: Props) {
  const { hotelData } = props;

  const intl = useIntl();

  return (
    <Box display="flex">
      <Box>
        <CardMedia
          style={{ height: 112, width: 96, borderRadius: 8 }}
          image={hotelData?.bannerUrl}
          title={hotelData?.name}
        />
      </Box>
      <Box display="flex" width="70%" marginLeft={2} flexDirection="column">
        <Row style={{ justifyContent: 'space-between', width: '100%' }}>
          <Typography variant="subtitle1" style={{ color: GRAY_DARK }}>
            {hotelData?.name}
          </Typography>
          <Hotel />
        </Row>
        <Row style={{ marginTop: 4 }}>
          <HotelStart3 />
          &nbsp; &nbsp;
          <FiberManualRecordRoundedIcon
            className="svgFillAll"
            style={{
              width: 8,
              fill: '#c1c6c9',
            }}
          />
          &nbsp; &nbsp;
          <Typography variant="caption" style={{ color: '#c1c6c9' }}>
            {hotelData?.provinceName}
          </Typography>
        </Row>
        <Row>
          <Typography variant="subtitle2" style={{ position: 'absolute', marginLeft: 18 }}>
            {hotelData?.discount ? intl.formatNumber(hotelData?.discount) : 0}%
          </Typography>
          <DiscountTicket
            className="svgFillAll"
            style={{
              width: 54,
              height: 34,
              fill: '#f5cce0',
            }}
          />
          <Col style={{ marginLeft: 8, marginTop: 4 }}>
            <Typography variant="subtitle2" style={{ color: '#cc0066' }}>
              Từ {hotelData?.discountedPrice ? intl.formatNumber(hotelData?.discountedPrice) : 0}đ
            </Typography>
            <Typography
              variant="caption"
              style={{ color: '#c1c6c9', textDecoration: 'line-through' }}
            >
              {hotelData?.originPrice ? intl.formatNumber(hotelData?.originPrice) : 0}đ
            </Typography>
          </Col>
        </Row>
      </Box>
    </Box>
  );
}

export default HotelCardMobile;
