import { Button, Typography } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { useFormikContext } from 'formik';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { API_PATHS } from '../../../../configs/API';
import { BLUE_300, GRAY } from '../../../../configs/colors';
import { some } from '../../../../constants';
import { DATE_FORMAT_BACK_END, DATE_FORMAT_TIMEZONE } from '../../../../models/moment';
import { AppState } from '../../../../redux/reducers';
import { CA_ID } from '../../../auth/constants';
import { Col, Row, snackbarSetting } from '../../../common/components/elements';
import {
  FieldDateRangeFormControl,
  FieldTextContent,
} from '../../../common/components/FieldContent';
import {
  NumberFormatCustom,
  NumberFormatCustomNoneNegative,
} from '../../../common/components/Form';
import FormControlAutoComplete from '../../../common/components/FormControlAutoComplete';
import FormControlTextField from '../../../common/components/FormControlTextField';
import LoadingButton from '../../../common/components/LoadingButton';
import { fetchThunk } from '../../../common/redux/thunk';
import HotelCard from './HotelCard';

interface Props {
  setHotelList(value: some): void;
  setArraySelect(value: number): void;
  hotelList: some[];
  arraySelect: number;
  serviceNumber: number;
}
const HotelServices: React.FC<Props> = (props: Props) => {
  const { setHotelList, hotelList, arraySelect, setArraySelect, serviceNumber } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const [provincesList, setProvincesList] = useState<some[]>([]);
  const [focusOn, setFocusOn] = useState<number>(-1);
  const [configValues, setConfigValues] = useState({
    originPrice: 0,
    discount: 0,
    discountedPrice: 0,
  });

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { setFieldValue, values, resetForm } = useFormikContext();
  const caId = localStorage.getItem(CA_ID);
  const [timesCheckIn, setTimesCheckIn] = useState<any>({ checkInAt: null, checkOutAt: null });

  const fetchProvinces = useCallback(async () => {
    const params = {
      page: 1,
      size: 500,
    };
    const json = await dispatch(
      fetchThunk(`${API_PATHS.listProvinces}?caId=${caId}`, 'post', JSON.stringify(params), true),
    );
    if (json?.data) {
      setProvincesList(json.data?.items);
    } else {
      json?.message &&
        enqueueSnackbar(
          json?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
    }
  }, [caId, closeSnackbar, dispatch, enqueueSnackbar]);

  const fetchHotels = useCallback(
    async value => {
      const params = {
        isFirstRequest: true,
        adults: Number(value?.adults),
        aliasCode: value?.aliasCode,
        checkIn: value?.checkIn,
        checkOut: value?.checkOut,
        children: 0,
        childrenAges: [],
        filters: {
          stars: Number(value?.start) ? [Number(value?.start)] : undefined,
        },
        firstRequest: true,
        hotelIds: Number(value?.hotelId) ? [Number(value?.hotelId)] : undefined,
        page: 1,
        rooms: Number(value?.rooms),
        size: serviceNumber,
        sortBy: 'price-',
      };
      const json = await dispatch(
        fetchThunk(`${API_PATHS.searchHotels}?caId=${caId}`, 'post', JSON.stringify(params), true),
      );
      if (json?.data) {
        const tempHotelList: some[] = hotelList.concat(json.data).slice(0, serviceNumber);
        const updateHotelList: some[] = tempHotelList.map((element: any) => {
          return {
            ...element,
            checkInAt: timesCheckIn?.checkInAt ? timesCheckIn?.checkInAt : null,
            checkOutAt: timesCheckIn?.checkOutAt ? timesCheckIn?.checkOutAt : null,
          };
        });
        setHotelList(updateHotelList);
      } else {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
      }
    },
    [
      caId,
      closeSnackbar,
      dispatch,
      enqueueSnackbar,
      hotelList,
      setHotelList,
      timesCheckIn,
      serviceNumber,
    ],
  );

  const countOriginPrice = useCallback(
    (originPrice: number) => {
      if (focusOn !== 1) return;
      const tempDiscountedPrice =
        originPrice && configValues?.discount
          ? (originPrice * (100 - configValues?.discount)) / 100
          : 0;
      setConfigValues({
        discount: configValues?.discount,
        originPrice,
        discountedPrice: tempDiscountedPrice,
      });
    },
    [configValues, focusOn],
  );

  const countDiscount = useCallback(
    (discount: number) => {
      // eslint-disable-next-line no-param-reassign
      if (discount > 99) discount = 99;
      if (focusOn !== 2) return;
      const tempDiscountedPrice =
        configValues?.originPrice && discount
          ? (configValues?.originPrice * (100 - discount)) / 100
          : 0;
      setConfigValues({
        originPrice: configValues?.originPrice,
        discount,
        discountedPrice: tempDiscountedPrice,
      });
    },
    [configValues, focusOn],
  );

  const countDiscountedPrice = useCallback(
    (discountedPrice: number) => {
      if (focusOn !== 3) return;
      const tempDiscount =
        configValues?.originPrice && discountedPrice
          ? (1 - discountedPrice / configValues?.originPrice) * 100
          : 0;
      setConfigValues({
        originPrice: configValues?.originPrice,
        discount: Math.round(tempDiscount * 100) / 100,
        discountedPrice,
      });
    },
    [configValues, focusOn],
  );

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  return (
    <>
      <Col
        style={{
          backgroundColor: '#E5EBED',
          padding: 16,
          margin: '0px -12px',
        }}
      >
        <Typography variant="body2" style={{ marginBottom: 10 }}>
          Chọn tối đa <b>{serviceNumber}</b> khách sạn để thêm vào bài viết
        </Typography>

        <Row style={{}}>
          <Col>
            <Typography
              style={{ color: GRAY, fontWeight: 'bold', marginBottom: 6 }}
              variant="caption"
            >
              Điểm đến
            </Typography>
            <FormControlAutoComplete<some>
              value={
                provincesList?.find((v: some) => v.aliasCode === (values as any).aliasCode) || null
              }
              formControlStyle={{ width: 250, marginRight: 12 }}
              placeholder="Chọn điểm đến"
              onChange={(e: any, value: some | null) => {
                setFieldValue('aliasCode', value?.aliasCode);
              }}
              options={provincesList as some[]}
              getOptionLabel={(one: some) => one.name}
              optional
              disabled={(values as any).hotelId}
            />
          </Col>
          <FieldTextContent
            name="hotelId"
            formControlStyle={{ minWidth: 100, width: '100%', marginRight: 12, flex: 1 }}
            label={
              <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                Hotel ID
              </Typography>
            }
            placeholder="Nhập hotelId"
            inputProps={{ maxLength: 500 }}
            disabled={(values as any).aliasCode}
            optional
            inputComponent={NumberFormatCustom as any}
          />
          <FieldTextContent
            name="rooms"
            formControlStyle={{ minWidth: 100, width: '100%', marginRight: 12, flex: 1 }}
            label={
              <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                Số phòng
              </Typography>
            }
            placeholder="Số phòng"
            inputProps={{ maxLength: 500 }}
            disabled={false}
            optional
            inputComponent={NumberFormatCustom as any}
          />
          <FieldTextContent
            name="adults"
            formControlStyle={{ minWidth: 100, width: '100%', marginRight: 12, flex: 1 }}
            label={
              <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                Số khách
              </Typography>
            }
            placeholder="Số khách"
            inputProps={{ maxLength: 500 }}
            disabled={false}
            inputComponent={NumberFormatCustom as any}
            optional
          />
          <FieldDateRangeFormControl
            isOutsideRange={() => false}
            name="checkIn"
            label={
              <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                Ngày nhận / trả phòng
              </Typography>
            }
            style={{ minWidth: 250, marginRight: 12 }}
            optional
            startDate={
              (values as any)?.checkIn &&
              moment((values as any)?.checkIn, DATE_FORMAT_BACK_END, true).isValid()
                ? moment((values as any)?.checkIn, DATE_FORMAT_BACK_END, true)
                : undefined
            }
            endDate={
              (values as any)?.checkOut &&
              moment((values as any)?.checkOut, DATE_FORMAT_BACK_END, true).isValid()
                ? moment((values as any)?.checkOut, DATE_FORMAT_BACK_END, true)
                : undefined
            }
            onChange={(startDate, endDate) => {
              setFieldValue('checkIn', startDate?.format(DATE_FORMAT_BACK_END), true);
              setFieldValue(
                'checkOut',
                startDate && !endDate
                  ? moment().format(DATE_FORMAT_BACK_END)
                  : endDate?.format(DATE_FORMAT_BACK_END),
                true,
              );
              setTimesCheckIn({
                checkInAt: startDate && moment(startDate).format(DATE_FORMAT_TIMEZONE),
                checkOutAt: endDate && moment(endDate).format(DATE_FORMAT_TIMEZONE),
              });
            }}
          />
        </Row>
        <Row>
          <Row>
            <LoadingButton
              variant="contained"
              size="large"
              style={{ minWidth: 140, marginRight: 20 }}
              color="primary"
              disableElevation
              disabled={!(values as any)?.aliasCode || !(values as any)?.checkIn}
              onClick={() => fetchHotels(values)}
            >
              <Typography>Thêm dịch vụ</Typography>
            </LoadingButton>
            <Button
              onClick={() => {
                resetForm();
                // setFieldValue('aliasCode', null);
                // setFieldValue('hotelId', null);
                // setFieldValue('rooms', '');
                // setFieldValue('adults', '');
                // setFieldValue('checkIn', '');
                // setFieldValue('checkOut', '');
              }}
            >
              <RefreshIcon style={{ marginRight: 4, color: BLUE_300 }} />
              <Typography variant="button" style={{ color: BLUE_300 }}>
                <FormattedMessage id="refreshFilter" />
              </Typography>
            </Button>
          </Row>
        </Row>
      </Col>
      <Row style={{ flexWrap: 'wrap', margin: 16, justifyContent: 'revert', minHeight: 24 }}>
        {hotelList?.map((element: some, index: number) => (
          <HotelCard
            hotelData={element}
            setHotelList={setHotelList}
            hotelList={hotelList}
            index={index}
            setArraySelect={setArraySelect}
            arraySelect={arraySelect}
            setConfigValues={setConfigValues}
            configValues={configValues}
          />
        ))}
      </Row>
      <Row
        style={{
          backgroundColor: '#E5EBED',
          padding: 16,
          margin: '0px -12px',
        }}
      >
        {/* <FieldSelectContent
          name="stars"
          label={
            <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
              Số sao
            </Typography>
          }
          style={{
            borderRadius: 4,
            // borderLeft: 0,
            marginRight: 12,
          }}
          formControlStyle={{}}
          options={STAR_LIST}
          getOptionLabel={value => value?.name}
          onSelectOption={(value: some) => {
            setFieldValue('stars', value);
          }}
          optional
          disabled={!hotelList.length}
        /> */}
        <FormControlTextField
          name="originPrice"
          formControlStyle={{ minWidth: 100, width: '100%', marginRight: 12, flex: 1 }}
          label={
            <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
              Giá VND
            </Typography>
          }
          placeholder="Giá VND"
          inputProps={{ maxLength: 500 }}
          disabled={!hotelList.length}
          optional
          inputComponent={NumberFormatCustomNoneNegative as any}
          onChange={(e: any) => {
            countOriginPrice(Number(e.target.value));
            const tempHotelList: some[] = hotelList;
            if (arraySelect !== -1) {
              tempHotelList[arraySelect].originPrice = Number(e.target.value);
              if (tempHotelList[arraySelect].discount) {
                tempHotelList[arraySelect].discountedPrice =
                  (Number(e.target.value) * (100 - tempHotelList[arraySelect].discount)) / 100;
              }
            }
            setHotelList(tempHotelList);
          }}
          value={configValues.originPrice}
          onFocus={() => setFocusOn(1)}
        />
        <FormControlTextField
          name="discount"
          inputComponent={NumberFormatCustomNoneNegative as any}
          formControlStyle={{ minWidth: 100, width: '100%', marginRight: 12, flex: 1 }}
          label={
            <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
              % giảm
            </Typography>
          }
          placeholder="% giảm"
          value={configValues?.discount}
          optional
          onChange={(e: any) => {
            countDiscount(Number(e.target.value));
            const tempHotelList: some[] = hotelList;
            if (arraySelect !== -1) {
              tempHotelList[arraySelect].discount = Number(e.target.value);
              if (tempHotelList[arraySelect].originPrice) {
                tempHotelList[arraySelect].discountedPrice =
                  (tempHotelList[arraySelect].originPrice * (100 - Number(e.target.value))) / 100;
              }
            }
            setHotelList(tempHotelList);
          }}
          onFocus={() => setFocusOn(2)}
        />
        <FormControlTextField
          name="discountedPrice"
          formControlStyle={{ minWidth: 100, width: '100%', marginRight: 12, flex: 1 }}
          label={
            <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
              Giá sau giảm (VND)
            </Typography>
          }
          placeholder="Giá sau giảm (VND)"
          inputProps={{ maxLength: 500 }}
          disabled={!hotelList.length}
          optional
          inputComponent={NumberFormatCustomNoneNegative as any}
          onChange={(e: any) => {
            countDiscountedPrice(Number(e.target.value));
            const tempHotelList: some[] = hotelList;
            if (arraySelect > -1) {
              tempHotelList[arraySelect].discountedPrice = Number(e.target.value);
              // if (tempHotelList[arraySelect].originPrice) {
              //   tempHotelList[arraySelect].discount =
              //     (1 - Number(e.target.value) / tempHotelList[arraySelect].originPrice) * 100;
              //   tempHotelList[arraySelect].discount = Number(e.target.value);
              // }
            }
            setHotelList(tempHotelList);
          }}
          value={configValues?.discountedPrice}
          onFocus={() => setFocusOn(3)}
        />
      </Row>
    </>
  );
};

export default HotelServices;
