import { Button, Grid, Typography } from '@material-ui/core';
import { GRAY, PINK } from 'configs/colors';
import { Form, Formik } from 'formik';
import { DATE_FORMAT_FILTER_FROM, DATE_FORMAT_FILTER_TO } from 'models/moment';
import { Col } from 'modules/common/components/elements';
import {
  FieldDateRangeFormControl,
  FieldSelectContent,
  FieldTextContent,
} from 'modules/common/components/FieldContent';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import LoadingButton from 'modules/common/components/LoadingButton';
import moment from 'moment';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { API_PATHS } from '../../../../configs/API';
import { some } from '../../../../constants';
import { AppState } from '../../../../redux/reducers';
import { ReactComponent as IconResetFilter } from '../../../../svg/icon-reset-filter.svg';
import { ReactComponent as IconSeach } from '../../../../svg/iconSearch.svg';
import { fetchThunk } from '../../../common/redux/thunk';
import { statusOption2 } from '../../constants';

export const sourceOption = [
  {
    id: 'ADMIN',
    name: 'ADMIN',
  },
  {
    id: 'USER',
    name: 'USER',
  },
];
interface Props {
  filter: any;
  onUpdateFilter(filter: some): void;
  loading: boolean;
  setLoading(value: boolean): void;
  caIdList: any;
}

const Filter: React.FC<Props> = props => {
  const { filter, onUpdateFilter, caIdList } = props;

  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  return (
    <>
      <Formik
        initialValues={{
          ...filter,
        }}
        onSubmit={values => {
          onUpdateFilter(values);
        }}
      >
        {({ values, resetForm, setFieldValue }) => {
          return (
            <Form>
              <Grid spacing={2} style={{ maxWidth: 930 }} container>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                  <FieldTextContent
                    name="name"
                    formControlStyle={{ width: '100%', minWidth: 210 }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Tên Bảng xếp hạng
                      </Typography>
                    }
                    style={{
                      borderRadius: 4,
                      // borderLeft: 0,
                      // marginRight: 12,
                    }}
                    placeholder=""
                    optional
                    inputProps={{ maxLength: 500 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                  <FieldSelectContent
                    name="caId"
                    formControlStyle={{ width: '100%', minWidth: 210 }}
                    placeholder="Tất cả"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Kênh bán áp dụng
                      </Typography>
                    }
                    style={{
                      marginRight: 0,
                    }}
                    options={caIdList}
                    onSelectOption={value => {
                      setFieldValue('caId', value);
                    }}
                    optional
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                  <FieldDateRangeFormControl
                    formControlStyle={{ width: '100%', marginRight: 0 }}
                    name="startDate "
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Khoảng thời gian áp dụng
                      </Typography>
                    }
                    style={{ minWidth: 210, marginRight: 0 }}
                    optional
                    startDate={
                      values.startDate &&
                      moment(values.startDate, DATE_FORMAT_FILTER_FROM, true).isValid()
                        ? moment(values.startDate, DATE_FORMAT_FILTER_FROM, true)
                        : undefined
                    }
                    endDate={
                      values.endDate &&
                      moment(values.endDate, DATE_FORMAT_FILTER_TO, true).isValid()
                        ? moment(values.endDate, DATE_FORMAT_FILTER_TO, true)
                        : undefined
                    }
                    onChange={(startDate, endDate) => {
                      setFieldValue('startDate ', startDate?.format(DATE_FORMAT_FILTER_FROM), true);
                      setFieldValue(
                        'endDate',
                        startDate && !endDate
                          ? moment().format(DATE_FORMAT_FILTER_TO)
                          : endDate?.format(DATE_FORMAT_FILTER_TO),
                        true,
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                  <FieldSelectContent
                    formControlStyle={{ width: '100%', marginRight: 0 }}
                    style={{ minWidth: 210 }}
                    name="status"
                    placeholder="Tất cả"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Trạng thái Bảng xếp hạng
                      </Typography>
                    }
                    options={statusOption2}
                    onSelectOption={value => {
                      setFieldValue('status', value);
                    }}
                    optional
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                  <Col style={{ marginTop: 2 }}>
                    <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                      Tài khoản tạo Bảng
                    </Typography>
                    <FormControlAutoComplete
                      placeholder="Tài khoản tạo Bảng"
                      value={
                        { name: (values as any).createdByName, id: (values as any).id } || null
                      }
                      formControlStyle={{ minWidth: 210 }}
                      onChange={(e: any, value: some | null) => {
                        setFieldValue('createdBy', value?.id);
                        setFieldValue('createdByName', value?.name);
                      }}
                      loadOptions={async (str: string) => {
                        let tempUrl = '';
                        if (!str) {
                          tempUrl = `${API_PATHS.suggestUsers}`;
                        } else {
                          tempUrl = `${API_PATHS.suggestUsers}?search=${str.trimLeft()}`;
                        }
                        const json = await dispatch(fetchThunk(tempUrl, 'post'));
                        // eslint-disable-next-line consistent-return
                        return json?.data?.content;
                      }}
                      getOptionSelected={(option: some, value: some) => {
                        return option?.id === value?.id;
                      }}
                      getOptionLabel={(v: some) => v?.name}
                      filterOptions={options => options}
                      options={[]}
                      optional
                    />
                  </Col>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                  <FieldDateRangeFormControl
                    name="createdFrom"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Khoảng thời gian tạo
                      </Typography>
                    }
                    style={{ minWidth: 210, marginRight: 0 }}
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
                <Grid item xs={12} sm={6} md={6} lg={3}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    style={{
                      minWidth: 210,
                      minHeight: 40,
                      marginTop: 22,
                      width: '100%',
                    }}
                    color="primary"
                    disableElevation
                    loading={false}
                  >
                    <IconSeach style={{ marginRight: 8 }} />
                    <FormattedMessage id="search" />
                  </LoadingButton>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Button
                    style={{
                      border: '1px solid rgb(204 0 102)',
                      padding: 8,
                      minWidth: 210,
                      minHeight: 40,
                      marginTop: 22,
                      width: '100%',
                    }}
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      resetForm();
                      onUpdateFilter({});
                    }}
                  >
                    <IconResetFilter style={{ marginRight: 8 }} />
                    <Typography variant="button" style={{ color: PINK }}>
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
