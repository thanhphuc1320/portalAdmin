import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { fetchThunk } from 'modules/common/redux/thunk';
import { API_PATHS } from 'configs/API';
import { useFormikContext } from 'formik';
import IconClose from '@material-ui/icons/CloseOutlined';
import LoadingButton from 'modules/common/components/LoadingButton';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import { Row } from 'modules/common/components/elements';
import { GRAY_DARK } from 'configs/colors';
import { some } from 'configs/utils';

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  setUserId: (value: number) => void;
  caIdSelected: number;
}

const UserListDialog: React.FC<Props> = props => {
  const { setOpen, open, setUserId, caIdSelected } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { setFieldValue, values } = useFormikContext();
  const valuesForm = values as any;

  const getAdminUsersAdmins = useCallback(
    async (str: string) => {
      const json = await dispatch(
        fetchThunk(
          `${API_PATHS.getAdminUsersAdmins}?caId=${caIdSelected}&name=${str.trimLeft()}`,
          'get',
        ),
      );
      return json?.data || [];
    },
    [dispatch, caIdSelected],
  );

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onSave = () => {
    setUserId(valuesForm?.userId);
    setFieldValue('userId', undefined);
    setFieldValue('userName', undefined);
    setOpen(false);
  };

  return (
    <Dialog maxWidth="xs" open={open} onClose={handleClose}>
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

      <DialogContent style={{ marginBottom: 15 }}>
        <Row style={{ justifyContent: 'center' }}>
          <Typography variant="h6" style={{ color: GRAY_DARK, fontWeight: 'bold', fontSize: 18 }}>
            Tài khoản hiển thị
          </Typography>
        </Row>
        <Row style={{ margin: '20px 0px' }}>
          <Typography variant="body2" style={{ color: GRAY_DARK }}>
            Hiển thị bài viết dưới tư cách:
          </Typography>
        </Row>

        <Row>
          <FormControlAutoComplete
            id="userId"
            placeholder="Tìm User"
            value={
              valuesForm?.userId
                ? { id: valuesForm?.userId, name: valuesForm?.userName }
                : undefined
            }
            formControlStyle={{
              width: '100%',
              maxWidth: '100%',
              minWidth: 'unset',
              marginRight: 0,
            }}
            onChange={(e: any, value: some | null) => {
              setFieldValue('userId', value?.id);
              setFieldValue('userName', value?.name);
            }}
            loadOptions={getAdminUsersAdmins}
            getOptionSelected={(option: some, value: some) => {
              return option?.id === value?.id;
            }}
            getOptionLabel={(v: some) => v?.name}
            filterOptions={options => options}
            options={[]}
            optional
          />
        </Row>

        <Row style={{ justifyContent: 'center' }}>
          <LoadingButton
            variant="outlined"
            size="large"
            style={{ minWidth: 185, marginRight: 10 }}
            color="primary"
            disableElevation
            loading={false}
            onClick={handleClose}
          >
            Hủy
          </LoadingButton>

          <LoadingButton
            variant="contained"
            size="large"
            style={{ minWidth: 185, marginLeft: 10 }}
            color="primary"
            disableElevation
            disabled={!valuesForm?.userId}
            onClick={onSave}
          >
            Xác nhận
          </LoadingButton>
        </Row>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(UserListDialog);
