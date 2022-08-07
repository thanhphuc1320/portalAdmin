import { Card, Button, Grid, Typography, IconButton } from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';
import SearchIcon from '@material-ui/icons/Search';
import { Form, Formik } from 'formik';
import moment from 'moment';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { GRAY, RED } from 'configs/colors';
import { some } from 'configs/utils';
import { DATE_FORMAT_FILTER_FROM, DATE_FORMAT_FILTER_TO } from 'models/moment';
import { ReactComponent as IconResetFilter } from 'svg/icon_reset_filter.svg';
import {
  FieldDateRangeFormControl,
  FieldTextContent,
  FieldSelectContent,
} from 'modules/common/components/FieldContent';
import LoadingButton from 'modules/common/components/LoadingButton';
import { STATUS_WINNER_SELECT } from '../constants';

const cssClass = 'winner-filter-card';
interface Props {
  filter?: any;
  onUpdateFilter?(filter: some): void;
  loading?: boolean;
  onToggleFilter?(): void;
}
const Filter: React.FC<Props> = props => {
  const { filter, onUpdateFilter, loading, onToggleFilter } = props;
  const [isError, setIsError] = React.useState<boolean>(false);

  return (
    <Card className={`${cssClass}`}>
      <Formik
        enableReinitialize
        initialValues={{
          ...filter,
        }}
        onSubmit={async values => {
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
                  <FieldTextContent
                    name="eventName"
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Event Name
                      </Typography>
                    }
                    placeholder="Tất cả"
                    optional
                  />
                </Grid>

                <Grid item xs={12}>
                  <FieldTextContent
                    name="eventCode"
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Event ID
                      </Typography>
                    }
                    placeholder="Tất cả"
                    optional
                  />
                </Grid>

                <Grid item xs={12}>
                  <FieldTextContent
                    name="phoneNumber"
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Số điện thoại
                      </Typography>
                    }
                    placeholder="Tất cả"
                    optional
                  />
                </Grid>

                <Grid item xs={12}>
                  <FieldTextContent
                    name="winnerCode"
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        WinID
                      </Typography>
                    }
                    placeholder="Tất cả"
                    optional
                  />
                </Grid>

                <Grid item xs={12}>
                  <FieldSelectContent
                    name="status"
                    placeholder="Tất cả"
                    formControlStyle={{ marginRight: 0, width: 200 }}
                    style={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Trạng thái
                      </Typography>
                    }
                    options={STATUS_WINNER_SELECT}
                    optional
                    onSelectOption={value => {
                      setFieldValue('status', value);
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <FieldDateRangeFormControl
                    className={`${cssClass}-createdFrom`}
                    name="createdFrom"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Khoảng thời gian
                      </Typography>
                    }
                    style={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputStyle={{ width: 200, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    isOutsideRange={() => false}
                    optional
                    placeholder="Từ ngày - đến ngày"
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
                  <FieldTextContent
                    name="userCode"
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        UserID
                      </Typography>
                    }
                    placeholder="Tất cả"
                    optional
                  />
                </Grid>

                <Grid item xs={12}>
                  <FieldTextContent
                    name="username"
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        UserName
                      </Typography>
                    }
                    placeholder="Tất cả"
                    optional
                  />
                </Grid>

                <Grid item xs={12}>
                  <FieldTextContent
                    name="rewardName"
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Reward Name
                      </Typography>
                    }
                    placeholder="Tất cả"
                    optional
                  />
                </Grid>

                <Grid item xs={12}>
                  <FieldTextContent
                    name="rewardCode"
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Reward ID
                      </Typography>
                    }
                    placeholder="Tất cả"
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
                    loading={loading}
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

export default Filter;
