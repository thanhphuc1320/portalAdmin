import React from 'react';
import { fade } from '@material-ui/core';
import LoadingIcon from './LoadingIcon';
import { GREY_100 } from 'configs/colors';

interface Props {
  loading: boolean;
  style?: React.CSSProperties;
}

const LoadingBox: React.FC<Props> = props => {
  const { loading, style } = props;
  return (
    <>
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
            ...style,
          }}
        >
          <LoadingIcon style={{ minHeight: 320 }} />
        </div>
      )}
    </>
  );
};

export default LoadingBox;
