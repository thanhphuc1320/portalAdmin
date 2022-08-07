import React, { useCallback } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Form, Formik } from 'formik';
import { debounce } from 'lodash';
import moment from 'moment';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { API_PATHS } from 'configs/API';
import { fetchThunk } from 'modules/common/redux/thunk';
import { GRAY, PINK } from 'configs/colors';
import { some } from 'configs/utils';
import { DATE_FORMAT_FILTER_FROM, DATE_FORMAT_FILTER_TO } from 'models/moment';
import { ReactComponent as IconResetFilter } from 'svg/icon_reset_filter.svg';
import { CA_ID } from '../../../auth/constants';
import {
  FieldDateRangeFormControl,
  FieldSelectContent,
} from 'modules/common/components/FieldContent';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import LoadingButton from 'modules/common/components/LoadingButton';
import { byServiceOptions, byTimeOptions, STATUS_LIST } from '../../constants';

interface Props {
  filter: any;
  onUpdateFilter(filter: some): void;
  caIdList: some[];
  loading: boolean;
}

const Filter: React.FC<Props> = props => {
  const { filter, onUpdateFilter, caIdList, loading } = props;
  const intl = useIntl();
  const caId = localStorage.getItem(CA_ID);
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const fetchHashtags = useCallback(
    debounce(async (str: string) => {
      const jsonHashtags = await dispatch(
        fetchThunk(`${API_PATHS.getHashtags}?name=${str.trimLeft()}`, 'get'),
      );
      return jsonHashtags?.data?.content || [];
    }, 100),
    [dispatch],
  );

  const fetchCreatedUsers = useCallback(
    debounce(async (str: string) => {
      const jsonCreatedUsers = await dispatch(
        fetchThunk(`${API_PATHS.getCreatedUsers}?name=${str.trimLeft()}`, 'get'),
      );
      return jsonCreatedUsers?.data?.content || [];
    }, 100),
    [dispatch],
  );

  return (
    <>
      <Formik
        initialValues={{
          ...filter,
          caId: filter.caId ? Number(filter.caId) : undefined,
          isCreate: filter.isCreate ? Number(filter.isCreate) : undefined,
          hashtag: filter.hashtag ? Number(filter.hashtag) : undefined,
          hashtagName: filter.hashtagName ? String(filter.hashtagName) : undefined,
          userId: filter.userId ? Number(filter.userId) : null,
          userName: filter.userName ? String(filter.userName) : undefined,
          hotelId: filter.hotelId ? Number(filter.hotelId) : undefined,
          status: filter.status ? String(filter.status) : undefined,
          serviceType: filter.serviceType ? filter.serviceType : null,
        }}
        onSubmit={async values => {
          onUpdateFilter(values);
        }}
      >
        {({ values, setFieldValue, setValues }) => {
          return (
            <Form>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={2}>
                  <FieldSelectContent
                    formControlStyle={{ minWidth: 'unset' }}
                    name="isCreate"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        <FormattedMessage id="BY_TIMES" />
                      </Typography>
                    }
                    style={{
                      borderRadius: 4,
                    }}
                    placeholder={intl.formatMessage({ id: 'all' })}
                    options={byTimeOptions}
                    getOptionLabel={value => value.name}
                    onSelectOption={(value: some) => {
                      setFieldValue('isCreate', value);
                    }}
                    optional
                  />
                </Grid>

                {values.isCreate === 0 && (
                  <Grid item xs={2}>
                    <FieldDateRangeFormControl
                      formControlStyle={{ minWidth: 'unset' }}
                      name="createdFrom"
                      label={
                        <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                          <FormattedMessage id="selectDateRange" />
                        </Typography>
                      }
                      style={{ minWidth: 250 }}
                      optional
                      startDate={
                        values.createdFrom &&
                        moment(values.createdFrom, DATE_FORMAT_FILTER_FROM, true).isValid()
                          ? moment(values.createdFrom, DATE_FORMAT_FILTER_FROM, true)
                          : undefined
                      }
                      endDate={
                        values.createdTo &&
                        moment(values.createdTo, DATE_FORMAT_FILTER_TO, true).isValid()
                          ? moment(values.createdTo, DATE_FORMAT_FILTER_TO, true)
                          : undefined
                      }
                      onChange={(startDate, endDate) => {
                        setFieldValue(
                          'createdFrom',
                          startDate?.format(DATE_FORMAT_FILTER_FROM),
                          true,
                        );
                        setFieldValue(
                          'createdTo',
                          startDate && !endDate
                            ? moment().format(DATE_FORMAT_FILTER_TO)
                            : endDate?.format(DATE_FORMAT_FILTER_TO),
                          true,
                        );
                      }}
                    />
                  </Grid>
                )}

                {values.isCreate === 1 && (
                  <Grid item xs={2}>
                    <FieldDateRangeFormControl
                      formControlStyle={{ minWidth: 'unset' }}
                      name="updatedFrom"
                      label={
                        <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                          <FormattedMessage id="selectDateRange" />
                        </Typography>
                      }
                      style={{ minWidth: 250 }}
                      optional
                      startDate={
                        values.updatedFrom &&
                        moment(values.updatedFrom, DATE_FORMAT_FILTER_FROM, true).isValid()
                          ? moment(values.updatedFrom, DATE_FORMAT_FILTER_FROM, true)
                          : undefined
                      }
                      endDate={
                        values.updatedTo &&
                        moment(values.updatedTo, DATE_FORMAT_FILTER_TO, true).isValid()
                          ? moment(values.updatedTo, DATE_FORMAT_FILTER_TO, true)
                          : undefined
                      }
                      onChange={(startDate, endDate) => {
                        setFieldValue(
                          'updatedFrom',
                          startDate?.format(DATE_FORMAT_FILTER_FROM),
                          true,
                        );
                        setFieldValue(
                          'updatedTo',
                          startDate && !endDate
                            ? moment().format(DATE_FORMAT_FILTER_TO)
                            : endDate?.format(DATE_FORMAT_FILTER_TO),
                          true,
                        );
                      }}
                    />
                  </Grid>
                )}

                <Grid item xs={2}>
                  <FieldSelectContent
                    name="serviceType"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        <FormattedMessage id="SERVICES" />
                      </Typography>
                    }
                    style={{
                      borderRadius: 4,
                    }}
                    formControlStyle={{ minWidth: 'unset' }}
                    placeholder={intl.formatMessage({ id: 'all' })}
                    options={byServiceOptions}
                    getOptionLabel={value => value.name}
                    onSelectOption={(value: any) => {
                      setFieldValue('serviceType', value);
                    }}
                    optional
                  />
                </Grid>
                <Grid item xs={2}>
                  <FieldSelectContent
                    formControlStyle={{ minWidth: 'unset' }}
                    name="caId"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Kênh bán
                      </Typography>
                    }
                    placeholder={intl.formatMessage({ id: 'all' })}
                    options={caIdList as some[]}
                    getOptionLabel={(one: some) => one.name}
                    optional
                    onSelectOption={(value: any) => {
                      setFieldValue('caId', value);
                    }}
                  />
                </Grid>

                <Grid item xs={2}>
                  <FormControlAutoComplete
                    id="hashtag"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        <FormattedMessage id="HASHTAG" />
                      </Typography>
                    }
                    placeholder="Tất cả"
                    value={
                      values?.hashtagName
                        ? { id: values?.hashtag, name: values?.hashtagName }
                        : undefined
                    }
                    formControlStyle={{ width: 250, maxWidth: '100%', minWidth: 'unset' }}
                    onChange={(e: any, value: some | null) => {
                      setFieldValue('hashtag', value?.id);
                      setFieldValue('hashtagName', value?.name);
                    }}
                    loadOptions={fetchHashtags}
                    getOptionSelected={(option: some, value: some) => {
                      return option?.id === value?.id;
                    }}
                    getOptionLabel={(v: some) => v?.name}
                    filterOptions={options => options}
                    options={[]}
                    optional
                  />
                </Grid>

                <Grid item xs={2}>
                  <FormControlAutoComplete
                    id="userId"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Người đăng bài
                      </Typography>
                    }
                    placeholder="Tất cả"
                    value={
                      values?.userName ? { id: values?.userId, name: values?.userName } : undefined
                    }
                    formControlStyle={{ width: 250, maxWidth: '100%', minWidth: 'unset' }}
                    onChange={(e: any, value: some | null) => {
                      setFieldValue('userId', value?.id);
                      setFieldValue('userName', value?.name);
                    }}
                    loadOptions={fetchCreatedUsers}
                    getOptionSelected={(option: some, value: some) => {
                      return option?.id === value?.id;
                    }}
                    getOptionLabel={(v: some) => v?.name}
                    filterOptions={options => options}
                    options={[]}
                    optional
                  />
                </Grid>

                <Grid item xs={2}>
                  <FormControlAutoComplete
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Tên khách sạn
                      </Typography>
                    }
                    placeholder="Tên khách sạn"
                    value={
                      (values as any).name
                        ? { name: (values as any).name, id: (values as any).hotelId }
                        : undefined
                    }
                    formControlStyle={{ width: 250, maxWidth: '100%', minWidth: 'unset' }}
                    onChange={(e: any, value: some | null) => {
                      setFieldValue('hotelId', value?.hotelId);
                      setFieldValue('name', value?.name);
                    }}
                    loadOptions={async (str: string) => {
                      const json = await dispatch(
                        fetchThunk(
                          `${API_PATHS.getLocations}?caId=${caId}`,
                          'post',
                          JSON.stringify({
                            term: str.trimLeft() || 'SECC',
                            size: 20,
                            type: 'HOTEL',
                          }),
                        ),
                      );
                      return json?.data?.items;
                    }}
                    getOptionSelected={(option: some, value: some) => {
                      return option?.hotelId === value?.hotelId;
                    }}
                    getOptionLabel={(v: some) => v?.name}
                    filterOptions={options => options}
                    options={[]}
                    optional
                  />
                </Grid>
                <Grid item xs={2}>
                  <FieldSelectContent
                    optional
                    label={
                      <Typography
                        variant="caption"
                        style={{
                          color: GRAY,
                          minWidth: 62,
                          marginRight: 12,
                          marginBottom: 4,
                          fontWeight: 'bold',
                        }}
                      >
                        Trạng thái
                      </Typography>
                    }
                    name="status"
                    style={{
                      borderRadius: 4,
                    }}
                    formControlStyle={{ minWidth: 'unset' }}
                    placeholder="Trạng thái"
                    options={STATUS_LIST}
                    getOptionLabel={value => value?.name}
                    onSelectOption={(value: any) => {
                      setFieldValue('status', value);
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <FieldSelectContent
                    optional
                    label={
                      <Typography
                        variant="caption"
                        style={{
                          color: GRAY,
                          minWidth: 62,
                          marginRight: 12,
                          marginBottom: 4,
                          fontWeight: 'bold',
                        }}
                      >
                        Hãng bay
                      </Typography>
                    }
                    disabled
                    name="Hãng bay"
                    style={{
                      borderRadius: 4,
                    }}
                    formControlStyle={{ minWidth: 'unset' }}
                    placeholder=""
                    options={[]}
                    onSelectOption={() => {}}
                  />
                </Grid>
                <Grid item xs={2}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    style={{ width: '100%', marginTop: 4 }}
                    color="primary"
                    disableElevation
                    loading={loading}
                  >
                    <SearchIcon />
                    <FormattedMessage id="search" />
                  </LoadingButton>
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ width: '100%', height: 40, marginTop: 4 }}
                    onClick={() => {
                      setValues({
                        caId: undefined,
                        isCreate: undefined,
                        hashtag: undefined,
                        userId: null,
                        hotelId: undefined,
                        status: undefined,
                        serviceType: null,
                        page: 1,
                        size: 10,
                      });
                      onUpdateFilter({});
                    }}
                  >
                    <IconResetFilter style={{ marginRight: 4 }} />
                    <Typography variant="button" style={{ color: PINK, fontWeight: 500 }}>
                      Đặt lại bộ lọc
                    </Typography>
                  </Button>
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
