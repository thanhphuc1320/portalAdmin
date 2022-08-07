import React, { useState, useEffect, useCallback } from 'react';
import { TableContainer, Table, TableBody } from '@material-ui/core';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import Card from './Card';
import { some } from 'configs/utils';

export const ACCEPT_TYPE = 'CARD';

interface Props {
  data: some[];
  sortedList?(list: some[]): void;
  onChangePrice?(record: any): void;
}

const Container: React.FC<Props> = (props: Props) => {
  const { data, sortedList, onChangePrice } = props;
  const [cards, setCards] = useState<some[]>([]);

  useEffect(() => {
    setCards(data);
  }, [data]);

  const onRemove = useCallback(
    (record: any) => {
      const cardsNew = cards.filter(card => card.ticketOutboundId !== record.ticketOutboundId);
      setCards(cardsNew);
      sortedList && sortedList(cardsNew);
    },
    [cards, setCards, sortedList],
  );

  const findCard = useCallback(
    id => {
      const card = cards.filter(c => `${c.ticketOutboundId}` === id)[0];
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
    <TableContainer className="dnd-flight-sevice-table-container">
      <Table stickyHeader aria-label="sticky table">
        <TableBody ref={drop}>
          {cards.map(card => (
            <Card
              key={card.ticketOutboundId}
              id={`${card.ticketOutboundId}`}
              dataItem={card}
              moveCard={moveCard}
              findCard={findCard}
              onRemove={onRemove}
              onChangePrice={onChangePrice}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Container;
