import { ButtonBase, createStyles, makeStyles, Avatar } from '@material-ui/core';
import React from 'react';
import { ReactComponent as BtnIconClose } from 'svg/btn-icon-close.svg';
import { ImgCdn } from '../../common/components/elements';

const useStyles = makeStyles(() =>
  createStyles({
    buttonIcon: { '& .hide': { display: 'none' }, '&:hover .hide': { display: 'inline-block' } },
  }),
);

interface ProgressiveImageCheckBoxProps {
  index: number;
  value: boolean;
  onRemove(): void;
  thumbnail: string;
  widthImg?: number;
  heightImg?: number;
  disabled?: boolean;
  isNoCDN?: boolean;
}

function ProgressiveImageCheckBox(props: ProgressiveImageCheckBoxProps) {
  const { onRemove, thumbnail, widthImg, heightImg, disabled, isNoCDN } = props;
  const handleRemove = () => {
    if (!disabled) {
      onRemove();
    }
  };
  const classes = useStyles();
  return (
    <ButtonBase className={classes.buttonIcon}>
      <div
        style={{
          position: 'relative',
          width: widthImg || 200,
          height: heightImg || 160,
          overflow: 'hidden',
          display: 'flex',
          justifyItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'black',
          marginRight: 10,
          marginBottom: 10,
        }}
      >
        {isNoCDN ? (
          <Avatar
            variant="square"
            src={thumbnail}
            alt="media image"
            style={{ width: widthImg || 200, height: heightImg || 160, borderRadius: 4 }}
          />
        ) : (
          <ImgCdn
            styleProps={{ borderRadius: 4 }}
            url={thumbnail}
            widthProp={360}
            heightProp={360}
          />
        )}
        <BtnIconClose
          color="primary"
          style={{
            position: 'absolute',
            top: 5,
            right: 5,
            cursor: `${!disabled ? 'pointer' : 'wait'}`,
          }}
          onClick={handleRemove}
        />
      </div>
    </ButtonBase>
  );
}

export default ProgressiveImageCheckBox;
