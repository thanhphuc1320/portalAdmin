import { Button } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FormattedMessage } from 'react-intl';
import { GREY_500 } from '../../../configs/colors';
import { Row, snackbarSetting } from './elements';
import FormControlTextField, { FormControlTextFieldProps } from './FormControlTextField';

interface Props extends FormControlTextFieldProps {
  message?: React.ReactNode;
}
const CopyTextField: React.FC<Props> = props => {
  const { value, inputProps, ...rest } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  return (
    <Row style={{ flexWrap: 'wrap' }}>
      <FormControlTextField
        disabled
        formControlStyle={{ width: 400, margin: 4 }}
        value={value}
        inputProps={{
          ...inputProps,
          style: { color: GREY_500, ...inputProps?.style },
        }}
        {...rest}
      />
      <CopyToClipboard
        text={value as string}
        onCopy={(textValue: string, v: boolean) => {
          if (textValue && v) {
            enqueueSnackbar(
              textValue.length > 50 ? `${textValue.slice(0, 50)}...` : textValue,
              snackbarSetting(key => closeSnackbar(key), { color: 'success' }),
            );
          }
        }}
      >
        <Button
          variant="contained"
          color="primary"
          style={{ minWidth: '80px', marginBottom: '20px' }}
          disableElevation
          size="large"
        >
          <FormattedMessage id="copy" />
        </Button>
      </CopyToClipboard>
    </Row>
  );
};

export default CopyTextField;
