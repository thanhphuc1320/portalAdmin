import React from 'react';
import {
  Button,
  createStyles,
  TableCell,
  TableRow,
  Typography,
  withStyles,
} from '@material-ui/core';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import { useDrag, useDrop } from 'react-dnd';
import { ReactComponent as IconMoveable } from 'svg/icon_moveable.svg';
import { GRAY, PRIMARY } from 'configs/colors';
import { ACCEPT_TYPE } from './Container';
import { statusOption1 } from '../../../constants';

const style = {
  cursor: 'text',
  opacity: 1,
};

const StyledTableCell = withStyles(() =>
  createStyles({
    head: {
      whiteSpace: 'nowrap',
    },
    body: {
      fontSize: 14,
    },
    root: {
      borderBottom: 'none',
      color: GRAY,
      fontSize: 13,
    },
  }),
)(TableCell);

interface Props {
  id: string;
  dataItem: any;
  indexItem: number;
  onRemove(record: any): void;
  moveCard(droppedId: string, originalIndex: number): void;
  findCard(id: string): any;
}

const Card: React.FC<Props> = (props: Props) => {
  const { id, dataItem, indexItem, moveCard, findCard, onRemove } = props;

  const findIndex = findCard(id)?.index;

  const [{ isDragging }, drag] = useDrag({
    item: { type: ACCEPT_TYPE, id, originalIndex: findIndex },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    end: (dropResult, monitor) => {
      const { id: droppedId, originalIndex } = monitor.getItem();
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        moveCard(droppedId, originalIndex);
      }
    },
  });

  const [, drop] = useDrop({
    accept: ACCEPT_TYPE,
    canDrop: () => false,
    hover({ id: draggedId }: any) {
      if (draggedId !== id) {
        const { index: overIndex } = findCard(id);
        moveCard(draggedId, overIndex);
      }
    },
  });

  return (
    <TableRow
      className="table-row-drag-flight-sevice"
      ref={node => drag(drop(node))}
      style={{ ...style, opacity: isDragging ? 0 : 1 }}
    >
      <StyledTableCell align="left">
        <IconMoveable style={{ cursor: 'row-resize' }} />
      </StyledTableCell>

      <StyledTableCell align="center" style={{ borderBottom: 'none' }}>
        <Typography style={{ color: PRIMARY }} variant="subtitle2">
          {indexItem + 1}
        </Typography>
      </StyledTableCell>

      <StyledTableCell align="left">
        <Typography variant="body2">{dataItem?.name && `#${dataItem?.name}`}</Typography>
      </StyledTableCell>

      <StyledTableCell align="center">
        <Typography variant="body2">
          {statusOption1.find(element => element?.id === dataItem?.status)?.name}
        </Typography>
      </StyledTableCell>

      <StyledTableCell align="center">
        <Typography variant="body2">{dataItem?.id}</Typography>
      </StyledTableCell>

      <StyledTableCell align="center">
        <Typography variant="body2">{dataItem?.source}</Typography>
      </StyledTableCell>

      <StyledTableCell align="center">
        <Button
          variant="outlined"
          style={{ width: 32, height: 32 }}
          onClick={() => onRemove(dataItem)}
        >
          <DeleteOutlineRoundedIcon style={{ width: 16, height: 16 }} />
        </Button>
      </StyledTableCell>
    </TableRow>
  );
};

export default Card;
