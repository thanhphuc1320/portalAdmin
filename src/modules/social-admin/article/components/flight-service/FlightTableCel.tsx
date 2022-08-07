import React, { useEffect, useState, useCallback } from 'react';
import { ImgCdn, Row } from 'modules/common/components/elements';
import { FieldTextContent } from 'modules/common/components/FieldContent';
import { NumberFormatCustomNonDecimal, NumberFormatCustom } from 'modules/common/components/Form';
import { AIRLINES_CODES, NUMBER_OF_STOPS_DB } from 'modules/social-admin/constants';
import { ReactComponent as IconFlyingOneWay } from 'svg/icon_flying_oneWay.svg';
import { ReactComponent as IconFlyingOneWayLeft } from 'svg/IconFlyingOneWay_left.svg';
import { ReactComponent as IconFlyingOneWayRight } from 'svg/IconFlyingOneWay_right.svg';
import { ReactComponent as IconTripleArrows } from 'svg/icon_triple_arrows.svg';
import { ReactComponent as IconBtnMenu3Dot } from 'svg/btn-menu-3-dot.svg';
import { ReactComponent as IconBtnRemove } from 'svg/btn-icon-remove.svg';
import { PINK } from 'configs/colors';
import { TableCell } from '@material-ui/core';

const cssClass = 'flight-service-cel';

export interface SimpleDialogProps {
  record: any;
  onChangePrice?(item: any): void;
  onRemove?(record: any): void;
  isShowColumnMove?: boolean;
  isShowColumnTime?: boolean;
  isLabel?: boolean;
  isDisabled?: boolean;
  isShowRemove?: boolean;
}

function FlightServiceCard(props: SimpleDialogProps) {
  const {
    record,
    onRemove,
    onChangePrice,
    isShowColumnMove,
    isShowColumnTime,
    isLabel,
    isDisabled,
    isShowRemove,
  } = props;
  const [focusOn, setFocusOn] = useState<number>(-1);
  const [configValues, setConfigValues] = useState({
    originPrice: 0,
    discountPercent: 0,
    discountedPrice: 0,
  });

  useEffect(() => {
    setConfigValues({
      originPrice: record?.originPrice,
      discountPercent: record?.discountPercent,
      discountedPrice: record?.discountPercent > 0 ? record?.discountedPrice : null,
    });
  }, [record]);

  useEffect(() => {
    if (focusOn === 1 || focusOn === 2 || focusOn === 3) {
      onChangePrice && onChangePrice({ ...record, ...configValues });
    }
  }, [record, configValues, focusOn, onChangePrice]);

  const onChangeOriginPrice = useCallback(
    (originPrice: number) => {
      if (focusOn !== 1) return;
      const tempDiscountedPrice =
        originPrice && configValues?.discountPercent
          ? (originPrice * (100 - configValues?.discountPercent)) / 100
          : 0;
      setConfigValues &&
        setConfigValues({
          originPrice,
          discountPercent: configValues?.discountPercent,
          discountedPrice: tempDiscountedPrice,
        });
    },
    [configValues, focusOn, setConfigValues],
  );

  const onChangeDiscountPercent = useCallback(
    (discountPercent: number) => {
      if (focusOn !== 2) return;
      if (discountPercent > 100) discountPercent = 100;
      const tempDiscountedPrice =
        configValues?.originPrice && discountPercent
          ? (configValues?.originPrice * (100 - discountPercent)) / 100
          : 0;
      setConfigValues &&
        setConfigValues({
          originPrice: configValues?.originPrice,
          discountPercent,
          discountedPrice: tempDiscountedPrice,
        });
    },
    [configValues, setConfigValues, focusOn],
  );

  const onChangeDiscountedPrice = useCallback(
    (discountedPrice: number) => {
      if (focusOn !== 3) return;
      if (discountedPrice > configValues?.originPrice) discountedPrice = configValues?.originPrice;
      const tempDiscount =
        configValues?.originPrice && discountedPrice
          ? (1 - discountedPrice / configValues?.originPrice) * 100
          : 0;
      setConfigValues &&
        setConfigValues({
          originPrice: configValues?.originPrice,
          discountPercent: Math.round(tempDiscount * 100) / 100,
          discountedPrice,
        });
    },
    [configValues, setConfigValues, focusOn],
  );

  const airline = AIRLINES_CODES.find(item => item?.id === record?.airlineCode);

  return (
    <>
      {isShowColumnMove && (
        <TableCell className={`${cssClass} cel-btn-move`} style={{ cursor: 'row-resize' }}>
          <IconBtnMenu3Dot />
        </TableCell>
      )}

      <TableCell className={`${cssClass} cel-airline`} style={{ width: 150 }}>
        <div className="cel-box-col">
          <Row>
            <ImgCdn
              url={record?.bannerUrl}
              widthProp={80}
              heightProp={80}
              styleProps={{ width: 'auto', height: 25 }}
            />
            {record?.operatingBannerUrl && (
              <>
                <IconTripleArrows style={{ width: 29 }} />
                <ImgCdn
                  url={record?.operatingBannerUrl}
                  widthProp={80}
                  heightProp={80}
                  styleProps={{ width: 'auto', height: 25 }}
                />
              </>
            )}
          </Row>
          {record?.operatingAirlineName && (
            <span className="operatingAirlineName">
              Liên doanh {airline?.name} - {record?.operatingAirlineName}
            </span>
          )}
        </div>
      </TableCell>

      <TableCell className={`${cssClass} cel-from`} style={{ width: 170, textAlign: 'left' }}>
        <div className="cel-box-col">
          <span className="flight-from-airport-box">
            <span className="flight-from-airport-code">{record?.fromAirport}</span>
          </span>
          <span className="flight-from-airport-name text-limit" style={{ color: PINK }}>
            {record?.fromAirportName}
          </span>
        </div>
      </TableCell>

      <TableCell className={`${cssClass} cel-departure`} style={{ width: 140 }}>
        <div className="cel-box-col">
          <span className="flight-departure-datetime">
            {!isShowColumnTime ? (
              <span className="flight-departure-date">
                {record?.departureTime}
                {' • '}
                {record?.departureDate}
              </span>
            ) : (
              <span className="flight-departure-date">{record?.departureDate}</span>
            )}
          </span>

          {record?.numStops === NUMBER_OF_STOPS_DB.ONE_STOP && (
            <Row>
              <IconFlyingOneWayLeft
                style={{ width: 40, height: 4, position: 'relative', left: 0 }}
              />
              <span className="flight-departure-operating-box">
                <span className="flight-departure-operating-text">
                  {record?.transitAirports &&
                    record?.transitAirports?.length > 0 &&
                    record?.transitAirports[0]?.arrivalAirport}
                </span>
              </span>
              <IconFlyingOneWayRight
                style={{ width: 40, height: 4, position: 'relative', right: 0 }}
              />
            </Row>
          )}
          {record?.numStops === NUMBER_OF_STOPS_DB.DIRECT_FLIGHT && (
            <IconFlyingOneWay style={{ width: 100, height: 40 }} />
          )}
        </div>
      </TableCell>

      <TableCell className={`${cssClass} cel-to`} style={{ width: 170 }}>
        <div className="cel-box-col">
          <span className="flight-to-airport-box">
            <span className="flight-to-airport-code">{record?.toAirport}</span>
          </span>
          <span className="flight-to-airport-name text-limit" style={{ color: PINK }}>
            {record?.toAirportName}
          </span>
        </div>
      </TableCell>

      {isShowColumnTime && (
        <TableCell className={`${cssClass} cel-departureTime`} style={{ width: 150 }}>
          <span>{record?.departureTime}</span>
        </TableCell>
      )}

      <TableCell className={`${cssClass} cel-ticket-class`} style={{ width: 150 }}>
        <div className="cel-box-col">
          {record?.ticketClassDetail && (
            <span className="flight-ticket-class-icon" style={{ backgroundColor: PINK }}>
              {record?.ticketClassDetail}
            </span>
          )}
          <span className="flight-ticket-class-name text-limit">{record?.ticketClassName}</span>
        </div>
      </TableCell>

      <TableCell className={`${cssClass} cel-originPrice`} style={{ width: 120 }}>
        <div className="cel-box-col">
          {isLabel && <span>Giá gốc</span>}
          <FieldTextContent
            name="originPrice"
            formControlStyle={{ width: 100, marginRight: 0, minWidth: 'unset' }}
            style={{ width: 100, marginRight: 0, minWidth: 'unset' }}
            value={configValues?.originPrice?.toFixed(0)}
            onChange={val => onChangeOriginPrice(Math.abs(Number(val?.target?.value)))}
            onFocus={() => setFocusOn && setFocusOn(1)}
            placeholder="0"
            disabled={isDisabled}
            optional
            inputProps={{ maxLength: 12 }}
            inputComponent={NumberFormatCustomNonDecimal as any}
          />
        </div>
      </TableCell>

      <TableCell className={`${cssClass} cel-originPrice`} style={{ width: 150 }}>
        <div className="cel-box-col">
          {isLabel && <span>% giảm giá</span>}
          <FieldTextContent
            name="discountPercent"
            formControlStyle={{ width: 75, marginRight: 0, minWidth: 'unset' }}
            style={{ width: 75, marginRight: 0, minWidth: 'unset' }}
            value={configValues?.discountPercent?.toFixed(0)}
            onChange={val => onChangeDiscountPercent(Math.abs(Number(val?.target?.value)))}
            onFocus={() => setFocusOn && setFocusOn(2)}
            placeholder=""
            disabled={isDisabled}
            optional
            inputProps={{ max: 100, min: 0 }}
            inputComponent={NumberFormatCustom as any}
          />
        </div>
      </TableCell>

      <TableCell className={`${cssClass} cel-originPrice`} style={{ width: 150 }}>
        <div className="cel-box-col">
          {isLabel && <span>Giá sau giảm</span>}
          <FieldTextContent
            name="discountedPrice"
            formControlStyle={{ width: 100, marginRight: 0, minWidth: 'unset' }}
            style={{ width: 100, marginRight: 0, minWidth: 'unset' }}
            value={configValues?.discountedPrice?.toFixed(0)}
            onChange={val => onChangeDiscountedPrice(Math.abs(Number(val?.target?.value)))}
            onFocus={() => setFocusOn && setFocusOn(3)}
            placeholder=""
            disabled={isDisabled}
            optional
            inputProps={{ maxLength: 12 }}
            inputComponent={NumberFormatCustom as any}
          />
        </div>
      </TableCell>

      {isShowRemove && (
        <TableCell
          className={`${cssClass} cel-btn-move`}
          style={{ cursor: 'pointer' }}
          onClick={() => onRemove && onRemove(record)}
        >
          <IconBtnRemove />
        </TableCell>
      )}
    </>
  );
}

export default FlightServiceCard;
