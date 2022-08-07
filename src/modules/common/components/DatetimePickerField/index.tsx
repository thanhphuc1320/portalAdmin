import MomentUtils from '@date-io/moment';
import { createMuiTheme, InputAdornment, IconButton } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment, { Moment } from 'moment';
import React, { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useFormikContext } from 'formik';
import { connect } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { SECONDARY } from 'configs/colors';
import { AppState } from 'redux/reducers';
import { ReactComponent as IconCalender } from 'svg/ic_calendar.svg';
import FormControlTextField from '../FormControlTextField';
import { DATE_TIME_HOUR_FORMAT_PICKER } from 'models/moment';
import { isEmpty } from 'configs/utils';
import './style.scss';

const DatetimePickerField = connect((state: AppState) => ({ locale: state.intl.locale }))(
  (props: {
    id: string;
    label?: React.ReactNode;
    placeholder?: string;
    date?: Moment;
    minDate?: Moment;
    maxDate?: Moment;
    onChange?: (val: Moment | null) => void;
    optional?: boolean;
    errorMessage?: string;
    errorHot?: string;
    inputStyle?: React.CSSProperties;
    formatDate?: any;
    disableFuture?: boolean;
    disablePast?: boolean;
    disabled?: boolean;
    isDisableTime?: boolean;
  }) => {
    const {
      id,
      label,
      placeholder,
      date,
      minDate,
      maxDate,
      onChange,
      optional,
      formatDate,
      errorMessage,
      errorHot,
      inputStyle,
      disableFuture,
      disablePast,
      disabled,
      isDisableTime = false,
    } = props;

    const submitCount = useFormikContext()?.submitCount || 0;
    const [dateFormatStr, setDateFormatStr] = React.useState(
      `${date ? date.format(DATE_TIME_HOUR_FORMAT_PICKER) : ''}`,
    );
    const [open, setOpen] = useState(false);
    const theme = useMemo(() => createMuiTheme({ palette: { primary: { main: SECONDARY } } }), []);

    const textChange = React.useCallback(
      (text: string) => {
        if (isEmpty(text)) {
          onChange && onChange(null);
        }
        const dateTmp = moment(text, DATE_TIME_HOUR_FORMAT_PICKER, true);
        if (dateTmp?.isValid() && dateTmp.isSameOrBefore(moment().startOf('day'))) {
          onChange && onChange(dateTmp);
        } else {
          onChange && onChange(null);
        }
      },
      [onChange],
    );

    React.useEffect(() => {
      setDateFormatStr(
        `${
          date
            ? formatDate
              ? date.format(formatDate)
              : date.format(DATE_TIME_HOUR_FORMAT_PICKER)
            : ''
        }`,
      );
      // eslint-disable-next-line
    }, [date]);

    return (
      <div>
        <FormControlTextField
          id={id}
          formControlStyle={inputStyle}
          label={label}
          fullWidth
          value={dateFormatStr}
          style={{
            background: 'white',
            width: '100%',
            ...inputStyle,
          }}
          optional={optional}
          inputProps={{ style: { width: '100%' }, autoComplete: 'off', maxLength: 100 }}
          placeholder={placeholder || 'dd/MM/yyyy HH:mm'}
          onChange={e => {
            setDateFormatStr(e.target.value);
            textChange(e.target.value);
          }}
          onClick={() => setOpen(true)}
          errorMessage={errorHot || submitCount > 0 ? errorMessage : ''}
          endAdornment={
            <InputAdornment position="end" style={{ marginRight: 8 }}>
              <IconButton size="small" edge="start">
                <IconCalender />
              </IconButton>
            </InputAdornment>
          }
          disabled={disabled}
        />
        <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
          <ThemeProvider theme={theme}>
            <DateTimePicker
              variant="dialog"
              autoOk
              open={open}
              disableFuture={disableFuture}
              disablePast={disablePast}
              maxDate={maxDate || undefined}
              minDate={minDate || undefined}
              format={formatDate || 'dd/MM/yyyy HH:mm'}
              views={
                isDisableTime
                  ? ['year', 'month', 'date']
                  : ['year', 'month', 'date', 'hours', 'minutes']
              }
              value={date || null}
              onChange={newDate => {
                onChange && onChange(newDate);
              }}
              TextFieldComponent={() => <></>}
              onAccept={() => setOpen(false)}
              onClose={() => setOpen(false)}
              okLabel={<FormattedMessage id="confirm" />}
              cancelLabel={<FormattedMessage id="cancel" />}
              disabled={disabled}
              disableToolbar={isDisableTime || false}
            />
          </ThemeProvider>
        </MuiPickersUtilsProvider>
      </div>
    );
  },
);
export default DatetimePickerField;
