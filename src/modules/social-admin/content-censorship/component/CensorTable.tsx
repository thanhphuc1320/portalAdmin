/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { useSnackbar } from 'notistack';
import { Form, Formik } from 'formik';
import queryString from 'query-string';

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  TextareaAutosize,
  Typography,
} from '@material-ui/core';
import { API_PATHS } from 'configs/API';
import { some } from 'configs/utils';
import { BLACK_500, BLUE, GRAY, PRIMARY } from 'configs/colors';

import { Col, Row, snackbarSetting } from 'modules/common/components/elements';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import LoadingButton from 'modules/common/components/LoadingButton';
import { uploadFile } from 'modules/common/redux/reducer';
import { fetchThunk } from 'modules/common/redux/thunk';

import { debounce } from 'lodash';
import DialogUpload from './DialogUpload';

import { ReactComponent as Upload } from 'svg/upload.svg';
import '../pages/style.scss';

const cssClass = 'censor-list-page';

interface Props {}

const CensorTable: React.FC<Props> = () => {
  const inputRef = React.useRef<any>();
  const uploadRef = React.useRef<any>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [loadingExport, setLoadingExport] = React.useState<boolean>(false);
  const [chipData, setChipData] = useState<any>([]);
  const [urlUpload, setUrlUpload] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [keyWord, setKeyWord] = useState<string>('');
  const [dataCreate, setDataCreate] = useState<any>({});
  const [open, setOpen] = useState<boolean>(false);
  const [totalElement, setTotalElement] = useState<number>(0);

  const dataList = { listBadWord: '' };

  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const handleHintSearch = useCallback(
    async (str: string) => {
      const queryConvert = { keyword: `${str.trimLeft()}` };
      const json = await dispatch(
        fetchThunk(
          `${API_PATHS.apiGetAdminListBadWord}?${queryString.stringify(queryConvert)}`,
          'get',
        ),
      );
      return json?.data?.content || [];
    },
    [dispatch],
  );

  const fetchData = React.useCallback(async () => {
    // setLoading(true);
    const queryConvert = { keyword: keyWord, size: 50 };
    const result = await dispatch(
      fetchThunk(
        `${API_PATHS.apiGetAdminListBadWord}?${queryString.stringify(queryConvert)}`,
        'get',
      ),
    );
    if (result?.code === 200) {
      setChipData(result?.data?.content);
      setTotalElement(result?.data?.totalElements);
    } else {
      result?.message &&
        enqueueSnackbar(
          result?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
    }
  }, [closeSnackbar, dispatch, enqueueSnackbar, keyWord]);

  const handleImport = useCallback(
    async (url: string) => {
      const dataSave = {
        resourceUrl: url,
        contentType: 'text/csv',
      };

      const formData = JSON.stringify(dataSave);
      const result = await dispatch(
        fetchThunk(`${API_PATHS.apiImportAdminListBadWord}`, 'post', formData),
      );
      if (result?.code === 200) {
        setTimeout(() => {
          fetchData();
          setLoading(false);
        }, 2000);

        enqueueSnackbar(
          result?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'success',
          }),
        );
      } else {
        setLoading(false);
        result?.message &&
          enqueueSnackbar(
            result?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [closeSnackbar, dispatch, enqueueSnackbar],
  );

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  React.useEffect(() => {
    if (urlUpload) {
      handleImport(urlUpload);
    }
  }, [handleImport, urlUpload]);

  const handleDelete = useCallback(
    async values => {
      const result = await dispatch(
        fetchThunk(`${API_PATHS.apiAdminBadWord}?ids=${values}`, 'delete'),
      );

      if (result.code === 200) {
        fetchData();
        // eslint-disable-next-line
        setChipData(chipData => chipData.filter(chip => chip.id !== values));

        result?.message &&
          enqueueSnackbar(
            result?.message,
            snackbarSetting(key => closeSnackbar(key), { color: 'success' }),
          );
      } else {
        result?.message &&
          enqueueSnackbar(
            result?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
      }
    },
    [closeSnackbar, dispatch, enqueueSnackbar, fetchData],
  );

  const handleUploadFile = useCallback(
    async (value: File) => {
      try {
        const json = await dispatch(uploadFile([value]));
        if (json?.code === 200) {
          setUrlUpload(json.data?.downloadUrl);
          setFileName(json.data?.fileName);
          uploadRef.current.value = '';
        } else {
          json?.message &&
            enqueueSnackbar(
              json?.message,
              snackbarSetting(key => closeSnackbar(key), {
                color: 'error',
              }),
            );
        }
      } catch (error) {}
    },
    [closeSnackbar, dispatch, enqueueSnackbar],
  );

  const handleUploadFileCSV = useCallback(
    async e => {
      setLoading(true);
      const file = e.target.files[0];
      if (file?.type !== 'text/csv') {
        e.target.files = null;
        enqueueSnackbar(
          'Chỉ chấp nhận file CSV.',
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
      } else {
        handleUploadFile(file);
      }
    },
    [closeSnackbar, enqueueSnackbar, handleUploadFile],
  );

  const handleAddNewBadWord = useCallback(
    async values => {
      if (values.listBadWord) {
        const listBadWord = values.listBadWord
          .trim()
          .split(/[,]/)
          .filter(ele => ele !== '');
        const convertArray = listBadWord.map(item => item.trim().replace(/\s+/g, ' '));
        const result = await dispatch(
          fetchThunk(`${API_PATHS.apiAdminBadWord}`, 'post', JSON.stringify(convertArray)),
        );

        if (result.code === 200) {
          fetchData();
          setDataCreate(result.data);
          setOpen(true);
          result?.message &&
            enqueueSnackbar(
              result?.message,
              snackbarSetting(key => closeSnackbar(key), { color: 'success' }),
            );
        } else {
          result?.message &&
            enqueueSnackbar(
              result?.message,
              snackbarSetting(key => closeSnackbar(key), {
                color: 'error',
              }),
            );
        }
      } else {
        enqueueSnackbar(
          'Vui lòng không để trống',
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
      }
    },
    [closeSnackbar, dispatch, enqueueSnackbar, fetchData],
  );

  const getAdminExport = useCallback(
    debounce(async () => {
      const result = await dispatch(
        fetchThunk(`${API_PATHS.getAdminReports}?module=ADMIN_BAD_WORD_MANAGEMENT`, 'get'),
      );
      const res = result?.data?.content[0];
      if (res?.status === 'DONE') {
        setLoadingExport(false);
        window.open(res?.resultUrl);
        enqueueSnackbar(
          result.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'success',
          }),
        );
      } else {
        getAdminExport();
      }
    }, 5000),
    [],
  );

  const handleExport = useCallback(async () => {
    setLoadingExport(true);
    const result = await dispatch(fetchThunk(`${API_PATHS.apiExportAdminListBadWord}`, 'get'));
    if (result.code === 200) {
      getAdminExport();
    } else {
      setLoading(false);

      result?.message &&
        enqueueSnackbar(
          result?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
    }
  }, [closeSnackbar, dispatch, enqueueSnackbar, getAdminExport]);

  const handleExportSample = useCallback(async () => {
    setLoading(true);
    setLoadingExport(true);

    const result = await dispatch(fetchThunk(API_PATHS.apiGetAdminListBadWordSample, 'get'));
    if (result.code === 200) {
      setLoading(false);
      setLoadingExport(false);
      window.open(result?.data?.content[0]?.value);
      result?.message &&
        enqueueSnackbar(
          result?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'success',
          }),
        );
    } else {
      setLoading(false);
      setLoadingExport(false);
      result?.message &&
        enqueueSnackbar(
          result?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
    }
  }, [closeSnackbar, dispatch, enqueueSnackbar]);

  const handleInputAdd = (setFieldValue, value) => {
    setFieldValue('listBadWord', value.target.value);
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          ...dataList,
        }}
        onSubmit={(values, { resetForm }) => {
          resetForm();
          handleAddNewBadWord(values);
        }}
      >
        {({ values, setFieldValue }) => {
          return (
            <Form>
              <Col>
                <Paper style={{ padding: '16px 12px', marginTop: '50px' }}>
                  <Typography
                    variant="subtitle2"
                    style={{ color: BLACK_500, padding: '4px 0px 8px' }}
                  >
                    Thêm từ ngữ vi phạm
                  </Typography>
                  <Row style={{ marginTop: 8, flexWrap: 'wrap' }}>
                    <Grid item xs={12} style={{ position: 'relative' }} className="customHeight">
                      <TextareaAutosize
                        name="listBadWord"
                        value={values.listBadWord}
                        placeholder="Nhập..."
                        className="customTextArea"
                        onChange={(value: any) => handleInputAdd(setFieldValue, value)}
                      />
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        size="large"
                        style={{
                          maxWidth: 70,
                          height: 40,
                          padding: '10px 16px',
                          position: 'absolute',
                          right: '0.5%',
                          top: '15%',
                          zIndex: 10,
                        }}
                        color="primary"
                        disableElevation
                        disabled={loadingExport || loading}
                      >
                        Thêm
                      </LoadingButton>
                    </Grid>
                  </Row>

                  <Col style={{ marginTop: 8, flexWrap: 'wrap' }}>
                    <Grid item xs={12} style={{ justifyContent: 'space-between', display: 'flex' }}>
                      <Typography
                        variant="subtitle2"
                        style={{ color: BLACK_500, padding: '4px 0px 8px' }}
                      >
                        {`Danh sách từ vi phạm (${totalElement})`}
                      </Typography>
                      <FormControlAutoComplete
                        className={`${cssClass}-search-button`}
                        iRef={inputRef}
                        id="badWord"
                        placeholder="Tìm kiếm..."
                        value={{ badWord: (values as any).badWord, id: (values as any).id } || null}
                        formControlStyle={{ minWidth: 210, marginRight: 0 }}
                        onChange={(e: any, value: some | null) => {
                          setKeyWord(value?.badWord || '');
                          setFieldValue('badWord', value?.badWord);
                        }}
                        loadOptions={handleHintSearch}
                        getOptionSelected={(option: some, value: some) => {
                          return option?.id === value?.id;
                        }}
                        getOptionLabel={(v: some) => v?.badWord || ''}
                        filterOptions={options => options}
                        options={chipData}
                        optional
                      />
                    </Grid>
                    <Box
                      style={{
                        maxHeight: '150px',
                        overflowY: 'auto',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        flexWrap: 'wrap',
                        width: '100%',
                        alignItems: 'center',
                      }}
                    >
                      {chipData?.map(data => {
                        return (
                          <>
                            <div style={{ marginLeft: '5px', marginTop: '5px' }}>
                              <Chip
                                disabled={loadingExport || loading}
                                label={data.badWord}
                                onDelete={() => handleDelete(data.id)}
                              />
                            </div>
                          </>
                        );
                      })}
                      {totalElement > 50 && (
                        <span
                          style={{
                            color: GRAY,
                            fontWeight: 400,
                            fontSize: 14,
                            marginLeft: 10,
                            marginTop: 8,
                          }}
                        >
                          (+{totalElement - chipData.length})
                        </span>
                      )}
                    </Box>
                    <Grid item xs={12} sm={6} md={6} lg={3} style={{ alignSelf: 'flex-end' }}>
                      <LoadingButton
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
                        loading={loadingExport}
                        disabled={loadingExport || loading}
                        onClick={handleExport}
                      >
                        <FormattedMessage id="downloadCensorKey" />
                      </LoadingButton>
                    </Grid>
                  </Col>
                  <Col style={{ marginTop: 8, width: '100%' }}>
                    <Col style={{ marginTop: 8, width: '100%' }}>
                      <Typography variant="subtitle2" style={{ color: BLACK_500 }}>
                        Bổ sung từ ngữ vi phạm vào hệ thống bằng file tải lên
                      </Typography>
                      <Typography variant="body2" style={{ color: GRAY }}>
                        Đính kèm tệp chứa các từ ngữ vi phạm để cập nhật vào danh sách từ ngữ hiện
                        tại của hệ thống (.csv).
                        <span
                          style={{ color: BLUE, cursor: 'pointer' }}
                          onClick={handleExportSample}
                        >
                          {' '}
                          Tải mẫu tại đây
                        </span>
                      </Typography>
                    </Col>
                    <Row
                      style={{
                        marginTop: 10,
                        paddingBottom: 30,
                        width: '100%',
                        borderBottom: '2px solid #E5EBED',
                        alignItems: 'center',
                      }}
                    >
                      <label htmlFor="contained-button-file">
                        <Button
                          className={`${cssClass}-upload-button`}
                          variant="outlined"
                          component="span"
                          startIcon={<Upload />}
                          disabled={loading || loadingExport}
                        >
                          Tải file lên
                        </Button>
                      </label>
                      <input
                        ref={uploadRef}
                        accept=".csv"
                        id="contained-button-file"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleUploadFileCSV}
                      />
                      {loading && (
                        <CircularProgress
                          style={{ height: 15, width: 15, color: PRIMARY, marginLeft: 10 }}
                        />
                      )}
                      {fileName && !loading && (
                        <Typography variant="body2" style={{ marginLeft: 10, color: GRAY }}>
                          {fileName && fileName}
                        </Typography>
                      )}
                    </Row>
                    <Col style={{ marginTop: 20, width: '100%' }}>
                      <Typography variant="subtitle2" style={{ color: BLACK_500 }}>
                        Bài viết
                      </Typography>
                      <Typography variant="body2" style={{ color: BLACK_500, marginTop: 5 }}>
                        Đối với bài viết có nội dung chứa từ ngữ vi phạm sẽ{' '}
                        <span style={{ fontWeight: 'bold' }}> tự động chặn</span> khi người dùng bấm
                        Đăng bài. Hệ thống sẽ thông báo cho người dùng, sau đó tự động chặn bài viết
                      </Typography>
                      <Typography variant="subtitle2" style={{ color: BLACK_500, marginTop: 10 }}>
                        Bình luận
                      </Typography>
                      <Typography variant="body2" style={{ color: BLACK_500, marginTop: 5 }}>
                        Đối với bình luận có nội dung chứa từ ngữ vi phạm. Cho phép người gửi bình
                        luận, hệ thống sẽ thông báo cho Quản trị viên về bình luận vi phạm trên
                        trang quản trị
                      </Typography>
                    </Col>
                  </Col>
                </Paper>
              </Col>
            </Form>
          );
        }}
      </Formik>

      <DialogUpload open={open} setOpen={() => setOpen(!open)} data={dataCreate} />
    </>
  );
};

export default CensorTable;
