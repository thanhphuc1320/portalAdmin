import React, { memo, useState, useEffect, useCallback } from 'react';
import { Card, Grid, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import { isArray } from 'lodash';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { API_PATHS } from 'configs/API';
import { fetchThunk } from 'modules/common/redux/thunk';
import { GRAY, RED } from 'configs/colors';
import { some } from 'configs/utils';
import { FieldSelectContent } from 'modules/common/components/FieldContent';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import { PIN_CATA_OPTIONS, PIN_TAB_OPTIONS_SELECT } from '../../../constants';

const cssClass = 'pin-card';

interface Props {
  filter?: any;
  onUpdateLeftFilter?(filter: some, postIds: any): void;
  caIdList?: some[];
  isError?: boolean;
  itemToRemove: any;
}
const LeftFilter: React.FC<Props> = props => {
  const { caIdList, onUpdateLeftFilter, isError, itemToRemove } = props;
  const [form, setForm] = useState({ caIdLeft: '', tabLeft: '', categoryLeft: '' });
  const [postIds, setPostIds] = useState<some[]>([]);
  const [typeCategory, setTypeCategory] = useState<any>('');
  const [caId, setCaId] = useState<any>();
  const leftFilter = { id: '' };

  useEffect(() => {
    if (onUpdateLeftFilter) onUpdateLeftFilter(form, postIds);
    // eslint-disable-next-line
  }, [form, postIds]);

  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  useEffect(() => {
    setPostIds([]);
    setTypeCategory('');
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (itemToRemove) {
      const findIndexToRemove = postIds.findIndex(ele => ele.id === itemToRemove);
      if (findIndexToRemove !== -1) {
        postIds.splice(findIndexToRemove, 1);
        setPostIds([...postIds]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemToRemove]);

  const fetchAdminPosts = useCallback(
    async (str: string) => {
      const queryParams = `keyword=${str.trimLeft()}&caId=${caId}&status=APPROVED&isActive=true`;
      const json = await dispatch(fetchThunk(`${API_PATHS.adminPostSearch}?${queryParams}`, 'get'));
      return json?.data?.content || [];
    },
    [caId, dispatch],
  );

  const handleChangeForm = (
    value: string | some[] | any[] | undefined | null | never[],
    setFieldValue: any,
    filed: string,
  ) => {
    setForm({ ...form, [filed]: value });
    setFieldValue(filed, value);
    setTypeCategory(value);
    // submitForm();
  };

  const unique = values => {
    const newArr = values.reduce((acc, ele) => {
      if (acc.findIndex(item => item.id === ele.id) === -1) {
        acc.push(ele);
      }
      return acc;
    }, []);
    return newArr;
  };

  const handleChangePost = (value, setFieldValue, field) => {
    const targetIds = isArray(value) ? value?.map(item => item?.id) : [];
    setFieldValue(field, targetIds);
    setPostIds(unique(value));
  };

  return (
    <Card className={`${cssClass}`}>
      <Formik
        enableReinitialize
        initialValues={{
          ...leftFilter,
        }}
        onSubmit={async () => {}}
      >
        {({ setFieldValue }) => {
          return (
            <Form>
              <Grid container>
                <Grid item xs={12} style={{ position: 'relative' }}>
                  <Typography style={{ marginBottom: 10 }} variant="subtitle2">
                    Chuyên mục
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <FieldSelectContent
                    name="caIdLeft"
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
                      setCaId(value);
                      handleChangeForm(value, setFieldValue, 'caIdLeft');
                      setPostIds([]);
                      setFieldValue('categoryLeft', '');
                    }}
                  />
                  {!form?.caIdLeft && isError && (
                    <Typography variant="body2" style={{ color: RED }}>
                      Vui lòng không để trống
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <FieldSelectContent
                    name="tabLeft"
                    placeholder="Tab All"
                    options={PIN_TAB_OPTIONS_SELECT as some[]}
                    onSelectOption={value => handleChangeForm(value, setFieldValue, 'tabLeft')}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Tab
                      </Typography>
                    }
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    optional
                  />
                  {!form?.tabLeft && isError && (
                    <Typography variant="body2" style={{ color: RED }}>
                      Vui lòng không để trống
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <FieldSelectContent
                    name="categoryLeft"
                    placeholder="Tất cả"
                    options={PIN_CATA_OPTIONS as some[]}
                    onSelectOption={value => handleChangeForm(value, setFieldValue, 'categoryLeft')}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Cata
                      </Typography>
                    }
                    formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    inputProps={{ autoComplete: 'off' }}
                    optional
                  />
                  {!form?.categoryLeft && isError && (
                    <Typography variant="body2" style={{ color: RED }}>
                      Vui lòng không để trống
                    </Typography>
                  )}
                </Grid>

                {typeCategory === 'ARTICLE' && (
                  <Grid item xs={12}>
                    <FormControlAutoComplete
                      multiple
                      id="id"
                      label={
                        <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                          Post ID
                        </Typography>
                      }
                      placeholder={!postIds?.length ? 'Post ID' : ''}
                      options={[]}
                      value={postIds}
                      onChange={(e: any, value: some[] | null) => {
                        handleChangePost(value, setFieldValue, 'id');
                        // setFieldValue('id', value?.id);
                      }}
                      getOptionSelected={(option: some, value: some) => {
                        return option?.id === value;
                      }}
                      getOptionLabel={(v: some) => v.id || ''}
                      filterOptions={options => options}
                      optional
                      formControlStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                      loadOptions={fetchAdminPosts}
                    />
                  </Grid>
                )}
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </Card>
  );
};

export default memo(LeftFilter);
