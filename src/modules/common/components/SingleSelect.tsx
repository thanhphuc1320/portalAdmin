import React from 'react';
import {
  ClickAwayListener,
  Fade,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Paper,
  Popper,
  Typography,
  withStyles,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import IconClose from '@material-ui/icons/CloseOutlined';
import DoneIcon from '@material-ui/icons/Done';
import { remove } from 'lodash';
import { useIntl } from 'react-intl';
import { BLUE, BLUE_50 } from '../../../configs/colors';
import { some } from '../../../constants';
import FormControlTextField, { FormControlTextFieldProps } from './FormControlTextField';

interface CommonProps<T> extends FormControlTextFieldProps {
  getOptionLabel?: (option: T) => string;
  valueKey?: (option: T) => any;
  disableCloseIcon?: boolean;
  options: T[];
  horizontal?: boolean;
  classNameContainer?: string;
  classNameList?: string;
}
export interface SingleProps<T> extends CommonProps<T> {
  multiple?: false;
  value?: any;
  onSelectOption?: (value?: any) => void;
}
export interface MultiProps<T> extends CommonProps<T> {
  multiple: true;
  value?: any[];
  onSelectOption?: (value?: any[]) => void;
}

export type SelectProps<T> = MultiProps<T> | SingleProps<T>;

export const ListItemStyled = withStyles({
  root: {
    overflow: 'hidden',
    padding: '8px 16px',
    '&:hover': { background: BLUE_50 },
  },
})(ListItem);

export const SingleSelect: <T extends some>(
  prop: SelectProps<T>,
) => React.ReactElement<SelectProps<T>> = props => {
  const {
    options,
    valueKey,
    getOptionLabel: getLabel,
    multiple,
    onSelectOption,
    id,
    disabled,
    disableCloseIcon,
    value,
    horizontal,
    classNameContainer,
    classNameList,
    ...rest
  } = props;
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<any>();
  const intl = useIntl();

  const getValueKey = React.useCallback(
    (one: typeof options[number]) => {
      return valueKey ? valueKey(one) : one?.id;
    },
    [options, valueKey],
  );

  const getOptionLabel = React.useCallback(
    (one: typeof options[number]) => {
      return getLabel ? getLabel(one) : one.name;
    },
    [getLabel, options],
  );
  const isChecked = React.useCallback(
    (one: typeof options[number]) => {
      if (multiple) {
        return value && value?.length > 0
          ? value?.findIndex((v: any) => v === getValueKey(one)) !== -1
          : false;
      }
      return value === getValueKey(one);
    },
    [getValueKey, multiple, options, value],
  );

  const onSelectValue = React.useCallback(
    (one: typeof options[number]) => {
      if (multiple) {
        let tmp;
        if (isChecked(one)) {
          tmp = value ? remove(value, v => v !== getValueKey(one)) : [];
        } else {
          tmp = value ? [...value, getValueKey(one)] : [getValueKey(one)];
        }
        const hasAll = tmp.filter(v => v === undefined);
        const noUndefinedValue = tmp.filter(v => v !== undefined);
        const noUndefinedOptions = options.filter(v => getValueKey(v) !== undefined);
        if (
          hasAll?.length > 0 ||
          (noUndefinedValue?.length === noUndefinedOptions?.length &&
            options?.length !== noUndefinedOptions?.length)
        ) {
          onSelectOption && onSelectOption([]);
        } else {
          onSelectOption && onSelectOption(tmp);
        }
      } else {
        onSelectOption && onSelectOption(getValueKey(one));
        setOpen(false);
      }
    },
    [getValueKey, isChecked, multiple, onSelectOption, options, value],
  );

  const getTextInput = React.useMemo(() => {
    if (multiple) {
      if (value && options && value?.length === options.length) {
        return intl.formatMessage({ id: 'all' });
      }
      return value && value.length > 0
        ? options
            .filter(v => value.includes(getValueKey(v)))
            .map(v => getOptionLabel(v))
            .join(', ')
        : '';
    }
    const tmp = options?.find(one => getValueKey(one) === value);
    return tmp && `${getOptionLabel(tmp)}`;
  }, [getOptionLabel, getValueKey, intl, multiple, options, value]);

  const renderClose = React.useCallback(() => {
    if (disableCloseIcon || !open) return null;
    if (multiple) {
      if (value && value?.length > 0) {
        return (
          <IconButton style={{ padding: 2 }} onClick={() => onSelectOption && onSelectOption([])}>
            <IconClose style={{ height: 23, width: 23 }} />
          </IconButton>
        );
      }
    } else if (value) {
      return (
        <IconButton
          style={{ padding: 2 }}
          onClick={() => {
            onSelectOption && onSelectOption(undefined);
          }}
        >
          <IconClose style={{ height: 23, width: 23 }} />
        </IconButton>
      );
    }
    return null;
  }, [disableCloseIcon, open, multiple, value, onSelectOption]);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={classNameContainer || ''}>
        <FormControlTextField
          {...rest}
          id={id}
          readOnly
          horizontal={horizontal}
          focused={open}
          disabled={disabled}
          value={getTextInput || ''}
          innerRef={inputRef}
          endAdornment={
            <InputAdornment position="end">
              {renderClose()}
              <IconButton style={{ padding: 2, marginRight: 6 }}>
                <ArrowDropDownIcon style={{ transform: open ? 'rotate(180deg)' : undefined }} />
              </IconButton>
            </InputAdornment>
          }
          inputProps={{
            ...rest.inputProps,
            style: { textOverflow: 'ellipsis', ...rest.inputProps?.style },
          }}
          onClick={() => !disabled && setOpen(true)}
        />
        <Popper
          open={open}
          anchorEl={inputRef?.current}
          style={{
            width: inputRef?.current?.offsetWidth,
            margin: '4px 0',
            zIndex: 1300,
          }}
          placement="bottom"
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper style={{ maxHeight: 300, overflowY: 'auto' }}>
                <List className={classNameList || ''}>
                  {multiple && (
                    <ListItemStyled
                      role={undefined}
                      dense
                      button
                      onClick={() => {
                        if (multiple) {
                          if (value?.length === options.length) {
                            onSelectOption && onSelectOption([]);
                          } else {
                            onSelectOption && onSelectOption(options.map(v => getValueKey(v)));
                          }
                        }
                      }}
                      style={{ background: value?.length === options.length ? BLUE_50 : undefined }}
                    >
                      <Typography
                        variant="body2"
                        style={{
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          flex: 1,
                        }}
                      >
                        {intl.formatMessage({ id: 'all' })}
                      </Typography>
                      <DoneIcon
                        style={{
                          opacity: 0.6,
                          width: 18,
                          height: 18,
                          visibility: value?.length === options.length ? 'visible' : 'hidden',
                          color: BLUE,
                          justifySelf: 'flex-end',
                        }}
                      />
                    </ListItemStyled>
                  )}
                  {options?.length > 0 &&
                    options.map((one: typeof options[number], index: number) => (
                      <ListItemStyled
                        key={index}
                        role={undefined}
                        dense
                        button
                        onClick={() => onSelectValue(one)}
                        style={{ background: isChecked(one) ? BLUE_50 : undefined }}
                      >
                        <Typography
                          variant="body2"
                          style={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            flex: 1,
                          }}
                        >
                          {getOptionLabel && getOptionLabel(one)}
                        </Typography>
                        <DoneIcon
                          style={{
                            opacity: 0.6,
                            width: 18,
                            height: 18,
                            visibility: isChecked(one) ? 'visible' : 'hidden',
                            color: BLUE,
                            justifySelf: 'flex-end',
                          }}
                        />
                      </ListItemStyled>
                    ))}
                </List>
              </Paper>
            </Fade>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default SingleSelect;
