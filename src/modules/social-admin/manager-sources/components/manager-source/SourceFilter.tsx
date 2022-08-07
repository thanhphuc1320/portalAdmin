import React from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Form, Formik } from 'formik';

import { Button, Card, Grid, IconButton, Typography } from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';
import SearchIcon from '@material-ui/icons/Search';

import { DATE_FORMAT_FILTER_FROM, DATE_FORMAT_FILTER_TO } from 'models/moment';
import {
  FieldDateRangeFormControl,
  FieldSelectContent,
} from 'modules/common/components/FieldContent';
import LoadingButton from 'modules/common/components/LoadingButton';
import { GRAY, RED } from 'configs/colors';
import { some } from 'configs/utils';

import { ReactComponent as IconResetFilter } from 'svg/icon_reset_filter.svg';

const cssClass = 'reward-filter-card';

interface Props {
  filter?: any;
  onUpdateFilter?(filter: some): void;
  onToggleFilter?(): void;
  setIsFilter(value: boolean): void;
}

const SourceFilter: React.FC<Props> = props => {
  const { filter, onUpdateFilter, onToggleFilter, setIsFilter } = props;
  const [isError, setIsError] = React.useState<boolean>(false);
  const dataSources = [{ id: 'TIKTOK', name: 'TikTok' }];
  return (
    <Card className={`${cssClass}`}>
      <Formik
        enableReinitialize
        initialValues={{
          ...filter,
        }}
        onSubmit={values => {
          setIsFilter(true);
          onUpdateFilter && onUpdateFilter(values);
        }}
      >
        {({ values, setFieldValue, resetForm }) => {
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
                  <Typography style={{ marginBottom: 10 }} variant="subtitle2">
                    Bộ lọc
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <FieldSelectContent
                    name="provider"
                    placeholder="Tất cả"
                    formControlStyle={{ marginRight: 0, width: 200 }}
                    style={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Nguồn
                      </Typography>
                    }
                    options={dataSources}
                    optional
                    onSelectOption={value => {
                      setFieldValue('provider', value);
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <FieldDateRangeFormControl
                    className={`${cssClass}-createdFrom`}
                    name="createdFrom"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Thời gian tạo
                      </Typography>
                    }
                    style={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputStyle={{ width: 200, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    placeholder="Từ ngày - đến ngày"
                    optional
                    isOutsideRange={() => false}
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
                      if (moment(startDate) > moment(endDate)) {
                        setIsError(true);
                        setFieldValue('createdFrom', undefined);
                        setFieldValue('createdTo', undefined);
                      } else {
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
                        setIsError(false);
                      }
                    }}
                  />
                  {isError && (
                    <Typography variant="body2" style={{ color: RED, width: 200 }}>
                      Thời gian (Đến ngày) phải lớn hơn thời gian (Từ Ngày). Vui lòng nhập lại.
                    </Typography>
                  )}
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
                      setIsFilter(true);
                      setIsError(false);
                      resetForm();
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

export default SourceFilter;
