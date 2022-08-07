import { Box, Grid, Paper, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import { C_DATE_FORMAT } from 'models/moment';
import ConfirmDialog from 'modules/common/components/ConfirmDialog';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import LoadingButton from 'modules/common/components/LoadingButton';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import querystring from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as yup from 'yup';
import { API_PATHS } from 'configs/API';
import { GRAY } from 'configs/colors';
import { some } from '../../../../constants';
import { AppState } from 'redux/reducers';
import { Row, snackbarSetting } from 'modules/common/components/elements';
import HashtagRankingdsDnd from './hashtagRankingdsDnd';
import {
  FieldDateRangeFormControl,
  FieldSelectContent,
  FieldTextContent,
} from 'modules/common/components/FieldContent';
import LoadingIcon from 'modules/common/components/LoadingIcon';
import { fetchThunk } from 'modules/common/redux/thunk';
import { statusOption2 } from '../../constants';

interface Props {}
const CreateHashTagRanking: React.FC<Props> = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [loading, setLoading] = React.useState(false);
  const [caIdList, setCaIdList] = useState<some[]>([]);
  const [caIdFix, setCaIdFix] = useState<number>();
  const [dataRows, setDataRows] = useState<some[]>([]);
  const [dataHashTag, setDataHashTag] = useState({ name: '', caId: 0, startDate: '', endDate: '' });
  const [timeRangeStt, setTimeRangeStt] = useState<some[]>([]);

  const location = useLocation();
  const isUpdate = location?.pathname.includes('update');
  const idUpdate = Number((location as any).query?.id) || undefined;

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory();

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

  const fetchHashTagRanking = useCallback(async () => {
    setLoading(true);
    const json = await dispatch(fetchThunk(`${API_PATHS.getHashTagRanking}?id=${idUpdate}`, 'get'));
    if (json?.data) {
      setDataHashTag(json.data?.content[0]);
      const tempDataRows = json.data?.content[0]?.items?.map(element => {
        return { ...element.hashTag, serviceType: element.serviceType };
      });
      setDataRows(tempDataRows);
      setCaIdFix(json.data?.content[0]?.caId);
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
  }, [closeSnackbar, dispatch, enqueueSnackbar, idUpdate]);

  const createHashTagRanking = useCallback(
    async (value: any) => {
      const hashtagIds = dataRows.map(elemenet => elemenet.id);
      const params = {
        caId: value.caId,
        name: value.name,
        status: value.status,
        startDate: value.startDate,
        endDate: value.endDate,
        hashtagIds,
      };
      setLoading(true);
      const tempMethod = isUpdate ? 'put' : 'post';
      const tempUrl = isUpdate
        ? `${API_PATHS.getHashTagRanking}?id=${idUpdate}`
        : API_PATHS.getHashTagRanking;
      const json = await dispatch(fetchThunk(tempUrl, tempMethod, JSON.stringify(params)));
      if (json?.code === 200) {
        history.push('/hashtag-ranking');
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'success',
            }),
          );
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
    },
    [closeSnackbar, dataRows, dispatch, enqueueSnackbar, history, idUpdate, isUpdate],
  );

  const actionSuggestHashTag = useCallback(
    async str => {
      const searchStr = querystring.stringify({
        caId: caIdFix,
        search: str.trimLeft(),
      });
      let tempUrl = '';
      if (!str) {
        return;
      }
      tempUrl = `${API_PATHS.suggestHashTags}?${searchStr}`;
      const json = await dispatch(fetchThunk(tempUrl, 'post'));
      // eslint-disable-next-line consistent-return
      return json?.data?.content;
    },
    [caIdFix, dispatch],
  );

  const actionsCheckTimeRange = useCallback(
    async values => {
      const params = {
        caId: values.caId,
        startDate: values.startDate,
        endDate: values.endDate,
      };
      const tempUrl = `${API_PATHS.checkTimeRange}`;
      const json = await dispatch(fetchThunk(tempUrl, 'post', JSON.stringify(params)));
      if (json.data.length) {
        setTimeRangeStt(json.data);
      } else {
        createHashTagRanking(values);
      }
    },
    [createHashTagRanking, dispatch],
  );

  useEffect(() => {
    fetchCaIdData();
    if (isUpdate) {
      fetchHashTagRanking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <LoadingIcon style={{ minHeight: 320 }} />;
  }
  const storeSchema = yup.object().shape({
    name: yup
      .string()
      .min(4)
      .max(30)
      .required('Content is required field and length is 3-30 chars')
      .trim(),
    startDate: yup.string().required(),
  });

  return (
    <div
      style={{
        maxWidth: 1112,
        margin: '0px auto 0px auto',
      }}
    >
      <Formik
        enableReinitialize
        initialValues={dataHashTag}
        onSubmit={async values => {
          actionsCheckTimeRange(values);
        }}
        validationSchema={storeSchema}
      >
        {({ values, setFieldValue }) => {
          return (
            <Form
              style={{
                borderRadius: 4,
                marginBottom: 26,
              }}
            >
              <Grid
                container
                component={Paper}
                style={{ padding: 16, boxShadow: ' 0px 1px 6px rgb(0 0 0 / 15%)' }}
              >
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FieldTextContent
                    name="name"
                    formControlStyle={{ width: '100%' }}
                    label={
                      <Row style={{ justifyContent: 'space-between', width: '98%' }}>
                        <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                          Tên bảng xếp hạng hashtag
                        </Typography>
                        <Typography style={{ color: GRAY }} variant="caption">
                          Tối đa 200 ký tự
                        </Typography>
                      </Row>
                    }
                    style={{
                      borderRadius: 4,
                      marginRight: 12,
                    }}
                    placeholder="Nhập tên bảng xếp hạng"
                    inputProps={{ maxLength: 200 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <FieldDateRangeFormControl
                    isOutsideRange={() => false}
                    name="startDate"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Khoảng thời gian áp dụng
                      </Typography>
                    }
                    style={{ minWidth: 250, marginRight: 12 }}
                    optional
                    startDate={
                      values.startDate && moment(values.startDate, C_DATE_FORMAT, true).isValid()
                        ? moment(values.startDate, C_DATE_FORMAT, true)
                        : undefined
                    }
                    endDate={
                      values.endDate && moment(values.endDate, C_DATE_FORMAT, true).isValid()
                        ? moment(values.endDate, C_DATE_FORMAT, true)
                        : undefined
                    }
                    onChange={(startDate, endDate) => {
                      setFieldValue('startDate', startDate?.format(C_DATE_FORMAT), true);
                      setFieldValue(
                        'endDate',
                        startDate && !endDate
                          ? moment().format(C_DATE_FORMAT)
                          : endDate?.format(C_DATE_FORMAT),
                        true,
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <FieldSelectContent
                    name="caId"
                    formControlStyle={{ maxWidth: 350, width: '100%' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Kênh bán áp dụng
                      </Typography>
                    }
                    options={caIdList}
                    onSelectOption={value => {
                      setCaIdFix(value);
                      setFieldValue('caId', value);
                    }}
                    style={{ marginRight: 12 }}
                    optional
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <FieldSelectContent
                    name="status"
                    formControlStyle={{ maxWidth: 350, width: '100%' }}
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Trạng thái bảng xếp hạng
                      </Typography>
                    }
                    options={statusOption2}
                    onSelectOption={value => {
                      setFieldValue('status', value);
                    }}
                    optional
                  />
                </Grid>
              </Grid>

              <Grid
                container
                component={Paper}
                style={{ marginTop: 15, boxShadow: ' 0px 1px 6px rgb(0 0 0 / 15%)' }}
              >
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Typography variant="subtitle2" style={{ margin: '25px 15px 0px 15px' }}>
                    Danh sách hashtag ({dataRows?.length})
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={8} lg={9}>
                  <Row style={{ justifyContent: 'flex-end', margin: '15px 15px 0px 15px' }}>
                    <Typography
                      style={{
                        marginBottom: 20,
                        marginRight: 12,
                        color: GRAY,
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                      variant="subtitle2"
                    >
                      Thêm hashtag
                    </Typography>

                    <FormControlAutoComplete
                      placeholder="Nhập tên hashtag"
                      value={{ name: (values as some).targetHashtagName } || null}
                      formControlStyle={{ width: 210 }}
                      onChange={(e: any, value: some | null) => {
                        if (value) {
                          dataRows.push({
                            name: value.name,
                            status: value.status,
                            id: value.id,
                            source: value.source,
                          });
                          setDataRows([...dataRows]);
                        }
                      }}
                      loadOptions={actionSuggestHashTag}
                      getOptionSelected={(option: some, value: some) => {
                        return option?.id === value?.id;
                      }}
                      getOptionLabel={(v: some) => v?.name}
                      filterOptions={options => options}
                      options={[]}
                      optional
                    />
                  </Row>
                </Grid>
                <Grid item xs={12}>
                  <HashtagRankingdsDnd data={dataRows} sortedList={setDataRows} />
                </Grid>
              </Grid>

              <Row style={{ marginTop: 24, justifyContent: 'flex-end' }}>
                {!isUpdate && (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    style={{ minWidth: 140, marginRight: 20 }}
                    color="primary"
                    disableElevation
                    loading={false}
                  >
                    Tạo bảng xếp hạng
                  </LoadingButton>
                )}
                {isUpdate && (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    style={{ minWidth: 140 }}
                    color="primary"
                    disableElevation
                    loading={false}
                  >
                    Cập nhật bảng xếp hạng
                  </LoadingButton>
                )}
              </Row>
              <ConfirmDialog
                style={{ textAlign: 'center' }}
                open={!!timeRangeStt.length}
                onAccept={() => {
                  createHashTagRanking(values);
                  setTimeRangeStt([]);
                }}
                titleHead={
                  <Typography style={{ marginBottom: 16 }} variant="subtitle1">
                    Tạo bảng xếp hạng
                  </Typography>
                }
                titleLabel={
                  <Box width={450}>
                    <Typography variant="body1">
                      Bảng Xếp Hạng bạn vừa tạo trùng khoảng thời gian với bảng xếp hạng:{' '}
                      {timeRangeStt?.map(ele => {
                        return <b> {ele.name} </b>;
                      })}{' '}
                      đã có trước đó; Nên Bảng xếp hạng mới sẽ được tự động thiết lập ở chế độ
                      “Không khả dụng“. Bạn có muốn tiếp tục không?
                    </Typography>
                  </Box>
                }
                onClose={() => setTimeRangeStt([])}
                onReject={() => setTimeRangeStt([])}
                acceptLabel="Tạo BXH"
              />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
export default React.memo(CreateHashTagRanking);
