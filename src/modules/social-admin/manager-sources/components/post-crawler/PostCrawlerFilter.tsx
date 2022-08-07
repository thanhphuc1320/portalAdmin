import { Button, Card, Grid, IconButton, Typography } from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';
import SearchIcon from '@material-ui/icons/Search';
import { Form, Formik } from 'formik';
import { isArray } from 'lodash';
import { DATE_FORMAT_FILTER_FROM, DATE_FORMAT_FILTER_TO } from 'models/moment';
import {
  FieldDateRangeFormControl,
  FieldSelectContent,
} from 'modules/common/components/FieldContent';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import LoadingButton from 'modules/common/components/LoadingButton';
import { fetchThunk } from 'modules/common/redux/thunk';
import moment from 'moment';
import React, { useState, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { ReactComponent as IconResetFilter } from 'svg/icon_reset_filter.svg';
import { SOURCE_LIST } from '../../constants';
import { API_PATHS } from 'configs/API';
import { GRAY, RED } from 'configs/colors';
import { some } from 'configs/utils';

const cssClass = 'reward-filter-card';
interface Props {
  filter?: any;
  onUpdateFilter?(filter: some): void;
  caIdList: some[];
  onToggleFilter?(): void;
}
const PostCrawlerFilter: React.FC<Props> = props => {
  const { filter, caIdList, onUpdateFilter, onToggleFilter } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [filterPostIds, setFilterPostIds] = useState<any>([]);
  const [filterCrawlerIds, setFilterCrawlerIds] = useState<any>([]);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [isErrorCreatedAt, setIsErrorCreatedAt] = useState<boolean>(false);

  const getAdminCrawlersPostIds = useCallback(
    async (str: string) => {
      const json = await dispatch(
        fetchThunk(`${API_PATHS.getAdminCrawlersPostIds}?keyword=${str.trimLeft()}`, 'get'),
      );
      return json?.data || [];
    },
    [dispatch],
  );

  const getAdminCrawlersCodes = useCallback(
    async (str: string) => {
      const json = await dispatch(
        fetchThunk(`${API_PATHS.getAdminCrawlersCodes}?keyword=${str.trimLeft()}&size=10`, 'get'),
      );
      return json?.data || [];
    },
    [dispatch],
  );

  React.useEffect(() => {
    setFilterCrawlerIds([]);
    setFilterPostIds([]);
  }, [filter.name]);

  React.useEffect(() => {
    if (filter.codes && !isFilter) {
      const code = { name: filter.codes };
      setFilterCrawlerIds([...filterCrawlerIds, code]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.codes, isFilter]);

  return (
    <Card className={`${cssClass}`}>
      <Formik
        enableReinitialize
        initialValues={{
          ...filter,
          caId: filter?.caId ? Number(filter?.caId) : undefined,
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
                  <FormControlAutoComplete
                    multiple
                    id="postIds"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Post ID
                      </Typography>
                    }
                    placeholder={filterPostIds.length !== 0 ? undefined : ' Nhập... '}
                    value={filterPostIds}
                    options={[]}
                    loadOptions={getAdminCrawlersPostIds}
                    onChange={(e: any, value: some[] | null) => {
                      setFilterPostIds(value);
                      const postIds = isArray(value) ? value?.map(item => item?.id) : [];
                      setFieldValue('postIds', postIds);
                    }}
                    getOptionSelected={(option: some, value: some) => {
                      return option?.id === value?.id;
                    }}
                    getOptionLabel={(v: some) => v?.id}
                    filterOptions={options => options}
                    optional
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlAutoComplete
                    multiple
                    id="codes"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Crawler ID
                      </Typography>
                    }
                    placeholder={filterCrawlerIds.length !== 0 ? undefined : ' Nhập... '}
                    value={filterCrawlerIds}
                    options={[]}
                    loadOptions={getAdminCrawlersCodes}
                    onChange={(e: any, value: some[] | null) => {
                      setFilterCrawlerIds(value);
                      const codes = isArray(value) ? value?.map(item => item?.name) : [];
                      setFieldValue('codes', codes);
                    }}
                    getOptionSelected={(option: some, valueItem: some) => {
                      return option?.name === valueItem?.name;
                    }}
                    getOptionLabel={(v: some) => v?.name}
                    filterOptions={options => options}
                    optional
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FieldSelectContent
                    multiple
                    name="providers"
                    placeholder="Tất cả"
                    value={
                      values?.providers &&
                      (isArray(values?.providers) ? values?.providers : [values?.providers])
                    }
                    formControlStyle={{ marginRight: 0, width: 200 }}
                    style={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Nguồn
                      </Typography>
                    }
                    options={SOURCE_LIST}
                    optional
                    onSelectOption={value => {
                      setFieldValue('providers', value);
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FieldSelectContent
                    multiple
                    name="caIds"
                    placeholder="Tất cả"
                    value={
                      values?.caIds &&
                      (isArray(values?.caIds) ? values?.caIds : [values?.caIds]).map(Number)
                    }
                    formControlStyle={{ marginRight: 0, width: 200 }}
                    style={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Ca ID đã phân phối
                      </Typography>
                    }
                    options={caIdList as some[]}
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
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Ngày tạo
                      </Typography>
                    }
                    placeholder="Từ ngày - đến ngày"
                    style={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputStyle={{ width: 200, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    directionWrapper="top"
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
                      if (startDate && moment(startDate) > moment(endDate)) {
                        setIsErrorCreatedAt(true);
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
                        setIsErrorCreatedAt(false);
                      }
                    }}
                  />
                  {isErrorCreatedAt && (
                    <Typography variant="body2" style={{ color: RED, width: 200, marginTop: -15 }}>
                      Ngày kết thúc phải lớn hơn ngày bắt đầu. Vui lòng nhập lại.
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
                      setFilterPostIds([]);
                      setFilterCrawlerIds([]);
                      setIsFilter(false);
                      setIsErrorCreatedAt(false);
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

export default React.memo(PostCrawlerFilter);
