import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Form, Formik } from 'formik';
import { isArray } from 'lodash';

import { Button, Card, Grid, IconButton, Typography } from '@material-ui/core';

import IconClose from '@material-ui/icons/CloseOutlined';
import SearchIcon from '@material-ui/icons/Search';

import { DATE_FORMAT_FILTER_FROM, DATE_FORMAT_FILTER_TO } from 'models/moment';
import {
  FieldDateRangeFormControl,
  FieldSelectContent,
} from 'modules/common/components/FieldContent';
import moment, { Moment } from 'moment';
import LoadingButton from 'modules/common/components/LoadingButton';

import { some } from 'configs/utils';
import { GRAY, RED } from 'configs/colors';
import { NAME_REACTION_TYPE } from '../../constant';

import { ReactComponent as IconResetFilter } from 'svg/icon_reset_filter.svg';

import '../../style.scss';

const cssClass = 'reward-filter-card';

interface Props {
  filter?: any;
  onUpdateFilter?(filter: some): void;
  setIsFilter(value: boolean): void;
  onToggleFilter?(): void;
}

const FilterActivityLog: React.FC<Props> = props => {
  const { filter, onUpdateFilter, onToggleFilter, setIsFilter } = props;
  const [isError, setIsError] = React.useState<boolean>(false);
  const disableFuture = (e: Moment, start?: Moment) => {
    return start
      ? start.endOf('day').isBefore(e)
      : moment()
          .endOf('day')
          .isBefore(e);
  };

  return (
    <Card className={`${cssClass}`}>
      <Formik
        enableReinitialize
        initialValues={{
          ...filter,
        }}
        onSubmit={async values => {
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
                    style={{ position: 'absolute', top: -5, right: 0, padding: 0 }}
                    onClick={onToggleFilter}
                  >
                    <IconClose />
                  </IconButton>
                  <Typography style={{ marginTop: 20, marginBottom: 10 }} variant="subtitle1">
                    Bộ lọc
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <FieldDateRangeFormControl
                    className={`${cssClass}-createdFrom`}
                    name="createdFrom"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Thời gian
                      </Typography>
                    }
                    style={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputStyle={{ width: 200, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    isOutsideRange={disableFuture}
                    optional
                    placeholder="Từ ngày - Đến ngày"
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
                  <FieldSelectContent
                    multiple
                    name="reactionType"
                    placeholder="Tất cả"
                    value={
                      values?.reactionType &&
                      (isArray(values?.reactionType)
                        ? values?.reactionType
                        : [values?.reactionType])
                    }
                    formControlStyle={{ marginRight: 0, width: 200 }}
                    style={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Loại tương tác
                      </Typography>
                    }
                    options={NAME_REACTION_TYPE as some[]}
                    optional
                    inputProps={{ autoComplete: 'off' }}
                    onSelectOption={value => {
                      setFieldValue('reactionType', value);
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
                      setIsError(false);
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

export default FilterActivityLog;
