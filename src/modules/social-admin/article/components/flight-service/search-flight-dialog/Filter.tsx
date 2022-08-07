import { Grid, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Form, Formik } from 'formik';
import moment, { Moment } from 'moment';
import React, { useCallback } from 'react';
import { debounce } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { AppState } from 'redux/reducers';
import { ThunkDispatch } from 'redux-thunk';
import { API_PATHS } from 'configs/API';
import { GRAY, PINK } from 'configs/colors';
import { some, isEmpty } from 'configs/utils';
import { DATE_FORMAT_BACK_END } from 'models/moment';
import { ReactComponent as IconResetFilter } from 'svg/icon_reset_filter.svg';
import { FieldTextContent } from 'modules/common/components/FieldContent';
import { NumberFormatCustom } from 'modules/common/components/Form';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import FormControlSelect from 'modules/common/components/FormControlSelect';
import LoadingButton from 'modules/common/components/LoadingButton';
import DateField from 'modules/common/components/DateField';
import { fetchThunk } from 'modules/common/redux/thunk';
import {
  TICKET_CLASS_CODES,
  AIRLINES_CODES,
  NUMBER_OF_STOPS,
  NUMBER_OF_STOPS_KEYS,
} from 'modules/social-admin/constants';
import { PAGINATION_FLIGHT_SERVICE } from '../constants';

interface Props {
  filter?: any;
  onUpdateFilter(filter: some): void;
  loading?: boolean;
}
const Filter: React.FC<Props> = props => {
  const { filter, onUpdateFilter, loading } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const outsideRange = (e: Moment, start?: Moment) => {
    return start
      ? start.startOf('day').isAfter(e)
      : moment()
          .startOf('day')
          .isAfter(e);
  };

  const getAirports = useCallback(
    debounce(async (str: string) => {
      const jsonFrom = await dispatch(
        fetchThunk(`${API_PATHS.getAdminFlightsAirports}?term=${str.trimLeft()}`, 'get'),
      );
      return jsonFrom?.data?.content;
    }, 100),
    [dispatch],
  );

  const getAirportsRefresh = useCallback(
    debounce(async (str: string, keyExist: string) => {
      const jsonTo = await dispatch(
        fetchThunk(`${API_PATHS.getAdminFlightsAirports}?term=${str.trimLeft() || 'd'}`, 'get'),
      );
      const result = jsonTo?.data?.content || [];
      return result.filter(row => !keyExist?.includes(row.name));
    }, 100),
    [dispatch],
  );

  return (
    <>
      <Formik
        initialValues={{
          ...filter,
          numberOfStops: filter?.numberOfStops ? filter?.numberOfStops : [],
          numberOfStopsOption: filter?.numberOfStopsOption ? filter?.numberOfStopsOption : [],
          airlines: filter?.airlines ? filter?.airlines : [],
          airlinesOption: filter?.airlinesOption ? filter?.airlinesOption : [],
          ticketClassCodes: filter?.ticketClassCodes ? filter?.ticketClassCodes : [],
          ticketClassCodesOption: filter?.ticketClassCodesOption
            ? filter?.ticketClassCodesOption
            : [],
          fromAirport: filter?.fromAirport ? String(filter?.fromAirport) : undefined,
          fromAirportName: filter?.fromAirportName ? String(filter?.fromAirportName) : undefined,
          toAirport: filter?.toAirport ? String(filter?.toAirport) : undefined,
          toAirportName: filter?.toAirportName ? String(filter?.toAirportName) : undefined,
          numberOfAdults: filter?.numberOfAdults ? Number(filter?.numberOfAdults) : 1,
          departureDate: filter?.departureDate
            ? filter?.departureDate
            : moment().format(DATE_FORMAT_BACK_END),
        }}
        onSubmit={async values => {
          if (isEmpty(values.numberOfStops)) {
            values.numberOfStops = NUMBER_OF_STOPS_KEYS;
          }
          values.size = PAGINATION_FLIGHT_SERVICE.PAGE_SIZE;
          values.page = PAGINATION_FLIGHT_SERVICE.PAGE_FIRST;
          onUpdateFilter(values);
        }}
      >
        {({ values, setFieldValue, resetForm, errors }) => {
          return (
            <Form>
              <Grid container alignItems="center">
                <Grid item xs={12}>
                  <FormControlAutoComplete
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Điểm khởi hành
                      </Typography>
                    }
                    placeholder="Sân bay đi"
                    value={
                      (values as any).fromAirportName
                        ? {
                            name: (values as any).fromAirportName,
                            code: (values as any).fromAirport,
                          }
                        : {}
                    }
                    formControlStyle={{ width: 200, maxWidth: '100%', minWidth: 'unset' }}
                    onChange={(e: any, value: some | null) => {
                      setFieldValue('fromAirport', value?.code);
                      setFieldValue('fromAirportName', value?.name);
                    }}
                    loadOptions={getAirports}
                    getOptionSelected={(option: some, value: some) => {
                      return option?.code === value?.code;
                    }}
                    getOptionLabel={(v: some) => v?.name}
                    filterOptions={options => options}
                    options={[]}
                    optional
                    errorMessage={errors?.fromAirportName && String(errors.fromAirportName)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlAutoComplete
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Điểm đến
                      </Typography>
                    }
                    placeholder="Sân bay đến"
                    value={
                      (values as any).toAirportName
                        ? { name: (values as any).toAirportName, code: (values as any).toAirport }
                        : {}
                    }
                    formControlStyle={{ width: 200, maxWidth: '100%', minWidth: 'unset' }}
                    onChange={(e: any, value: some | null) => {
                      setFieldValue('toAirport', value?.code);
                      setFieldValue('toAirportName', value?.name);
                    }}
                    loadOptions={keys => getAirportsRefresh(keys, values?.fromAirportName)}
                    getOptionSelected={(option: some, value: some) => {
                      return option?.code === value?.code;
                    }}
                    getOptionLabel={(v: some) => v?.name}
                    filterOptions={options => options}
                    options={[]}
                    optional
                    errorMessage={errors?.toAirportName && String(errors.toAirportName)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <DateField
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Ngày bay
                      </Typography>
                    }
                    placeholder="mm/dd/yyyy"
                    optional
                    date={
                      values.departureDate
                        ? moment(values.departureDate, DATE_FORMAT_BACK_END)
                        : moment(new Date(), DATE_FORMAT_BACK_END)
                    }
                    onChange={(date?: Moment) => {
                      if (date) setFieldValue(`departureDate`, date.format(DATE_FORMAT_BACK_END));
                    }}
                    inputStyle={{ width: 200, maxWidth: '100%', minWidth: 'unset' }}
                    isOutsideRange={outsideRange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FieldTextContent
                    name="numberOfAdults"
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    style={{ minWidth: 'unset', width: 200, borderRadius: 4, marginRight: 0 }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Số lượng khách
                      </Typography>
                    }
                    value={1}
                    placeholder="0"
                    optional
                    inputProps={{ maxLength: 1 }}
                    inputComponent={NumberFormatCustom as any}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlSelect<some>
                    multiple
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Điểm dừng
                      </Typography>
                    }
                    value={(values as any).numberOfStopsOption || []}
                    style={{ width: 200 }}
                    placeholder="Tất cả"
                    onSelectOption={(value: some | undefined) => {
                      const numberOfStops = value && value.map(item => item.id);
                      setFieldValue('numberOfStops', numberOfStops);
                      setFieldValue('numberOfStopsOption', value);
                    }}
                    options={NUMBER_OF_STOPS as some[]}
                    getOptionLabel={(one: some) => one.name}
                    optional
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlSelect<some>
                    multiple
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Hạng vé
                      </Typography>
                    }
                    value={(values as any).ticketClassCodesOption || []}
                    style={{ width: 200 }}
                    placeholder="Tất cả"
                    onSelectOption={(value: some | undefined) => {
                      const ticketS = value && value.map(item => item.id);
                      setFieldValue('ticketClassCodes', ticketS);
                      setFieldValue('ticketClassCodesOption', value);
                    }}
                    options={TICKET_CLASS_CODES as some[]}
                    getOptionLabel={(one: some) => one.name}
                    optional
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlSelect<some>
                    multiple
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Hãng bay
                      </Typography>
                    }
                    value={(values as any).airlinesOption || []}
                    style={{ width: 200 }}
                    placeholder="Tất cả"
                    onSelectOption={(value: some | undefined) => {
                      const airlines = value && value.map(item => item.id);
                      setFieldValue('airlines', airlines);
                      setFieldValue('airlinesOption', value);
                    }}
                    options={AIRLINES_CODES as some[]}
                    getOptionLabel={(one: some) => one.name}
                    optional
                  />
                </Grid>
                <Grid item xs={12}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    style={{ width: 200, marginBottom: 10 }}
                    color="primary"
                    disableElevation
                    disabled={loading}
                  >
                    <SearchIcon />
                    <FormattedMessage id="search" />
                  </LoadingButton>
                  <LoadingButton
                    variant="outlined"
                    size="large"
                    style={{ width: 200, marginTop: 4 }}
                    color="primary"
                    disableElevation
                    disabled={loading}
                    onClick={() => resetForm()}
                  >
                    <IconResetFilter style={{ marginRight: 4 }} />
                    <Typography variant="button" style={{ color: PINK, fontWeight: 500 }}>
                      Đặt lại bộ lọc
                    </Typography>
                  </LoadingButton>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default Filter;
