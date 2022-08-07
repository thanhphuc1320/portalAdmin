import { Box, createStyles, makeStyles } from '@material-ui/core';
import React from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import { some } from '../../../../constants';
import { ReactComponent as BtnIconClose } from 'svg/btn-icon-close.svg';
import ProgressiveImageCheckBox from '../ProgressiveImageCheckBox';

const useStyles = makeStyles(() =>
  createStyles({
    buttonIcon: { '& .hide': { display: 'none' }, '&:hover .hide': { display: 'inline-block' } },
    container: {
      width: '80%',
      height: 160,
    },
    myTextarea: {
      padding: 8,
      fontFamily: 'sans-serif',
    },
  }),
);

export const GridCustom = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;
interface Props {
  src: string;
  isChecked: number[];
  onRemove(): void;
  index: number;
  createdAt: string;
  type: string;
  setFilesUpload: (value: some) => void;
  widthImg?: number;
  heightImg?: number;
  disabled?: boolean;
  isNoCDN?: boolean;
}
export function GridImage(props: Props) {
  const {
    index,
    src,
    isChecked,
    onRemove,
    type,
    setFilesUpload,
    widthImg,
    heightImg,
    disabled,
    isNoCDN,
  } = props;

  const handleRemove = () => {
    if (!disabled) {
      onRemove();
    }
  };

  const classes = useStyles();
  return (
    <>
      {type === 'image' ? (
        <ProgressiveImageCheckBox
          index={index}
          value={isChecked.indexOf(index) !== -1}
          onRemove={() => {
            onRemove && onRemove();
            setFilesUpload([]);
          }}
          thumbnail={src}
          widthImg={widthImg || 200}
          heightImg={heightImg || 160}
          disabled={disabled}
          isNoCDN={isNoCDN}
        />
      ) : (
        <Box
          key={index}
          className={classes.buttonIcon}
          style={{
            position: 'relative',
            display: 'flex',
            justifyItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
            marginRight: 10,
            marginBottom: 10,
          }}
        >
          <ReactPlayer playing={false} url={src} controls width={200} height={160} />
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
        </Box>
      )}
    </>
  );
}

const GridItemWrapper = styled.div`
  padding-right: 16px;
  flex: 0 0;
  display: flex;
  justify-content: center;
  align-items: stretch;

  box-sizing: border-box;

  :before {
    content: '';
    display: table;
  }
`;

export const GridItem = ({ forwardedRef, ...props }: any) => {
  return <GridItemWrapper ref={forwardedRef} {...props} />;
};
