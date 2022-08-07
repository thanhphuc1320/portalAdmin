import React from 'react';
import {
  Avatar,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItem,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import { Autocomplete, AutocompleteProps, AutocompleteRenderInputParams } from '@material-ui/lab';
import { useFormikContext } from 'formik';
import { debounce } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { BLUE, GREY_300, PRIMARY } from '../../../configs/colors';
import { some } from '../../../constants';
import { redMark, useStylesForm } from './Form';

const autocompleteCS = makeStyles(() => ({
  endAdornment: {
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
  },
  option: {
    padding: 0,
  },
}));

// interface T extends Object {}

interface FormControlAutoCompleteProps<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
> extends Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, 'renderInput'> {
  id?: string;
  label?: React.ReactNode;
  formControlStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  errorMessage?: string;
  placeholder?: string;
  optional?: boolean;
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
  loadOptions?: (input: string, aid?: some) => Promise<T[]>;
  startAdornment?: JSX.Element;
  endAdornment?: JSX.Element;
  iRef?: React.RefObject<HTMLDivElement>;
  readOnly?: boolean;
  aidState?: some;
  initOptions?: T[];
  typeSearch?: string;
}

function usePrevious(value: any) {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const FormControlAutoComplete: <
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(
  prop: FormControlAutoCompleteProps<T, Multiple, DisableClearable, FreeSolo>,
) => React.ReactElement<
  FormControlAutoCompleteProps<T, Multiple, DisableClearable, FreeSolo>
> = props => {
  const classes = useStylesForm();
  const classesComplete = autocompleteCS(props);
  const submitCount = useFormikContext()?.submitCount || 0;
  const {
    id,
    label,
    placeholder,
    errorMessage,
    formControlStyle,
    optional,
    renderInput,
    options,
    initOptions,
    loadOptions,
    getOptionLabel,
    startAdornment,
    endAdornment,
    inputStyle,
    labelStyle,
    iRef,
    readOnly,
    disableClearable,
    aidState,
    typeSearch,
    ...rest
  } = props;

  const errorMessageContext = submitCount > 0 && errorMessage;
  const [firstOption, setFirstOption] = React.useState<typeof options>(options);
  const [optionsTmp, setOption] = React.useState<typeof options>(options);
  const previous = usePrevious(optionsTmp);
  const [focus, setFocus] = React.useState(false);

  const onLoadOptions = React.useCallback(
    async (input: string, aid?: some) => {
      if (loadOptions) {
        const data = await loadOptions(input, aid);
        setOption(data || []);
      }
    },
    [loadOptions],
  );

  const onFirstLoadOptions = React.useCallback(
    debounce(
      async (input: string, aid?: some) => {
        if (loadOptions) {
          const data = await loadOptions(input, aid);
          if (data && data.length > 0) {
            setOption(data);
            setFirstOption(data);
          }
        }
      },
      500,
      {
        trailing: true,
        leading: false,
      },
    ),
    [],
  );

  React.useEffect(() => {
    if (loadOptions && options.length === 0) {
      onFirstLoadOptions('', aidState);
    } else {
      setOption(options);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!loadOptions && previous !== options) {
      setOption(options);
    }
  }, [id, loadOptions, options, previous]);

  React.useEffect(() => {
    onLoadOptions('', aidState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aidState]);

  React.useEffect(() => {
    if (initOptions && initOptions.length > 0) {
      setOption(initOptions || []);
      setFirstOption(initOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initOptions]);
  return (
    <FormControl
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={formControlStyle}
      error={!!errorMessageContext}
    >
      {label && (
        <InputLabel
          shrink
          htmlFor={id}
          style={{
            marginBottom: 4,
            position: 'relative',
            color: focus ? PRIMARY : undefined,
            ...labelStyle,
          }}
        >
          {label}
          {!optional && <> &nbsp;{redMark}</>}
        </InputLabel>
      )}
      <Autocomplete
        id={id}
        classes={{
          endAdornment: classesComplete.endAdornment,
          option: classesComplete.option,
        }}
        size="small"
        options={optionsTmp || []}
        onInputChange={(event: object, value: string, reason: string) => {
          reason === 'input' && loadOptions && onLoadOptions(value, aidState);
          (reason === 'clear' || value === '') &&
            loadOptions &&
            setOption(options.length ? options : firstOption);
        }}
        noOptionsText={<FormattedMessage id="noOption" />}
        renderInput={
          renderInput ||
          (params => (
            <TextField
              {...params}
              inputRef={iRef}
              fullWidth
              placeholder={placeholder}
              className={classes.bootstrap}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'off',
                style: { padding: 8, paddingRight: disableClearable ? 20 : 50 },
              }}
              InputProps={{
                ...params.InputProps,
                readOnly,
                style: {
                  minHeight: 40,
                  padding: 0,
                  paddingRight: 70,
                  ...inputStyle,
                },
                startAdornment: (
                  <>
                    {startAdornment}
                    {params.InputProps.startAdornment}
                  </>
                ),
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    {endAdornment}
                  </>
                ),
              }}
              onChange={() => {}}
              variant="outlined"
              size="small"
              error={focus ? undefined : !!errorMessageContext}
            />
          ))
        }
        disableClearable={disableClearable}
        getOptionLabel={getOptionLabel}
        renderOption={(option, { selected }) => (
          <TypeListToSearch
            option={option}
            selected={selected}
            getOptionLabel={getOptionLabel}
            typeSearch={typeSearch}
          />
        )}
        autoComplete
        {...rest}
      />
      <FormHelperText id={id} style={{ minHeight: 20, minWidth: 276 }}>
        {errorMessageContext}
      </FormHelperText>
    </FormControl>
  );
};

const TypeListToSearch = ({ selected, getOptionLabel, option, typeSearch }) => {
  return typeSearch === 'hotelItem' ? (
    <ListItem
      role={undefined}
      dense
      button
      style={{
        background: selected ? GREY_300 : undefined,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <Typography
        variant="body2"
        style={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          flex: 1,
          display: 'flex',
        }}
      >
        <div style={{ width: 40, height: 40, margin: '0 15px 0 5px' }}>
          <Avatar
            src={option?.bannerUrl}
            variant="square"
            style={{ margin: '0 10px', marginBottom: 0, width: 40, height: 40 }}
          />
        </div>
        <div style={{ display: 'flex', flex: 1, flexWrap: 'wrap' }}>
          <div style={{ fontWeight: 'bold' }}>{getOptionLabel && getOptionLabel(option)}</div>
          <div>{option?.address}</div>
        </div>
      </Typography>
      <DoneIcon
        style={{
          opacity: 0.6,
          width: 18,
          height: 18,
          visibility: selected ? 'visible' : 'hidden',
          color: BLUE,
          justifySelf: 'flex-end',
        }}
      />
    </ListItem>
  ) : (
    <ListItem
      role={undefined}
      dense
      button
      style={{
        background: selected ? GREY_300 : undefined,
        overflow: 'hidden',
        width: '100%',
      }}
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
        {getOptionLabel && getOptionLabel(option)}
      </Typography>
      <DoneIcon
        style={{
          opacity: 0.6,
          width: 18,
          height: 18,
          visibility: selected ? 'visible' : 'hidden',
          color: BLUE,
          justifySelf: 'flex-end',
        }}
      />
    </ListItem>
  );
};

export default FormControlAutoComplete;
