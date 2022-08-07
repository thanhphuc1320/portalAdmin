import React from 'react';
import { TableRow } from '@material-ui/core';
import { useDrag, useDrop } from 'react-dnd';
import FlightTableCel from '../FlightTableCel';
import { ACCEPT_TYPE } from './Container';

const style = {
  cursor: 'text',
  opacity: 1,
};

interface Props {
  id: string;
  dataItem: any;
  moveCard(droppedId: string, originalIndex: number): void;
  findCard(id: string): any;
  onRemove?(record: any): void;
  onChangePrice?(record: any): void;
}

const Card: React.FC<Props> = (props: Props) => {
  const { id, dataItem, moveCard, findCard, onRemove, onChangePrice } = props;

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

  const opacity = isDragging ? 0 : 1;

  return (
    <TableRow
      className="table-row-drag-flight-sevice"
      ref={node => drag(drop(node))}
      style={{ ...style, opacity }}
    >
      <FlightTableCel
        record={dataItem}
        isShowColumnMove
        isLabel
        isShowRemove
        onRemove={onRemove}
        onChangePrice={onChangePrice}
      />
    </TableRow>
  );
};

export default Card;
