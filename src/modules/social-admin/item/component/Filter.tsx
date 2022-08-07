import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { API_PATHS } from 'configs/API';
import { fetchThunk } from 'modules/common/redux/thunk';
import { GRAY } from 'configs/colors';
import { some } from 'configs/utils';
import { Form, Formik } from 'formik';
import moment, { Moment } from 'moment';
import { setNotistackMessage } from 'modules/common/redux/reducer';

import { Button, Card, Grid, IconButton, Typography } from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';
import SearchIcon from '@material-ui/icons/Search';

import { C_DATE_FORMAT, DATE_FORMAT } from 'models/moment';
import DatetimePickerField from 'modules/common/components/DatetimePickerField';
import { FieldSelectContent } from 'modules/common/components/FieldContent';
import LoadingButton from 'modules/common/components/LoadingButton';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';

import { ReactComponent as IconResetFilter } from 'svg/icon_reset_filter.svg';

const cssClass = 'event-filter-card';

interface Props {
  filter?: any;
  onUpdateFilter?(filter: some): void;
  caIdList?: some[];
  hashTagsList?: some[];
  onToggleFilter?(): void;
  provinceId: number;
}

const Filter: React.FC<Props> = props => {
  const { filter, caIdList, onUpdateFilter, onToggleFilter, provinceId } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const [nameHotel, setNameHotel] = useState<any>([]);
  const [hotelOptions, setHotelOptions] = useState<some[]>([]);

  const fetchHotels = useCallback(
    async (str: string) => {
      const queryParams = !str
        ? `provinceId=${provinceId}`
        : `name=${str.trimLeft()}&provinceId=${provinceId}`;
      const json = await dispatch(fetchThunk(`${API_PATHS.adminItemHotel}?${queryParams}`, 'get'));
      return json?.data?.content || [];
    },
    [dispatch, provinceId],
  );

  const fetchInitHotels = useCallback(async () => {
    let result: any = {};
    if (provinceId) {
      const queryParams = `provinceId=${provinceId}`;
      result = await dispatch(fetchThunk(`${API_PATHS.adminItemHotel}?${queryParams}`, 'get'));
    }
    if (result?.data?.content) {
      const data = result?.data?.content || [];
      setHotelOptions(data);
      setNameHotel([]);
      onUpdateFilter && onUpdateFilter({});
    } else {
      result?.message && dispatch(setNotistackMessage(result?.message, 'error'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, provinceId]);

  React.useEffect(() => {
    fetchInitHotels();
  }, [fetchInitHotels, provinceId]);

  return (
    <Card className={`${cssClass}`}>
      <Formik
        enableReinitialize
        initialValues={{
          ...filter,
          caId: filter?.caId ? Number(filter?.caId) : undefined,
        }}
        onSubmit={async values => {
          onUpdateFilter && onUpdateFilter(values);
        }}
      >
        {({ values, setFieldValue, resetForm }) => {
          if (
            values?.createdFrom &&
            values?.createdTo &&
            moment(values?.createdFrom) > moment(values?.createdTo)
          ) {
            setFieldValue('createdFrom', undefined);
            setFieldValue('createdTo', undefined);
          }
          return (
            <Form>
              <Grid container>
                <Grid item xs={12} style={{ position: 'relative' }}>
                  <IconButton
                    style={{
                      position: 'absolute',
                      top: -5,
                      right: 0,
                      padding: 0,
                    }}
                    onClick={onToggleFilter}
                  >
                    <IconClose />
                  </IconButton>
                  <Typography style={{ marginTop: 20, marginBottom: 10 }} variant="subtitle1">
                    Bộ lọc
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FieldSelectContent
                    name="caId"
                    placeholder="Tất cả"
                    formControlStyle={{ marginRight: 0, width: 200 }}
                    style={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Ca ID
                      </Typography>
                    }
                    options={caIdList as some[]}
                    optional
                    onSelectOption={value => {
                      setFieldValue('caId', value);
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <FormControlAutoComplete
                    id="name"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Tên khách sạn
                      </Typography>
                    }
                    placeholder="Tên khách sạn"
                    value={nameHotel}
                    options={nameHotel as some[]}
                    initOptions={hotelOptions}
                    onChange={(e: any, value: any) => {
                      if (!value) {
                        setNameHotel([]);
                      } else {
                        setNameHotel(value);
                      }
                      setFieldValue('name', value?.hotelObjectBase?.name);
                    }}
                    getOptionSelected={(option: some, value: some) => {
                      return option?.hotelObjectBase?.name === value?.hotelObjectBase?.name;
                    }}
                    getOptionLabel={(v: some) => v?.hotelObjectBase?.name || ''}
                    filterOptions={options => options}
                    optional
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    loadOptions={fetchHotels}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <DatetimePickerField
                    id="beginAt"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Khoảng thời gian
                      </Typography>
                    }
                    placeholder="Từ ngày"
                    inputStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    optional
                    isDisableTime
                    date={values?.beginAt ? moment(values?.beginAt) : undefined}
                    formatDate={DATE_FORMAT}
                    maxDate={moment(new Date())}
                    onChange={(beginAt: Moment | null) => {
                      setFieldValue(
                        'beginAt',
                        beginAt ? `${moment(beginAt).format(C_DATE_FORMAT)}T00:00:00.000Z` : '',
                      );
                      setFieldValue('endAt', '');
                    }}
                  />

                  <DatetimePickerField
                    id="endAt"
                    placeholder="Đến ngày"
                    inputStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    optional
                    isDisableTime
                    date={values?.endAt ? moment(values?.endAt) : undefined}
                    minDate={values?.beginAt}
                    maxDate={moment(new Date())}
                    formatDate={DATE_FORMAT}
                    onChange={(endAt: Moment | null) => {
                      setFieldValue(
                        'endAt',
                        endAt ? `${moment(endAt).format(C_DATE_FORMAT)}T00:00:00.000Z` : null,
                      );
                    }}
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
                  >
                    <SearchIcon />
                    <FormattedMessage id="search" />
                  </LoadingButton>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ width: 200, height: 40, marginTop: 4 }}
                    onClick={() => {
                      resetForm();
                      setNameHotel([]);
                      fetchInitHotels();
                      onUpdateFilter && onUpdateFilter({});
                    }}
                  >
                    <IconResetFilter style={{ marginRight: 4 }} />
                    Đặt lại bộ lọc
                  </Button>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </Card>
  );
};

export default Filter;
