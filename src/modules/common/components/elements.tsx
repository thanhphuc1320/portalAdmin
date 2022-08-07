import React from 'react';
import {
  Card,
  createStyles,
  IconButton,
  Switch,
  Tab,
  Theme,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core';
import { SwitchClassKey, SwitchProps } from '@material-ui/core/Switch';
import { Alert, AlertTitle } from '@material-ui/lab';
import { AlertProps } from '@material-ui/lab/Alert';
import { OptionsObject, SnackbarMessage } from 'notistack';
import MaskedInput from 'react-text-mask';
import styled from 'styled-components';
import { GREY_500, PRIMARY } from '../../../configs/colors';
import { HEADER_HEIGHT } from '../../../layout/constants';

export const PageWrapper = styled.div`
  min-height: ${window.innerHeight - HEADER_HEIGHT}px;
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    180deg,
    rgba(143, 0, 71, 1) 0%,
    rgba(204, 0, 102, 1) 50%,
    rgba(245, 204, 224, 1) 100%
  );
`;

export const Wrapper = styled.div`
  border-radius: 4px;
  position: absolute;
  top: 0;
  left: 0;
  transition: all 300ms;
  min-width: 100%;
  overflow: hidden;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CustomTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
  },
  selected: {
    color: theme.palette.primary.main,
  },
}))(Tab);

export function snackbarSetting(
  closeSnackbar: (key: string) => void,
  alertProps?: AlertProps,
  alertTitle?: React.ReactNode,
) {
  return {
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'right',
    },
    preventDuplicate: true,
    autoHideDuration: 3000,
    // persist: true,
    content: (key: string, msg: SnackbarMessage) => (
      <Alert
        style={{ minWidth: '240px' }}
        onClose={() => closeSnackbar(key)}
        severity={alertProps?.color}
        {...alertProps}
      >
        {alertTitle && <AlertTitle>{alertTitle}</AlertTitle>}
        <Typography variant="body2" color="inherit">
          {msg}
        </Typography>
      </Alert>
    ),
  } as OptionsObject;
}

export const IconButtonStyled = withStyles({
  root: {
    stroke: GREY_500,
    '&:hover': {
      stroke: PRIMARY,
    },
  },
})(IconButton);

export const LightTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    border: `0.5px solid ${GREY_500}`,
    color: theme.palette.text.primary,
    fontSize: theme.typography.caption.fontSize,
    borderRadius: 0,
    boxSizing: 'border-box',
    fontWeight: 'normal',
  },
}))(Tooltip);

interface DateMaskCustomProps {
  inputRef: (ref: HTMLInputElement | null) => void;
  placeholder: string;
}

export const DateMaskCustomRange = (props: DateMaskCustomProps) => {
  const { inputRef, placeholder, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref: any) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[
        /\d/,
        /\d/,
        '/',
        /\d/,
        /\d/,
        '/',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        ' ',
        '-',
        ' ',
        /\d/,
        /\d/,
        '/',
        /\d/,
        /\d/,
        '/',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]}
      placeholder={placeholder}
      guide={false}
      // placeholderChar="\u2000"
      keepCharPositions
    />
  );
};

export const DateMaskCustomSingle = (props: DateMaskCustomProps) => {
  const { inputRef, placeholder, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref: any) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
      placeholder={placeholder}
      guide={false}
    />
  );
};
export const RenderTag = (value: any[]) => {
  return (
    <Tooltip title={value.map(v => v.name).join(', ')}>
      <Typography
        variant="body2"
        style={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          maxWidth: 150,
          paddingLeft: 8,
        }}
      >
        {value.map(v => v.name).join(', ')}
      </Typography>
    </Tooltip>
  );
};

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}
interface Props extends SwitchProps {
  classes: Styles;
}
export const IOSSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 42,
      height: 26,
      padding: 0,
    },
    switchBase: {
      padding: 1,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: PRIMARY,
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#52d869',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 24,
      height: 24,
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }),
)(({ classes, ...props }: Props) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

export const CardCustom = withStyles(() => ({
  root: {
    '&:hover': {
      boxShadow: '0px 4px 9px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.1)',
    },
    cursor: 'pointer',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'flex-start',
    flex: 1,
    border: 'none',
    borderRadius: 12,
  },
}))(Card);

interface ImgCdnProps {
  url: string;
  widthProp: number;
  heightProp: number;
  styleProps?: any;
  className?: string;
}

export const ImgCdn = (props: ImgCdnProps) => {
  const { url, widthProp, heightProp, styleProps, className } = props;
  return (
    <>
      <img
        style={{ ...styleProps }}
        className={className || ''}
        src={`https://tripi.vn/cdn-cgi/image/width=${widthProp},height=${heightProp}/${url}`}
        alt=""
      />
    </>
  );
};
