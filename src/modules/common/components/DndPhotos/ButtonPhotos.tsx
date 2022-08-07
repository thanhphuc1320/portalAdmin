import { ButtonBase, Typography } from '@material-ui/core';
import React from 'react';
import { ReactComponent as AddIcon } from 'svg/icon_add_media.svg';
import { GREY_100, GREY_400 } from 'configs/colors';

interface Props {
  label?: string;
  onClick(): void;
}

const ButtonPhotos: React.FC<Props> = (props: Props) => {
  const { label, onClick } = props;
  return (
    <div className="DndPhotosCore">
      <ButtonBase
        style={{
          background: GREY_100,
          border: `1px dashed ${GREY_400}`,
          boxSizing: 'border-box',
          borderRadius: 4,
          width: 200,
          height: 160,
          display: 'flex',
          marginRight: 10,
          marginBottom: 10,
        }}
        onClick={onClick}
      >
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

export default ButtonPhotos;
