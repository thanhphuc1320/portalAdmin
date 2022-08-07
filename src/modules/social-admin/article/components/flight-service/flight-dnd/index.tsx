import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Container from './Container';
import { some } from 'configs/utils';
import './style.scss';

interface Props {
  data: some[];
  sortedList?(list: some[]): void;
  onChangePrice?(record: any): void;
}

const DndFlightSevice: React.FC<Props> = (props: Props) => {
  const { data, sortedList, onChangePrice } = props;
  return (
    <div className="DndFlightSevice">
      <DndProvider backend={HTML5Backend}>
        <Container data={data} sortedList={sortedList} onChangePrice={onChangePrice} />
      </DndProvider>
    </div>
  );
};

export default DndFlightSevice;
