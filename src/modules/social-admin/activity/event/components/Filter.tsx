import React from 'react';
import { Card, Button, Grid, Typography, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import IconClose from '@material-ui/icons/CloseOutlined';
import { Form, Formik } from 'formik';
import moment from 'moment';
import { isArray } from 'lodash';
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

const cssClass = 'event-filter-card';

interface Props {
  filter?: any;
  onUpdateFilter?(filter: some): void;
  caIdList?: some[];
  hashTagsList?: some[];
  onToggleFilter?(): void;
}

const Filter: React.FC<Props> = props => {
  const { filter, caIdList, onUpdateFilter, onToggleFilter } = props;
  const [isError, setIsError] = React.useState<boolean>(false);

  return (
    <Card className={`${cssClass}`}>
      <Formik
        enableReinitialize
        initialValues={{
          ...filter,
          code: filter?.code ? filter?.code : undefined,
          name: filter?.name ? filter?.name : undefined,
          createdFrom: filter?.createdFrom ? filter?.createdFrom : undefined,
          createdTo: filter?.createdTo ? filter?.createdTo : undefined,
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
                  <FieldTextContent
                    name="code"
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        ID
                      </Typography>
                    }
                    placeholder="Tất cả"
                    optional
                  />
                </Grid>

                <Grid item xs={12}>
                  <FieldTextContent
                    name="name"
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Tên sự kiện
                      </Typography>
                    }
                    placeholder="Tất cả"
                    optional
                  />
                </Grid>

                <Grid item xs={12}>
                  <FieldSelectContent
                    multiple
                    name="caIds"
                    value={
                      values?.caIds &&
                      (isArray(values?.caIds) ? values?.caIds : [values?.caIds]).map(Number)
                    }
                    placeholder="Tất cả"
                    formControlStyle={{ marginRight: 0, width: 200 }}
                    inputProps={{ autoComplete: 'off' }}
                    style={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Kênh phân phối
                      </Typography>
                    }
                    options={caIdList || []}
                    optional
                    onSelectOption={value => {
                      setFieldValue('caIds', value);
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <FieldDateRangeFormControl
                    className={`${cssClass}-createdFrom`}
                    name="createdFrom"
                    inputProps={{ autoComplete: 'off' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Thời điểm diễn ra
                      </Typography>
                    }
                    style={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputStyle={{ width: 200, minWidth: 'unset' }}
                    optional
                    placeholder="Từ ngày - đến ngày"
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
