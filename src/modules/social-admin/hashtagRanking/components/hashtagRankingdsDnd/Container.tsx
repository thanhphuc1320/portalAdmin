import React, { useState, useEffect, useCallback } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  createStyles,
  withStyles,
} from '@material-ui/core';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import Card from './Card';
import { some } from 'configs/utils';
import { GRAY } from 'configs/colors';

export const ACCEPT_TYPE = 'CARD';

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
      fontWeight: 'bold',
    },
  }),
)(TableCell);

interface Props {
  data: some[];
  sortedList?(list: some[]): void;
}

const Container: React.FC<Props> = (props: Props) => {
  const { data, sortedList } = props;
  const [cards, setCards] = useState<some[]>([]);

  useEffect(() => {
    setCards(data);
  }, [data]);

  const onRemove = useCallback(
    (record: any) => {
      const cardsNew = cards.filter(card => card?.id !== record?.id);
      setCards(cardsNew);
      sortedList && sortedList(cardsNew);
    },
    [cards, setCards, sortedList],
  );

  const findCard = useCallback(
    id => {
      const card = cards.filter(c => `${c?.id}` === id)[0];
      return {
        card,
        index: cards.indexOf(card),
      };
    },
    [cards],
  );

  const moveCard = useCallback(
    (id, atIndex) => {
      const { card, index } = findCard(id);
      const sortedCards = update(cards, {
        $splice: [
          [index, 1],
          [atIndex, 0, card],
        ],
      });
      setCards(sortedCards);
      sortedList && sortedList(sortedCards);
    },
    [cards, setCards, sortedList, findCard],
  );

  const [, drop] = useDrop({ accept: ACCEPT_TYPE });

  return (
    <TableContainer className="dnd-hashtag-ranking-table-container">
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left" />
            <StyledTableCell align="center">Vị trí</StyledTableCell>
            <StyledTableCell align="left">Hashtag</StyledTableCell>
            <StyledTableCell align="center">Trạng thái</StyledTableCell>
            <StyledTableCell align="center">Hashtag ID</StyledTableCell>
            <StyledTableCell align="center">Nguồn gốc</StyledTableCell>
            <StyledTableCell align="center">Thao tác</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody ref={drop}>
          {cards?.map((card, index) => (
            <Card
              key={card?.id}
              id={`${card?.id}`}
              indexItem={index}
              dataItem={card}
              moveCard={moveCard}
              findCard={findCard}
              onRemove={onRemove}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Container;
