import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Container from './Container';
import { some } from 'configs/utils';
import './style.scss';

interface Props {
  data: some[];
  sortedList?(list: some[]): void;
}

const HashtagRankingdsDnd: React.FC<Props> = (props: Props) => {
  const { data, sortedList } = props;
  return (
    <div className="HashtagRankingdsDnd">
      <DndProvider backend={HTML5Backend}>
        <Container data={data} sortedList={sortedList} />
      </DndProvider>
    </div>
  );
};

export default HashtagRankingdsDnd;
