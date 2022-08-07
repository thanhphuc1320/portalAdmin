import React, { useEffect, useState, useCallback } from 'react';
import {
  Grid,
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Chip,
  Checkbox,
  fade,
} from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';
import { isArray, isEmpty, debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { fetchThunk } from 'modules/common/redux/thunk';
import { setNotistackMessage } from 'modules/common/redux/reducer';
import { API_PATHS } from 'configs/API';
import { Form, Formik } from 'formik';
import { Row } from 'modules/common/components/elements';
import LoadingButton from 'modules/common/components/LoadingButton';
import LoadingIcon from 'modules/common/components/LoadingIcon';
import ConvertToPostTable from './ConvertToPostTable';
import UserListDialog from './UserListDialog';
import { RED, GREY_100, GREY_700 } from 'configs/colors';
import { some } from 'configs/utils';
import { CA_ID_INFO } from 'modules/auth/constants';
import { STATUS_ADMIN_REPORTS } from 'constants/common';
import { PAGINATION_CONVERT } from '../../constants';

const cssClass = 'convertToPostDialog';

const STATUS_CONVERT = {
  ON: 'ON',
  OFF: 'OFF',
};

const initData = {
  isActive: STATUS_CONVERT.ON,
  caIdSelected: 0,
  userIdTripi: 0,
  userIdMytour: 0,
  userIdDinogo: 0,
};

export interface Props {
  open: boolean;
  handleClose: () => void;
  codeList: string[];
  onRefresh?: () => void;
}

const ConvertToPostDialog: React.FC<Props> = props => {
  const { handleClose, open, codeList, onRefresh } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [openAdmin, setOpenAdmin] = useState<boolean>(false);
  const [caIdSelected, setCaIdSelected] = useState<number>(0);
  const [codes, setCodes] = useState<string[]>(codeList);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>({
    page: PAGINATION_CONVERT.PAGE_FIRST,
    size: PAGINATION_CONVERT.PAGE_SIZE,
  });

  useEffect(() => {
    setCodes(codeList);
  }, [codeList]);

  const resetFilter = useCallback(() => {
    setFilter({
      page: PAGINATION_CONVERT.PAGE_FIRST,
      size: PAGINATION_CONVERT.PAGE_SIZE,
    });
  }, [setFilter]);

  const onRemove = useCallback(
    (val: string) => {
      const indexVal = codes.indexOf(val);
      if (indexVal > -1) {
        codes.splice(indexVal, 1);
        setCodes([...codes]);
        resetFilter();
      }
    },
    [codes, resetFilter],
  );

  const getAdminReports = useCallback(
    debounce(async (id: string) => {
      const json = await dispatch(fetchThunk(`${API_PATHS.getAdminReports}?id=${id}`, 'get'));
      const result = json?.data?.content[0];
      if (result?.status === STATUS_ADMIN_REPORTS.DONE) {
        setLoading(false);
        dispatch(setNotistackMessage(json?.message, 'success'));
        handleClose();
        resetFilter();
        onRefresh && onRefresh();
      } else {
        getAdminReports(id);
      }
    }, 3500),
    [dispatch, handleClose, onRefresh, resetFilter, setLoading],
  );

  const onConvertToPost = async (dataForm: any) => {
    const caIdUserList: some[] = [];

    if (dataForm?.userIdTripi > 0) {
      caIdUserList.push({
        caId: CA_ID_INFO.TRIPI_PARTNER,
        userId: dataForm?.userIdTripi,
      });
    }
    if (dataForm?.userIdMytour > 0) {
      caIdUserList.push({
        caId: CA_ID_INFO.MYTOUR,
        userId: dataForm?.userIdMytour,
      });
    }
    if (dataForm?.userIdDinogo > 0) {
      caIdUserList.push({
        caId: CA_ID_INFO.DINOGO,
        userId: dataForm?.userIdDinogo,
      });
    }

    const dataSave = {
      codes,
      active: dataForm?.isActive === STATUS_CONVERT.ON,
      caIdAndUsers: caIdUserList,
    };

    setLoading(true);
    const json = await dispatch(
      fetchThunk(API_PATHS.adminCrawlersConvert, 'post', JSON.stringify(dataSave)),
    );
    if (json?.code === 200) {
      const convertId = json?.data?.id;
      if (convertId) {
        getAdminReports(convertId);
      } else {
        setLoading(false);
        dispatch(setNotistackMessage('convertId không tồn tại!', 'error'));
      }
    } else {
      setLoading(false);
      json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
    }
  };

  const checkDisabled = (dataForm: any) => {
    if (isEmpty(codes)) {
      return true;
    }
    if (loading) {
      return true;
    }
    if (!dataForm?.userIdTripi && !dataForm?.userIdMytour && !dataForm?.userIdDinogo) {
      return true;
    }

    return false;
  };

  return (
    <Dialog maxWidth="md" open={open} onClose={handleClose} className={`${cssClass}`}>
      <DialogTitle style={{ paddingBottom: 0 }}>
        <IconButton
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            padding: 0,
          }}
          onClick={handleClose}
        >
          <IconClose />
        </IconButton>
      </DialogTitle>

      <Formik
        initialValues={{ ...initData }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          onConvertToPost(values);
          resetForm({});
          setSubmitting(false);
        }}
      >
        {({ values, setFieldValue }) => {
          return (
            <Form style={{ padding: '0px 20px' }}>
              <Grid container className={`${cssClass}-container`}>
                <Grid item xs={12} className={`${cssClass}-head`}>
                  <Typography
                    variant="h6"
                    style={{
                      color: GREY_700,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginBottom: 15,
                      padding: '15px 0px',
                    }}
                  >
                    Chuyển đổi bài viết
                  </Typography>
                </Grid>
                <Grid item xs={4} className={`${cssClass}-left`}>
                  <div className={`${cssClass}-left-selected`}>
                    <Typography variant="subtitle2" style={{ color: GREY_700, marginBottom: 10 }}>
                      Crawler ID được chọn ({codes?.length || 0})
                    </Typography>
                    <div className={`${cssClass}-left-selected-box scrollbar-2`}>
                      {isArray(codes) &&
                        codes?.map((val: string, index: number) => {
                          return (
                            <Chip
                              key={index}
                              label={val}
                              onDelete={() => onRemove(val)}
                              className={`${cssClass}-left-selected-chip`}
                            />
                          );
                        })}
                      {isEmpty(codes) && (
                        <Typography variant="caption" style={{ color: RED, marginBottom: 50 }}>
                          Hiện chưa có Crawler ID!
                        </Typography>
                      )}
                    </div>
                  </div>

                  <div className={`${cssClass}-left-convert`}>
                    <Typography variant="subtitle2" style={{ color: GREY_700, marginBottom: 10 }}>
                      Ca ID cần chuyển
                    </Typography>

                    <FormControlLabel
                      label={<Typography variant="body2">Tripi</Typography>}
                      control={
                        <Checkbox
                          size="small"
                          checked={values?.userIdTripi > 0}
                          color="primary"
                          onClick={() => {
                            if (values?.userIdTripi > 0) {
                              setFieldValue('userIdTripi', 0);
                            } else {
                              setCaIdSelected(CA_ID_INFO.TRIPI_PARTNER);
                              setOpenAdmin(true);
                            }
                          }}
                        />
                      }
                    />
                    <FormControlLabel
                      label={<Typography variant="body2">MyTour</Typography>}
                      control={
                        <Checkbox
                          size="small"
                          checked={values?.userIdMytour > 0}
                          color="primary"
                          onClick={() => {
                            if (values?.userIdMytour > 0) {
                              setFieldValue('userIdMytour', 0);
                            } else {
                              setCaIdSelected(CA_ID_INFO.MYTOUR);
                              setOpenAdmin(true);
                            }
                          }}
                        />
                      }
                    />

                    <FormControlLabel
                      label={<Typography variant="body2">Dinogo</Typography>}
                      control={
                        <Checkbox
                          size="small"
                          checked={values?.userIdDinogo > 0}
                          color="primary"
                          onClick={() => {
                            if (values?.userIdDinogo > 0) {
                              setFieldValue('userIdDinogo', 0);
                            } else {
                              setCaIdSelected(CA_ID_INFO.DINOGO);
                              setOpenAdmin(true);
                            }
                          }}
                        />
                      }
                    />
                  </div>
                </Grid>

                <Grid item xs={8} className={`${cssClass}-right`}>
                  <ConvertToPostTable
                    codes={codes || []}
                    isLoading={loading}
                    filter={filter}
                    setFilter={setFilter}
                    onClose={handleClose}
                  />
                </Grid>

                <Grid item xs={12}>
                  <div className={`${cssClass}-footer-in`}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        name="isActive"
                        value={(values as any).isActive}
                        onChange={event => {
                          setFieldValue('isActive', (event.target as HTMLInputElement).value);
                        }}
                      >
                        <FormControlLabel
                          key={STATUS_CONVERT.ON}
                          value={STATUS_CONVERT.ON}
                          control={<Radio size="small" color="primary" />}
                          label={
                            <Typography variant="body2">
                              Chuyển và bật hiển thị (mặc định - chỉ áp dụng bài viết mới chuyển
                              đổi)
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          key={STATUS_CONVERT.OFF}
                          value={STATUS_CONVERT.OFF}
                          control={<Radio size="small" color="primary" />}
                          label={<Typography variant="body2">Chuyển và tắt hiển thị</Typography>}
                        />
                      </RadioGroup>
                    </FormControl>

                    <Row style={{ justifyContent: 'flex-end' }}>
                      <LoadingButton
                        variant="outlined"
                        color="primary"
                        size="large"
                        style={{ minWidth: 70, marginRight: 20 }}
                        disableElevation
                        loading={false}
                        onClick={handleClose}
                      >
                        Hủy
                      </LoadingButton>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        size="large"
                        style={{ minWidth: 140 }}
                        color="primary"
                        disableElevation
                        disabled={checkDisabled(values)}
                      >
                        Chuyển đổi
                      </LoadingButton>
                    </Row>
                  </div>
                </Grid>
              </Grid>

              <UserListDialog
                open={openAdmin}
                setOpen={setOpenAdmin}
                caIdSelected={caIdSelected}
                setUserId={(val: number) => {
                  if (caIdSelected === CA_ID_INFO.TRIPI_PARTNER) {
                    setFieldValue('userIdTripi', val);
                  }
                  if (caIdSelected === CA_ID_INFO.MYTOUR) {
                    setFieldValue('userIdMytour', val);
                  }
                  if (caIdSelected === CA_ID_INFO.DINOGO) {
                    setFieldValue('userIdDinogo', val);
                  }
                  setCaIdSelected(0);
                }}
              />
            </Form>
          );
        }}
      </Formik>

      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            background: fade(GREY_100, 0.7),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <LoadingIcon />
        </div>
      )}
    </Dialog>
  );
};

export default React.memo(ConvertToPostDialog);
