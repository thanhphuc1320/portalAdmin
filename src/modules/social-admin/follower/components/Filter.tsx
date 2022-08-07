import { Button, Grid, Typography } from '@material-ui/core';
import { API_PATHS } from 'configs/API';
import { GRAY, PINK } from 'configs/colors';
import { Form, Formik } from 'formik';
import { DATE_FORMAT_FILTER_FROM } from 'models/moment';
import DateRangeFormControl from 'modules/common/components/DateRangeFormControl';
import { snackbarSetting } from 'modules/common/components/elements';
import { FormControlAutoComplete } from 'modules/common/components/FormControlAutoComplete';
import { fetchThunk } from 'modules/common/redux/thunk';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { some } from '../../../../constants';
import { AppState } from '../../../../redux/reducers';
import { ReactComponent as IconResetFilter } from '../../../../svg/icon-reset-filter.svg';
import { ReactComponent as IconSeach } from '../../../../svg/iconSearch.svg';
import LoadingButton from '../../../common/components/LoadingButton';
import { DATE_FORMAT, FOLLOWER_PAGE, FOLLOWER_SIZE } from '../constants';

interface Props {
  hadleFilter: (value: some) => void;
}

const Filter: React.FC<Props> = ({ hadleFilter }) => {
  const [optionSourceUser, setOptionSourceUser] = useState<any>();
  const [sourceUserId, setSourceUserId] = useState<some | null>();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const history = useHistory();
  const location = useLocation();

  const searchSourceUsers = useCallback(async () => {
    const json = await dispatch(fetchThunk(`${API_PATHS.searchSourceUser}`, 'post'));
    if (json?.code === 200) {
      setOptionSourceUser(json?.data?.content);
    } else {
      json?.message &&
        enqueueSnackbar(
          json?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
    }
  }, [closeSnackbar, dispatch, enqueueSnackbar]);

  useEffect(() => {
    searchSourceUsers();
  }, [searchSourceUsers]);

  return (
    <>
      <Formik
        initialValues={{
          page: FOLLOWER_PAGE,
          size: FOLLOWER_SIZE,
          sort: 'followedAt,desc',
          targetUserId: 0,
          sourceUserId: null,
          followedFrom: null,
          followedTo: null,
        }}
        onSubmit={values => {
          const arraySourceUserId = sourceUserId?.map(val => val?.id);

          hadleFilter({
            ...values,
            sourceUserId: arraySourceUserId,
            followedFrom:
              values?.followedFrom &&
              `${moment(values?.followedFrom).format(DATE_FORMAT)}T00:00:00.000Z`,
            followedTo:
              values?.followedTo &&
              `${moment(values?.followedTo).format(DATE_FORMAT)}T00:00:00.000Z`,
          });
        }}
      >
        {({ values, resetForm, setFieldValue }) => {
          return (
            <Form>
              <Grid spacing={2} container>
                <Grid item xs={12} sm={6} md={6} lg={2}>
                  <FormControlAutoComplete
                    optional
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Tài khoản nội bộ
                      </Typography>
                    }
                    multiple
                    formControlStyle={{ width: '100%', marginRight: 0, minWidth: 'unset' }}
                    style={{ minWidth: 'unset', width: '100%' }}
                    placeholder="Tất cả"
                    onChange={(e: any, value: some | null) => {
                      setSourceUserId(value);
                    }}
                    options={optionSourceUser}
                    getOptionLabel={(value: some) => value.name}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={2}>
                  <DateRangeFormControl
                    optional
                    name="followedFrom"
                    formControlStyle={{ width: '100%', marginRight: 0, minWidth: 'unset' }}
                    style={{ minWidth: 'unset', width: '100%' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Khoảng thời gian theo dõi
                      </Typography>
                    }
                    startDate={
                      values.followedFrom
                        ? moment(values.followedFrom, DATE_FORMAT_FILTER_FROM, true)
                        : undefined
                    }
                    endDate={
                      values.followedTo
                        ? moment(values.followedTo, DATE_FORMAT_FILTER_FROM, true)
                        : undefined
                    }
                    onChange={(start, end) => {
                      setFieldValue('createdFrom', start);
                      setFieldValue('createdTo', end);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={2}>
                  <FormControlAutoComplete
                    placeholder="User"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Theo dõi User
                      </Typography>
                    }
                    value={
                      { name: (values as any).targetUserIdName, id: (values as any).id } || null
                    }
                    formControlStyle={{ width: '100%', marginRight: 0, minWidth: 'unset' }}
                    style={{ minWidth: 'unset', width: '100%' }}
                    onChange={(e: any, value: some | null) => {
                      setFieldValue('targetUserId', value?.id);
                      setFieldValue('targetUserIdName', value?.name);
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
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={2}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    style={{
                      minWidth: 'unset',
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
                <Grid item xs={12} sm={6} md={4} lg={2}>
                  <Button
                    style={{
                      border: '1px solid rgb(204 0 102)',
                      padding: 8,
                      minWidth: 'uset',
                      minHeight: 40,
                      marginTop: 22,
                      width: '100%',
                      background: 'transparent',
                    }}
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      resetForm();
                      hadleFilter({
                        page: FOLLOWER_PAGE,
                        size: FOLLOWER_SIZE,
                        sort: 'followedAt,desc',
                      });
                      history?.push(location?.pathname);
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
