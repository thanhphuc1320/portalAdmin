import React, { useCallback, useRef, useState } from 'react';
import {
  Card,
  Button,
  Grid,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Box,
  Chip,
} from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';

import { Form, Formik } from 'formik';
import moment, { Moment } from 'moment';
import { FormattedMessage } from 'react-intl';
import { isArray } from 'lodash';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { API_PATHS } from 'configs/API';
import { fetchThunk } from 'modules/common/redux/thunk';
import { GRAY } from 'configs/colors';
import { some } from 'configs/utils';
import { DATE_FORMAT, DATE_TIME_HOUR_FORMAT_DB } from 'models/moment';
import { ReactComponent as IconResetFilter } from 'svg/icon_reset_filter.svg';
import { FieldSelectContent } from 'modules/common/components/FieldContent';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import DatetimePickerField from 'modules/common/components/DatetimePickerField';
import LoadingButton from 'modules/common/components/LoadingButton';
import { PIN_CATA_OPTIONS, PIN_STATUS, PIN_TAB_OPTIONS_SELECT } from '../constants';

const cssClass = 'reward-filter-card';
interface Props {
  filter?: any;
  onUpdateFilter?(filter: some): void;
  caIdList: some[];
  sectionList: some[];
  onToggleFilter?(): void;
}
const Filter: React.FC<Props> = props => {
  const { filter, caIdList, onUpdateFilter, onToggleFilter } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const inputRefChip = useRef<any>();

  const [chipData, setChipData] = useState<any>([]);
  const [chipDataTemp, setChipDataTemp] = useState('');
  const [listFilterCode, setListFilterCode] = useState<any>([]);
  const [listFilterPostId, setListFilterPostId] = useState<any>([]);

  const handleAddChip = () => {
    const isExitChip = chipData.includes(+chipDataTemp);
    if (!isExitChip && chipDataTemp !== '') {
      setChipData([...chipData, +chipDataTemp]);
      inputRefChip.current.value = '';
    }
  };

  const handleDeleteChip = chipToDelete => {
    // eslint-disable-next-line
    setChipData(chipData => chipData.filter(chip => chip !== chipToDelete));
  };

  const fetchAdminPins = useCallback(
    async (str: string) => {
      const json = await dispatch(
        fetchThunk(`${API_PATHS.getAdminPins}?code=${str.trimLeft()}`, 'get'),
      );
      return json?.data?.content || [];
    },
    [dispatch],
  );

  return (
    <Card className={`${cssClass}`}>
      <Formik
        enableReinitialize
        initialValues={{
          ...filter,
          caId: filter?.caId ? Number(filter?.caId) : undefined,
        }}
        onSubmit={values => {
          if (values.category?.length > 0) {
            const convertParams = values.category.map(item => {
              if (item === 'SECTION') item = 'Section';
              if (item === 'ARTICLE') item = 'Post';
              return item;
            });
            values.modelType = convertParams;
          }
          values = { ...values, offset: chipData };
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
                    name="caId"
                    placeholder="Tất cả"
                    formControlStyle={{ marginRight: 0, width: 200 }}
                    style={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Ca ID
                      </Typography>
                    }
                    options={caIdList as some[]}
                    optional
                    onSelectOption={value => {
                      setFieldValue('caId', value);
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FieldSelectContent
                    name="tabType"
                    placeholder="Tab All"
                    value={values?.tabType}
                    options={PIN_TAB_OPTIONS_SELECT as some[]}
                    onSelectOption={value => {
                      setFieldValue('tabType', value);
                    }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Tab hiển thị
                      </Typography>
                    }
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    optional
                  />
                </Grid>

                <Grid item xs={12}>
                  <FieldSelectContent
                    multiple
                    name="category"
                    placeholder="Tất cả"
                    value={
                      values?.category &&
                      (isArray(values?.category) ? values?.category : [values?.category])
                    }
                    options={PIN_CATA_OPTIONS as some[]}
                    onSelectOption={value => {
                      setFieldValue('category', value);
                    }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Phân loại
                      </Typography>
                    }
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    optional
                  />
                </Grid>

                <Grid item xs={12} style={{ minHeight: 82 }}>
                  <FormControlAutoComplete
                    multiple
                    id="code"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Pin ID
                      </Typography>
                    }
                    value={listFilterCode}
                    placeholder="Tất cả"
                    options={[]}
                    loadOptions={fetchAdminPins}
                    onChange={(e: any, value: some[] | null) => {
                      setListFilterCode(value);
                      const codes = isArray(value) ? value?.map(item => item?.code) : [];
                      setFieldValue('code', codes);
                    }}
                    getOptionSelected={(option: some, value: some) => {
                      return option?.code === value;
                    }}
                    getOptionLabel={(v: some) => v.code}
                    filterOptions={options => options}
                    getOptionDisabled={(option: some) => {
                      return values?.code?.includes(option?.code);
                    }}
                    optional
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                  />
                </Grid>

                <Grid item xs={12} style={{ position: 'relative', marginBottom: 10 }}>
                  <Typography
                    variant="caption"
                    style={{
                      position: 'absolute',
                      color: GRAY,
                      fontWeight: 'bold',
                      top: 5,
                    }}
                  >
                    Vị trí xuất hiện
                  </Typography>
                  <FormControl
                    variant="outlined"
                    aria-label="Vị trí xuất hiện"
                    style={{ marginTop: '10px' }}
                  >
                    <InputLabel htmlFor="outlined-adornment-location" style={{ top: 14 }}>
                      {' '}
                      Nhập vị trí
                    </InputLabel>
                    <OutlinedInput
                      inputRef={inputRefChip}
                      id="outlined-adornment-location"
                      type="text"
                      value={values.chip}
                      onChange={event => setChipDataTemp(event.target.value)}
                      endAdornment={
                        <InputAdornment
                          style={{ paddingTop: '10px', paddingBottom: '10px' }}
                          position="end"
                        >
                          <AddBoxIcon
                            style={{ cursor: 'pointer' }}
                            color="primary"
                            onClick={handleAddChip}
                          />
                        </InputAdornment>
                      }
                      labelWidth={70}
                    />
                  </FormControl>
                  <Box
                    style={{
                      maxHeight: '80px',
                      overflowY: 'auto',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      flexWrap: 'wrap',
                    }}
                  >
                    {chipData?.map(data => {
                      return (
                        <div style={{ marginLeft: '5px', marginTop: '5px' }}>
                          <Chip label={data} onDelete={() => handleDeleteChip(data)} />
                        </div>
                      );
                    })}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <FormControlAutoComplete
                    multiple
                    id="targetId"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Post ID / Section ID
                      </Typography>
                    }
                    placeholder="Tất cả"
                    loadOptions={fetchAdminPins}
                    options={[]}
                    value={listFilterPostId}
                    onChange={(e: any, value: some[] | null) => {
                      setListFilterPostId(value);
                      const targetIds = isArray(value) ? value?.map(item => item?.targetId) : [];
                      setFieldValue('targetId', targetIds);
                    }}
                    getOptionSelected={(option: some, value: some) => {
                      return option?.targetId === value;
                    }}
                    getOptionLabel={(v: some) => v?.targetId}
                    filterOptions={options => options}
                    optional
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <DatetimePickerField
                    id="beginFrom"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Khoảng thời gian
                      </Typography>
                    }
                    placeholder="Từ ngày"
                    inputStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    optional
                    formatDate={DATE_FORMAT}
                    date={values?.beginFrom ? moment(values?.beginFrom) : undefined}
                    onChange={(beginFrom: Moment | null) => {
                      setFieldValue(
                        'beginFrom',
                        beginFrom ? moment(beginFrom).format(DATE_TIME_HOUR_FORMAT_DB) : '',
                      );
                      setFieldValue('endTo', '');
                    }}
                    isDisableTime
                  />

                  <DatetimePickerField
                    id="endTo"
                    placeholder="Đến ngày"
                    inputStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    optional
                    date={values?.endTo ? moment(values?.endTo) : undefined}
                    minDate={values?.beginFrom}
                    onChange={(endTo: Moment | null) => {
                      setFieldValue(
                        'endTo',
                        endTo ? moment(endTo).format(DATE_TIME_HOUR_FORMAT_DB) : null,
                      );
                    }}
                    isDisableTime
                    formatDate={DATE_FORMAT}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FieldSelectContent
                    name="active"
                    placeholder="Tất cả"
                    formControlStyle={{ marginRight: 0, width: 200 }}
                    style={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Hiển thị
                      </Typography>
                    }
                    options={PIN_STATUS}
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
                      setChipData([]);
                      setListFilterCode([]);
                      setListFilterPostId([]);
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
