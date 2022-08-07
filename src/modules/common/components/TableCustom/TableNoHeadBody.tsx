import {
  Typography,
  Paper,
  fade,
  makeStyles,
  Theme,
  TableContainer,
  Table,
  TableCell,
  TablePagination,
  TablePaginationProps,
  withStyles,
} from '@material-ui/core';
import React from 'react';
import { useIntl } from 'react-intl';
import LoadingIcon from 'modules/common/components/LoadingIcon';
import { Row } from 'modules/common/components/elements';
import TablePaginationActionsCustom from './TablePaginationActionsCustom';
import { BLUE_200, GRAY, GREY_100, WHITE } from 'configs/colors';
import { ROWS_PER_PAGE_OPTIONS } from '../../../../constants';

export const TableCellTH = withStyles(() => ({
  root: {
    textAlign: 'center',
    padding: '12px 8px',
    background: WHITE,
    borderBottom: `1px solid ${GREY_100}`,
  },
  stickyHeader: { left: 'unset' },
}))(TableCell);

export const TypographyTH = withStyles(() => ({
  root: {
    whiteSpace: 'nowrap',
    color: GRAY,
  },
}))(Typography);

const useStyle = makeStyles((theme: Theme) => ({
  root: { justifyContent: 'flex-end' },
  selectRoot: {
    margin: '0 16px 0 8px',
    minWidth: '64px',
  },
  selectIcon: {
    top: 'calc(50% - 14px)',
  },
  caption: { fontSize: 12 },
  input: {
    '& .MuiTablePagination-select': {
      textAlign: 'left',
      textAlignLast: 'left',
      background: 'white',
      border: `0.5px solid ${GREY_100}`,
      borderRadius: '2px',
      fontSize: theme.typography.body2.fontSize,
      padding: '3px 12px',
    },
  },
  actions: {
    marginLeft: '10px',
    '& .MuiIconButton-root': {
      padding: '6px',
    },
  },
  even: {
    background: 'white',
  },
  odd: {
    background: BLUE_200,
  },
}));

interface Props {
  paginationProps?: TablePaginationProps;
  children: React.ReactNode;
  style?: React.CSSProperties;
  styleContainer?: React.CSSProperties;
  loading?: boolean;
  rowsPerPageOptions?: number[];
}
const TableNoHeadBody: React.FC<Props> = props => {
  const { children, loading, paginationProps, style, styleContainer, rowsPerPageOptions } = props;
  const classes = useStyle(props);
  const intl = useIntl();

  return (
    <Paper
      style={{
        position: 'relative',
        borderRadius: 0,
        ...style,
      }}
    >
      <TableContainer style={{ ...styleContainer }}>
        <Table
          stickyHeader
          aria-label="sticky table"
          className="custom-table"
          style={{ borderCollapse: 'separate' }}
        >
          {children}
        </Table>
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              background: fade(GREY_100, 0.7),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <LoadingIcon />
          </div>
        )}
      </TableContainer>
      {paginationProps && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions || ROWS_PER_PAGE_OPTIONS}
          component={Row}
          {...paginationProps}
          classes={{
            root: classes.root,
            selectRoot: classes.selectRoot,
            selectIcon: classes.selectIcon,
            input: classes.input,
            actions: classes.actions,
            caption: classes.caption,
          }}
          labelRowsPerPage={intl.formatMessage({ id: 'labelRowPerPage' })}
          ActionsComponent={TablePaginationActionsCustom}
        />
      )}
    </Paper>
  );
};

export default TableNoHeadBody;
