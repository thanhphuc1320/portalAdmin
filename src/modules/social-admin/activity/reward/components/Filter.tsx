import { Card, Button, Grid, Typography, IconButton } from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';
import SearchIcon from '@material-ui/icons/Search';
import { Form, Formik } from 'formik';
import moment from 'moment';
import React from 'react';
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
import { STATUS_REWARD } from 'modules/social-admin/constants';

const cssClass = 'reward-filter-card';
interface Props {
  filter?: any;
  onUpdateFilter?(filter: some): void;
  caIdList?: some[];
  typeList?: some[];
  loading?: boolean;
  setLoading(value: boolean): void;
  hashTagsList?: some[];
  onToggleFilter?(): void;
}
const Filter: React.FC<Props> = props => {
  const { filter, caIdList, typeList, onUpdateFilter, loading, onToggleFilter } = props;
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
                    B??? l???c
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FieldTextContent
                    name="code"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Reward ID
                      </Typography>
                    }
                    placeholder="T???t c???"
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
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
                        Reward Name
                      </Typography>
                    }
                    placeholder="T???t c???"
                    optional
                  />
                </Grid>

                <Grid item xs={12}>
                  <FieldTextContent
                    name="createdBy"
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Ng?????i kh???i t???o
                      </Typography>
                    }
                    placeholder="T???t c???"
                    optional
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <FieldDateRangeFormControl
                    className={`${cssClass}-createdFrom`}
                    name="createdFrom"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Kho???ng th???i gian
                      </Typography>
                    }
                    style={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputStyle={{ width: 200, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    optional
                    placeholder="T??? ng??y - ?????n ng??y"
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
                      Th???i gian (?????n ng??y) ph???i l???n h??n th???i gian (T??? Ng??y). Vui l??ng nh???p l???i.
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <FieldSelectContent
                    name="type"
                    placeholder="T???t c???"
                    formControlStyle={{ marginRight: 0, width: 200 }}
                    style={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Lo???i
                      </Typography>
                    }
                    options={typeList || []}
                    optional
                    onSelectOption={value => {
                      setFieldValue('type', value);
                    }}
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
                    placeholder="T???t c???"
                    formControlStyle={{ marginRight: 0, width: 200 }}
                    inputProps={{ autoComplete: 'off' }}
                    style={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        K??nh ph??n ph???i
                      </Typography>
                    }
                    options={caIdList || []}
                    optional
                    onSelectOption={value => {
                      setFieldValue('caIds', value);
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FieldSelectContent
                    name="active"
                    placeholder="T???t c???"
                    formControlStyle={{ marginRight: 0, width: 200 }}
                    style={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Hi???n th???
                      </Typography>
                    }
                    options={STATUS_REWARD}
                    optional
                    onSelectOption={value => {
                      setFieldValue('active', value);
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
                    ?????t l???i b??? l???c
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
