import { createMuiTheme, darken, fade } from '@material-ui/core/styles';
import DefaultTheme from 'react-dates/lib/theme/DefaultTheme';
import aphroditeInterface from 'react-with-styles-interface-aphrodite';
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
import { BLACK, GREY, GREY_300, GREY_700, PRIMARY, SECONDARY, TEAL_200, WHITE } from './colors';

ThemedStyleSheet.registerInterface(aphroditeInterface);
ThemedStyleSheet.registerTheme({
  reactDates: {
    ...DefaultTheme.reactDates,
    color: {
      ...DefaultTheme.reactDates.color,
      selected: {
        ...DefaultTheme.reactDates.color.selected,
        backgroundColor: TEAL_200,
        backgroundColor_active: TEAL_200,
        backgroundColor_hover: TEAL_200,
        borderColor: TEAL_200,
        borderColor_active: TEAL_200,
        borderColor_hover: TEAL_200,
      },
      selectedSpan: {
        backgroundColor: fade(TEAL_200, 0.2),
        backgroundColor_active: fade(TEAL_200, 0.2),
        backgroundColor_hover: fade(TEAL_200, 0.2),
        borderColor: fade(TEAL_200, 0.2),
        borderColor_active: fade(TEAL_200, 0.2),
        borderColor_hover: fade(TEAL_200, 0.2),
      },
      hoveredSpan: {
        backgroundColor: fade(TEAL_200, 0.2),
        backgroundColor_active: fade(TEAL_200, 0.2),
        backgroundColor_hover: fade(TEAL_200, 0.2),
        borderColor: fade(TEAL_200, 0.2),
        borderColor_active: fade(TEAL_200, 0.2),
        borderColor_hover: fade(TEAL_200, 0.2),
      },
    },
  },
});

export const THEME = {
  primary: PRIMARY,
  secondary: SECONDARY,
};

const typography = {
  fontFamily: ['Manrope', 'BlinkMacSystemFont', 'sans-serif'].join(','),
  h1: { fontSize: 96, lineHeight: '128px', fontWeight: 'lighter' },
  h2: { fontSize: 60, lineHeight: '80px', fontWeight: 'lighter' },
  h3: { fontSize: 48, lineHeight: '68px', fontWeight: 'lighter' },
  h4: { fontSize: 34, lineHeight: '48px', fontWeight: 'normal' },
  h5: { fontSize: 24, lineHeight: '34px', fontWeight: 'normal' },
  h6: { fontSize: 20, lineHeight: '32px', fontWeight: 'normal' },
  htmlFontSize: 14,
  fontSize: 14,
  subtitle0: { fontSize: 18, lineHeight: '28px', fontWeight: 'bold' },
  subtitle1: { fontSize: 16, lineHeight: '24px', fontWeight: 'bold' },
  subtitle2: { fontSize: 14, lineHeight: '20px', fontWeight: 'bold' },
  subtitle3: { fontSize: 12, lineHeight: '18px', fontWeight: 'bold' },
  body1: { fontSize: 16, lineHeight: '24px', fontWeight: 'normal' },
  body2: { fontSize: 14, lineHeight: '20px', fontWeight: 'normal' },
  body3: { fontSize: 12, lineHeight: '18px', fontWeight: 'normal' },
  caption: { fontSize: '12px', lineHeight: '18px' },
  button: {
    fontSize: 14,
    textTransform: 'none',
    lineHeight: 'auto',
    fontWeight: 'normal',
  },
};

export const MUI_THEME = createMuiTheme({
  palette: {
    primary: {
      light: fade(PRIMARY, 0.9),
      main: PRIMARY,
      dark: darken(PRIMARY, 0.1),
      contrastText: '#ffffff',
    },
    secondary: {
      light: fade(SECONDARY, 0.9),
      main: SECONDARY,
      dark: darken(SECONDARY, 0.1),
      contrastText: '#ffffff',
    },
    text: {
      primary: GREY,
      secondary: fade(GREY, 0.6),
    },
  },
  typography,
  overrides: {
    MuiPaper: {
      root: { borderRadius: '6px' },
      outlined: {
        border: `1px solid ${GREY_300}`,
      },
      elevation1: {
        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.05), -2px -2px 4px rgba(0, 0, 0, 0.05)',
      },
      elevation2: {
        boxShadow: ' 3px 3px 6px rgba(0, 0, 0, 0.05), -3px -3px 6px rgba(0, 0, 0, 0.05)',
      },
      elevation3: {
        boxShadow: '5px 5px 9px rgba(0, 0, 0, 0.05), -5px -5px 9px rgba(0, 0, 0, 0.05)',
      },
      elevation4: {
        boxShadow: '5px 5px 16px rgba(0, 0, 0, 0.05), -5px -5px 16px rgba(0, 0, 0, 0.05)',
      },
      elevation5: {
        boxShadow: '5px 5px 24px rgba(0, 0, 0, 0.05), -5px -5px 24px rgba(0, 0, 0, 0.05)',
      },
    },
    MuiCard: {
      root: { borderRadius: '4px' },
    },
    MuiButton: {
      sizeLarge: {
        minHeight: '40px',
        padding: '0 8px',
        ...typography.button,
      },
      sizeSmall: {
        minHeight: '24px',
        padding: '0 8px',
        ...typography.button,
      },
      outlined: {
        color: GREY_700,
        background: WHITE,
      },
      root: {
        minHeight: '30px',
        minWidth: 'unset',
        padding: '0 8px',
        ...typography.button,
      },
    },
    MuiInputLabel: {
      root: { ...typography.body2, color: BLACK, position: 'relative', marginBottom: 4 },
      shrink: {
        transform: 'translate(0, 1.5px)',
      },
      formControl: {
        ...typography.body2,
        position: 'relative',
        marginBottom: 4,
      },
    },
    MuiFormHelperText: {
      root: { marginTop: 0, ...typography.body2 },
    },
  },
});
