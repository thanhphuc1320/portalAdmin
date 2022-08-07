import { IconButton } from '@material-ui/core';
import icPrev from '@material-ui/icons/NavigateBefore';
import icNext from '@material-ui/icons/NavigateNext';
import React from 'react';
import { BLACK } from '../../../../configs/colors';
import {
  DESKTOP_WIDTH_NUM,
  MIN_TABLET_WIDTH_NUM,
  MOBILE_WIDTH_NUM,
  some,
  TABLET_WIDTH_NUM,
} from '../../../../constants';
import styles from './slick.module.scss';

const ArrowNext = ({ Icon, className, style, onClick }: some) => {
  const replaceClass = className.replace('slick-arrow', '');
  const isDisable = replaceClass.indexOf('slick-disabled') !== -1;
  return (
    <IconButton
      className={replaceClass}
      style={{ ...style, zIndex: 100, padding: 3, position: 'absolute' }}
      onClick={onClick}
      disabled={isDisable}
    >
      <Icon style={{ fill: BLACK, color: !isDisable ? BLACK : undefined }} />
    </IconButton>
  );
};

const ArrowBack = ({ Icon, className, style, onClick }: some) => {
  const replaceClass = className.replace('slick-arrow', '');
  const isDisable = replaceClass.indexOf('slick-disabled') !== -1;
  return (
    <IconButton
      className={replaceClass}
      style={{ ...style, zIndex: 100, position: 'absolute', padding: 3 }}
      disabled={isDisable}
      onClick={onClick}
    >
      <Icon style={{ fill: BLACK, color: !isDisable ? BLACK : undefined }} />
    </IconButton>
  );
};

export const slideSettings = (slides?: number, className?: string) => {
  return {
    className: className || styles.recentSearch,
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: slides || 10,
    slidesToScroll: 1,
    swipeToSlide: true,
    initialSlide: 0,
    variableWidth: true,
    // centerMode: true,
    nextArrow: <ArrowNext Icon={icNext} />,
    prevArrow: <ArrowBack Icon={icPrev} />,
    responsive: [
      {
        breakpoint: DESKTOP_WIDTH_NUM,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: TABLET_WIDTH_NUM,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: MIN_TABLET_WIDTH_NUM,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: MOBILE_WIDTH_NUM,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
};
