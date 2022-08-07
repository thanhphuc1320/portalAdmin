import React from 'react';
import { ButtonBase, Typography, fade } from '@material-ui/core';
import LoadingIcon from '../LoadingIcon';
import { ReactComponent as AddIcon } from 'svg/icon_add_media.svg';
import { GREY_100, GREY_400 } from 'configs/colors';

interface Props {
  loading: boolean;
  label?: string;
  styleButton?: React.CSSProperties;
  styleBoxLoading?: React.CSSProperties;
}

const ButtonPhotosLoading: React.FC<Props> = (props: Props) => {
  const { loading, label, styleButton, styleBoxLoading } = props;
  return (
    <div className="DndPhotosCore">
      <ButtonBase
        style={{
          position: 'relative',
          background: GREY_100,
          border: `1px dashed ${GREY_400}`,
          boxSizing: 'border-box',
          borderRadius: 4,
          width: 200,
          height: 160,
          display: 'flex',
          marginRight: 10,
          marginBottom: 10,
          ...styleButton,
        }}
      >
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
              ...styleBoxLoading,
            }}
          >
            <LoadingIcon style={{ minHeight: 100 }} />
          </div>
        )}
        <Typography
          variant="body2"
          style={{
            color: GREY_400,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <AddIcon width={48} stroke={GREY_400} />
          {label && (
            <Typography
              variant="body2"
              style={{
                color: GREY_400,
                whiteSpace: 'pre-line',
                position: 'relative',
                top: 5,
              }}
            >
              {label}
            </Typography>
          )}
        </Typography>
      </ButtonBase>
    </div>
  );
};

export default ButtonPhotosLoading;
