import { Box, Button, Divider, Typography } from '@material-ui/core';
import { push } from 'connected-react-router';
import { Form, Formik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as yup from 'yup';
import { API_PATHS } from '../../../../configs/API';
import { BLUE_300 } from '../../../../configs/colors';
import { AppState } from '../../../../redux/reducers';
import { Col, Row, snackbarSetting } from '../../../common/components/elements';
import { FieldTextContent } from '../../../common/components/FieldContent';
import LoadingButton from '../../../common/components/LoadingButton';
import { fetchThunk } from '../../../common/redux/thunk';

interface Props {
  loading: boolean;
  contentEdit?: any;
  setLoading(value: boolean): void;
  setOpenEdit(value: boolean): void;
  setChangeData(value: boolean): void;
  changeData: boolean;
}
const EditArticle: React.FC<Props> = props => {
  const { loading, contentEdit, setLoading, setOpenEdit, setChangeData, changeData } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const putAdmin = useCallback(
    async (values: any) => {
      setLoading(true);
      const json = await dispatch(
        fetchThunk(
          `${API_PATHS.adminPost}?id=${contentEdit?.id}`,
          'put',
          JSON.stringify({
            content: values.content,
          }),
          false,
        ),
      );
      setLoading(false);
      if (json?.code === 200) {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'success',
            }),
          );
        setLoading(false);
        setOpenEdit(true);
        dispatch(push('/'));
        setChangeData(!changeData);
      } else {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
      }
    },
    [
      changeData,
      closeSnackbar,
      contentEdit,
      dispatch,
      enqueueSnackbar,
      setChangeData,
      setLoading,
      setOpenEdit,
    ],
  );

  const storeSchema = yup.object().shape({
    content: yup
      .string()
      .min(3)
      .max(10000)
      .required('Content is required field and length is 3-10000 chars')
      .trim(),
  });

  return (
    <>
      <Formik
        initialValues={{ content: contentEdit?.content || '' }}
        validationSchema={storeSchema}
        onSubmit={async values => {
          putAdmin(values);
        }}
      >
        {({ resetForm }) => {
          return (
            <Form>
              <Col style={{ flexWrap: 'wrap', margin: 16, minWidth: 560 }}>
                <FieldTextContent
                  name="content"
                  formControlStyle={{ marginTop: 12, flex: 2, marginRight: 0 }}
                  label={
                    <Box display="flex" flexDirection="column" mb={2}>
                      Nội dung
                      <Divider style={{ height: 1, marginTop: 16 }} />
                    </Box>
                  }
                  placeholder=""
                  inputProps={{
                    maxLength: 500,
                  }}
                  multiline
                  rows={6}
                  optional
                />

                <Row>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    style={{}}
                    color="primary"
                    disableElevation
                    loading={loading}
                  >
                    Cập nhật
                  </LoadingButton>
                  <Button
                    onClick={() => {
                      resetForm();
                      setOpenEdit(true);
                      //   onUpdateFilter(defaultFilter);
                    }}
                  >
                    <Typography variant="button" style={{ color: BLUE_300 }}>
                      Hủy bỏ
                    </Typography>
                  </Button>
                </Row>
              </Col>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default EditArticle;
