import React from 'react';
import CensorTable from '../component/CensorTable';
import './style.scss';

const cssClass = 'censor-list-page';

interface Props {}

const Censor: React.FC<Props> = () => {
  return (
    <div className={`${cssClass}`}>
      <div
        className={`${cssClass}`}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CensorTable />
      </div>
    </div>
  );
};

export default Censor;
