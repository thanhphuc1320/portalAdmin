import { Checkbox, withStyles } from '@material-ui/core';
import { GREY_500, SECONDARY, WHITE } from '../../../configs/colors';

export const WhiteBackgroundCheckbox = withStyles(() => ({
  root: {
    color: SECONDARY,
    '&$checked': {
      color: SECONDARY,
      '& .MuiIconButton-label': {
        position: 'relative',
        zIndex: 0,
      },
      '& .MuiIconButton-label:after': {
        content: '""',
        left: 4,
        top: 4,
        height: 18,
        width: 18,
        position: 'absolute',
        backgroundColor: WHITE,
        zIndex: -1,
      },
    },
    '&:not($checked)': {
      color: GREY_500,
      '& .MuiIconButton-label': {
        position: 'relative',
        zIndex: 0,
      },
      '& .MuiIconButton-label:after': {
        content: '""',
        left: 4,
        top: 4,
        height: 18,
        width: 18,
        position: 'absolute',
        backgroundColor: WHITE,
        zIndex: -1,
      },
    },
  },
  checked: {},
}))(Checkbox);
