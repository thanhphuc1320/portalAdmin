import React, { useCallback } from 'react';
import { Grid, Dialog, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import LoadingButton from 'modules/common/components/LoadingButton';
import UploadImage from 'modules/common/components/UploadImage';
import { Row } from 'modules/common/components/elements';
import { FieldTextContent } from 'modules/common/components/FieldContent';
import { convertTextToSlug } from 'helpers/common';
import { some } from 'configs/utils';
import { GRAY } from 'configs/colors';

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  tagList: some[];
  setTagList(values: some[]): void;
  tagSelected: any;
  setTagSelected(value: any): void;
}

const ArticleItemTagsFormDialog: React.FC<Props> = props => {
  const { setOpen, open, tagSelected, tagList, setTagList } = props;
  const isUpdate = !!tagSelected?.code;

  const onSave = useCallback(
    (dataSave: any) => {
      if (isUpdate) {
        const indexTag = tagList?.findIndex(item => item?.code === dataSave?.code);
        if (indexTag > -1) {
          tagList[indexTag] = { ...tagList[indexTag], ...dataSave };
          setTagList([...tagList]);
        }
      } else {
        setTagList([...tagList, dataSave]);
      }
      setOpen(false);
    },
    [isUpdate, tagList, setTagList, setOpen],
  );

  const storeSchema = yup.object().shape({
    name: yup
      .string()
      .max(24, 'Nhập tối đa 24 ký tự')
      .required('Vui lòng nhập Tên tags')
      .trim(),
    label: yup
      .string()
      .max(24, 'Nhập tối đa 24 ký tự')
      .required('Vui lòng nhập Tên trường')
      .trim(),
  });

  return (
    <Dialog maxWidth="sm" open={open} onClose={() => setOpen(false)}>
      <Grid container style={{ padding: '5px 15px' }}>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            style={{ marginTop: 15, marginBottom: 15, fontWeight: 'bold', textAlign: 'center' }}
          >
            {isUpdate ? 'Chỉnh sửa tags' : 'Thêm tags mới'}
          </Typography>

          <Formik
            enableReinitialize
            initialValues={{ ...tagSelected }}
            onSubmit={(values, { setErrors, setSubmitting, resetForm }) => {
              if (!isUpdate && tagList?.find(item => item?.name === values?.name)) {
                setErrors({ name: 'Tên tags không được trùng' });
                return;
              }
              if (!isUpdate && tagList?.find(item => item?.code === values?.code)) {
                setErrors({ name: 'Code tags (Tên tags) không được trùng' });
                return;
              }
              onSave(values);
              resetForm({});
              setSubmitting(false);
            }}
            validationSchema={storeSchema}
          >
            {({ values, setFieldValue, errors }) => {
              return (
                <Form
                  style={{
                    borderRadius: 4,
                    marginBottom: 15,
                  }}
                >
                  <Row style={{ marginTop: 10, flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography style={{ color: GRAY }} variant="caption">
                      Ảnh tags
                    </Typography>
                    <UploadImage
                      url={values?.avatar}
                      setUrl={(avatar: string) => {
                        setFieldValue('avatar', avatar);
                      }}
                      widthImg={100}
                      heightImg={80}
                      style={{ margin: 0, padding: 0 }}
                    />
                  </Row>

                  <Row style={{ marginTop: 10 }}>
                    <FieldTextContent
                      name="name"
                      label={
                        <Row style={{ justifyContent: 'space-between', width: '100%' }}>
                          <Typography style={{ color: GRAY }} variant="caption">
                            Tên tags
                          </Typography>
                          <Typography style={{ color: GRAY }} variant="caption">
                            Tối đa 24 ký tự
                          </Typography>
                        </Row>
                      }
                      placeholder="Nhập tên tags"
                      onChange={e => {
                        const tempName = e.target.value || '';
                        setFieldValue('name', tempName);
                        if (!isUpdate) {
                          const slugName = convertTextToSlug(tempName);
                          setFieldValue('code', slugName.toUpperCase());
                        }
                      }}
                      inputProps={{ maxLength: 100, autoComplete: 'off' }}
                      formControlStyle={{ width: '100%', minWidth: 'unset', marginRight: 0 }}
                      style={{ width: '100%' }}
                      optional
                      errorMessage={errors.name && String(errors.name)}
                    />
                  </Row>

                  <Row>
                    <FieldTextContent
                      name="label"
                      label={
                        <Row style={{ justifyContent: 'space-between', width: '100%' }}>
                          <Typography style={{ color: GRAY }} variant="caption">
                            Tên trường
                          </Typography>
                          <Typography style={{ color: GRAY }} variant="caption">
                            Tối đa 24 ký tự
                          </Typography>
                        </Row>
                      }
                      placeholder="Nhập tên trường"
                      inputProps={{ maxLength: 100, autoComplete: 'off' }}
                      formControlStyle={{ width: '100%', minWidth: 'unset', marginRight: 0 }}
                      style={{ width: '100%' }}
                      optional
                      errorMessage={errors.label && String(errors.label)}
                    />
                  </Row>

                  <Row style={{ marginTop: 10 }}>
                    <LoadingButton
                      variant="outlined"
                      color="primary"
                      size="large"
                      style={{ minWidth: 140, marginRight: 25 }}
                      disableElevation
                      loading={false}
                      onClick={() => setOpen(false)}
                    >
                      {isUpdate ? 'Hủy' : 'Đóng'}
                    </LoadingButton>

                    <LoadingButton
                      type="submit"
                      variant="contained"
                      size="large"
                      style={{ minWidth: 140 }}
                      color="primary"
                      disableElevation
                      disabled={!values?.avatar}
                    >
                      Đồng ý
                    </LoadingButton>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default React.memo(ArticleItemTagsFormDialog);
