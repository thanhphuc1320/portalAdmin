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
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { API_PATHS } from '../../../../configs/API';
import { some } from '../../../../constants';
import { AppState } from '../../../../redux/reducers';
import { ReactComponent as IconResetFilter } from '../../../../svg/icon-reset-filter.svg';
import { ReactComponent as IconSeach } from '../../../../svg/iconSearch.svg';
import { snackbarSetting } from '../../../common/components/elements';
import { fetchThunk } from '../../../common/redux/thunk';
import { statusOption1 } from '../../constants';

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
}

const Filter: React.FC<Props> = props => {
  const { filter, onUpdateFilter, setLoading } = props;

  const [caIdList, setCaIdList] = useState<some[]>();

  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const fetchCaIdData = useCallback(async () => {
    setLoading(true);
    const json = await dispatch(fetchThunk(API_PATHS.getCaIdList, 'get'));
    if (json?.data) {
      setCaIdList(json.data);
    } else {
      json?.message &&
        enqueueSnackbar(
          json?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
    }
    setLoading(false);
  }, [closeSnackbar, dispatch, enqueueSnackbar, setLoading]);

  useEffect(() => {
    fetchCaIdData();
  }, [fetchCaIdData]);

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
              <Grid container spacing={2} style={{ maxWidth: 930 }}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <FieldTextContent
                    name="name"
                    formControlStyle={{ width: '100%', minWidth: 210 }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Hashtag
                      </Typography>
                    }
                    style={{
                      borderRadius: 4,
                      // borderLeft: 0,
                      marginRight: 0,
                    }}
                    placeholder=""
                    optional
                    inputProps={{ maxLength: 500 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <FieldDateRangeFormControl
                    name="createdFrom"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        <FormattedMessage id="selectDateRange" />
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
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Col style={{ marginTop: 6 }}>
                    <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                      Tài khoản tạo
                    </Typography>
                    <FormControlAutoComplete
                      placeholder="Tài khoản tạo"
                      value={
                        { name: (values as any).createdByName, id: (values as any).id } || null
                      }
                      formControlStyle={{ minWidth: 210, marginRight: 0 }}
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
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <FieldSelectContent
                    name="status"
                    formControlStyle={{ minWidth: 210, marginRight: 0, width: '100%' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Trạng thái
                      </Typography>
                    }
                    options={statusOption1}
                    onSelectOption={value => {
                      setFieldValue('status', value);
                    }}
                    optional
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <FieldSelectContent
                    name="caId"
                    formControlStyle={{ minWidth: 210, marginRight: 0, width: '100%' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Kênh bán
                      </Typography>
                    }
                    options={caIdList || []}
                    optional
                    onSelectOption={value => {
                      setFieldValue('caId', value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Col>
                    <FieldSelectContent
                      name="source"
                      formControlStyle={{ minWidth: 210, marginRight: 0, width: '100%' }}
                      label={
                        <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                          Nguồn gốc
                        </Typography>
                      }
                      options={sourceOption}
                      optional
                      onSelectOption={value => {
                        setFieldValue('source', value);
                      }}
                    />
                  </Col>
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
