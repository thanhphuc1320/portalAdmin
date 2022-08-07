import { Button, Grid, Typography } from '@material-ui/core';
import { API_PATHS } from 'configs/API';
import { GRAY, PINK } from 'configs/colors';
import { Form, Formik } from 'formik';
import { DATE_FORMAT_FILTER_FROM, DATE_FORMAT_FILTER_TO } from 'models/moment';
import DateRangeFormControl from 'modules/common/components/DateRangeFormControl';
import { FormControlAutoComplete } from 'modules/common/components/FormControlAutoComplete';
import { fetchThunk } from 'modules/common/redux/thunk';
import moment from 'moment';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { some } from 'configs/utils';
import { AppState } from 'redux/reducers';
import { ReactComponent as IconResetFilter } from 'svg/icon-reset-filter.svg';
import { ReactComponent as IconSeach } from 'svg/iconSearch.svg';
import { FieldSelectContent, FieldTextContent } from '../../../common/components/FieldContent';
import LoadingButton from '../../../common/components/LoadingButton';
import {
  NOTIFICATION_PAGE,
  NOTIFICATION_SIZE,
  NOTIFICATION_SORT,
  REPLY_COMMENT,
  STATUS_NOTIFICATION,
  USER_INTER_ACTON,
} from '../constants';

interface Props {
  caIdList?: some[];
  filter?: some;
  hadleFilter: (value: some) => void;
}

const Filter: React.FC<Props> = props => {
  const { caIdList, filter, hadleFilter } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          ...filter,
        }}
        onSubmit={values => {
          hadleFilter && hadleFilter(values);
        }}
      >
        {({ values, resetForm, setFieldValue }) => {
          return (
            <Form>
              <Grid spacing={2} container>
                <Grid item xs={12} sm={6} md={6} lg={4}>
                  <DateRangeFormControl
                    formControlStyle={{ width: '100%', marginRight: 0, minWidth: 'unset' }}
                    style={{ minWidth: 'unset', width: '100%' }}
                    optional
                    name="followedFrom"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Thời gian nhận thông báo
                      </Typography>
                    }
                    startDate={
                      values.createdFrom
                        ? moment(values.createdFrom, DATE_FORMAT_FILTER_FROM, true)
                        : undefined
                    }
                    endDate={
                      values.createdTo ? moment(values.createdTo, DATE_FORMAT_FILTER_TO) : undefined
                    }
                    onChange={(startDate, endDate) => {
                      setFieldValue(
                        'createdFrom',
                        startDate?.format(DATE_FORMAT_FILTER_FROM),
                        true,
                      );
                      setFieldValue('createdTo', endDate?.format(DATE_FORMAT_FILTER_TO), true);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={2}>
                  <FieldTextContent
                    name="postId"
                    formControlStyle={{ width: '100%', marginRight: 0, minWidth: 'unset' }}
                    style={{ minWidth: 'unset', width: '100%', borderRadius: 4, marginRight: 0 }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        PostID
                      </Typography>
                    }
                    onChange={val => {
                      setFieldValue('postId', val?.target?.value);
                    }}
                    placeholder="PostID"
                    optional
                    inputProps={{ maxLength: 500 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={2}>
                  <FieldTextContent
                    name="sender"
                    placeholder="UserID"
                    formControlStyle={{ width: '100%', marginRight: 0, minWidth: 'unset' }}
                    style={{ minWidth: 'unset', width: '100%', borderRadius: 4, marginRight: 0 }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        User tương tác
                      </Typography>
                    }
                    onChange={val => {
                      setFieldValue('sender', val?.target?.value);
                    }}
                    optional
                    inputProps={{ maxLength: 500 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={2}>
                  <FieldSelectContent
                    name="event"
                    formControlStyle={{ width: '100%', marginRight: 0, minWidth: 'unset' }}
                    style={{ minWidth: 'unset', width: '100%' }}
                    placeholder="Tất cả"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Loại tương tác
                      </Typography>
                    }
                    options={USER_INTER_ACTON}
                    onSelectOption={value => {
                      setFieldValue('event', value);
                    }}
                    optional
                  />
                </Grid>
              </Grid>
              <Grid spacing={2} container>
                <Grid item xs={12} sm={6} md={6} lg={2}>
                  <FieldSelectContent
                    name="caId"
                    value={values?.caId && Number(values?.caId)}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Kênh chia sẻ
                      </Typography>
                    }
                    options={caIdList as some[]}
                    getOptionLabel={(one: some) => one.name}
                    optional
                    onSelectOption={(value: any) => {
                      setFieldValue('caId', value);
                    }}
                    formControlStyle={{ width: '100%', marginRight: 0, minWidth: 'unset' }}
                    style={{ minWidth: 'unset', width: '100%' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={2}>
                  <FieldSelectContent
                    formControlStyle={{ width: '100%', marginRight: 0, minWidth: 'unset' }}
                    style={{ minWidth: 'unset', width: '100%' }}
                    name="reply"
                    placeholder="Tất cả"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Phản hồi bình luận
                      </Typography>
                    }
                    options={REPLY_COMMENT}
                    onSelectOption={value => {
                      setFieldValue('reply', value);
                    }}
                    optional
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={2}>
                  <FormControlAutoComplete
                    multiple
                    placeholder="Tất cả"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Tài khoản nội bộ
                      </Typography>
                    }
                    formControlStyle={{ width: '100%', marginRight: 0, minWidth: 'unset' }}
                    style={{ minWidth: 'unset', width: '100%' }}
                    onChange={(e: any, value: some[] | null) => {
                      setFieldValue('receiver', value);
                    }}
                    value={values?.receiver}
                    loadOptions={async (str: string) => {
                      let tempUrl = '';
                      if (!str) {
                        tempUrl = `${API_PATHS.searchSourceUser}`;
                      } else {
                        tempUrl = `${API_PATHS.searchSourceUser}?search=${str.trimLeft()}`;
                      }
                      const json = await dispatch(fetchThunk(tempUrl, 'post'));
                      // eslint-disable-next-line consistent-return
                      return json?.data?.content;
                    }}
                    getOptionSelected={() => {
                      return false;
                    }}
                    getOptionLabel={(v: some) => v?.name}
                    filterOptions={options => options}
                    options={[]}
                    optional
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={2}>
                  <FieldSelectContent
                    name="status"
                    placeholder="Tất cả"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Trạng thái
                      </Typography>
                    }
                    formControlStyle={{ width: '100%', marginRight: 0, minWidth: 'unset' }}
                    style={{ minWidth: 'unset', width: '100%' }}
                    options={STATUS_NOTIFICATION}
                    onSelectOption={value => {
                      setFieldValue('status', value);
                    }}
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
                      minWidth: 'unset',
                      minHeight: 40,
                      marginTop: 22,
                      width: '100%',
                      background: 'transparent',
                    }}
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      hadleFilter({
                        size: NOTIFICATION_SIZE,
                        page: NOTIFICATION_PAGE,
                        sort: NOTIFICATION_SORT,
                      });
                      resetForm();
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
