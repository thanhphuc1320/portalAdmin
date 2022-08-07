import React from 'react';
import {
  Box,
  CardMedia,
  createStyles,
  makeStyles,
  Typography,
  IconButton,
  Card,
} from '@material-ui/core';
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';
// import { useIntl } from 'react-intl';
import { FormattedNumber } from 'react-intl';
import { GRAY_DARK } from '../../../../configs/colors';
import { some } from '../../../../constants';
import { ReactComponent as HotelStart1 } from '../../../../svg/icon_hotel_one_star.svg';
import { ReactComponent as HotelStart2 } from '../../../../svg/icon_hotel_two_star.svg';
import { ReactComponent as HotelStart3 } from '../../../../svg/hotel-star-3.svg';
import { ReactComponent as HotelStart4 } from '../../../../svg/icon_hotel_four_star.svg';
import { ReactComponent as HotelStart5 } from '../../../../svg/icon_hotel_five_star.svg';
import { ReactComponent as DiscountTicket } from '../../../../svg/icon-discount-ticket.svg';
import { Col, Row } from '../../../common/components/elements';
import { ReactComponent as BtnIconClose } from '../../../../svg/btn-icon-close.svg';

const useStyles = makeStyles(() =>
  createStyles({
    cardIcon: {
      '& .hide': { display: 'none' },
      '&:hover .hide': { display: 'inline-block' },
    },
  }),
);
interface Props {
  hotelData: some;
  setHotelList(value: some): void;
  setArraySelect(value: number): void;
  hotelList: some[];
  arraySelect: number;
  index: number;
  configValues: some;
  setConfigValues(value: some): void;
}

function HotelCard(props: Props) {
  const {
    setConfigValues,
    hotelData,
    setHotelList,
    hotelList,
    index,
    arraySelect,
    setArraySelect,
  } = props;
  const classes = useStyles();

  // const intl = useIntl();

  const showStarNumber = (star: number) => {
    switch (star) {
      case 1:
        return <HotelStart1 />;
      case 2:
        return <HotelStart2 />;
      case 3:
        return <HotelStart3 />;
      case 4:
        return <HotelStart4 />;
      case 5:
        return <HotelStart5 />;
      default:
        return <HotelStart1 />;
    }
  };

  return (
    <Card
      className={classes.cardIcon}
      style={{
        padding: '8px 0px 8px 8px',
        width: 480,
        display: 'flex',
        marginRight: 16,
        marginBottom: 16,
        backgroundColor: arraySelect === index ? '#E5EBED' : undefined,
      }}
      onClick={() => {
        setConfigValues({
          originPrice: hotelData.originPrice,
          discount: hotelData.discount,
          discountedPrice: hotelData.discountedPrice,
        });
        setArraySelect(index);
      }}
    >
      <Box>
        <CardMedia
          style={{ height: 114, width: 96, borderRadius: 8 }}
          image={`https://tripi.vn/cdn-cgi/image/width=192,height=228/${hotelData.bannerUrl}`}
          title={hotelData.name}
        />
      </Box>
      <Box display="flex" width="70%" marginLeft={2} flexDirection="column">
        <Row style={{ justifyContent: 'space-between', width: '100%', minHeight: 46 }}>
          <Typography variant="subtitle1" style={{ color: GRAY_DARK }}>
            {hotelData.name}
          </Typography>
          {/* <Hotel /> */}
          <IconButton
            className="hide"
            style={{ paddingTop: 0 }}
            onClick={() => {
              hotelList.splice(index, 1);
              setHotelList([...hotelList]);
            }}
          >
            <BtnIconClose color="primary" />
          </IconButton>
        </Row>
        <Row style={{ marginTop: 4 }}>
          {showStarNumber(hotelData.starNumber)}
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
            {hotelData.provinceName}
          </Typography>
        </Row>
        <Row>
          <Typography variant="subtitle2" style={{ position: 'absolute', paddingLeft: 23 }}>
            <FormattedNumber value={hotelData.discount || 0} />%
          </Typography>
          <DiscountTicket
            className="svgFillAll"
            style={{
              width: 84,
              height: 34,
              fill: '#f5cce0',
            }}
          />
          <Col style={{ marginLeft: 8, marginTop: 4 }}>
            <Typography variant="subtitle2" style={{ color: '#cc0066' }}>
              Từ{' '}
              <FormattedNumber value={hotelData.discountedPrice > 0 && hotelData.discountedPrice} />
              đ
            </Typography>
            <Typography
              variant="caption"
              style={{ color: '#c1c6c9', textDecoration: 'line-through' }}
            >
              <FormattedNumber value={hotelData.originPrice || 0} />đ
            </Typography>
          </Col>
        </Row>
      </Box>
    </Card>
  );
}

export default HotelCard;
