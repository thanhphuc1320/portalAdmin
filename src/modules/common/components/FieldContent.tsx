import React from 'react';
import { useField, useFormikContext } from 'formik';
import { Checkbox, FormControlLabel, FormControlLabelProps } from '@material-ui/core';
import FormControlTextField, { FormControlTextFieldProps } from './FormControlTextField';
import SingleSelect, { MultiProps, SingleProps } from './SingleSelect';
import { some } from '../../../constants';
import DateRangeFormControl, { DateRangeFormControlProps } from './DateRangeFormControl';

export const FieldTextContent: React.FC<FormControlTextFieldProps> = React.memo(props => {
  const [field, meta] = useField(props as any);
  const { submitCount } = useFormikContext();
  return (
    <FormControlTextField
      {...field}
      {...props}
      errorMessage={submitCount > 0 && meta.error ? meta.error : undefined}
    />
  );
});

export type SelectProps<T> = MultiProps<T> | SingleProps<T>;

export const FieldSelectContent: <T extends some>(
  props: SelectProps<T>,
) => React.ReactElement<SelectProps<T>> = props => {
  const [field, meta] = useField(props as any);
  const { submitCount } = useFormikContext();
  return (
    <SingleSelect
      {...field}
      {...props}
      errorMessage={submitCount > 0 && meta.error ? meta.error : undefined}
    />
  );
};

interface FieldCheckboxContentProps extends Omit<FormControlLabelProps, 'control'> {
  control?: React.ReactElement<any, any>;
}
export const FieldCheckboxContent: React.FC<FieldCheckboxContentProps> = React.memo(props => {
  const { control } = props;
  const [field] = useField(props as any);
  return (
    <FormControlLabel
      {...field}
      {...props}
      control={
        control || (
          <Checkbox
            color="primary"
            style={{ marginRight: 6 }}
            checked={props.checked || field.value}
          />
        )
      }
    />
  );
});

export const FieldDateRangeFormControl: React.FC<DateRangeFormControlProps> = React.memo(props => {
  const [field, meta] = useField(props as any);
  const { submitCount } = useFormikContext();
  return (
    <DateRangeFormControl
      {...field}
      {...props}
      errorMessage={submitCount > 0 && meta.error ? meta.error : undefined}
    />
  );
});
