import React from 'react';
import Slider from 'react-slick';
import ReactPlayer from 'react-player';
import { useFormikContext } from 'formik';

import { Box, Card, CardContent, IconButton, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';

import { Row } from '../../../common/components/elements';
import { BLACK, GRAY_DARK, WHITE } from '../../../../configs/colors';
import LoadingButton from '../../../common/components/LoadingButton';
import { replaceURLWithHTMLLinks } from '../../utils/helpers/helpers';
import { some } from '../../../../constants';
import { POST_TYPE } from 'modules/social-admin/constants';

import HotelCardMobile from './HotelCardMobile';
import LayoutReview from './media-layout-review/LayoutReview';
import PreviewPostItem from './PreviewPostItem';

import { ReactComponent as IconMobile } from 'svg/icon-mobile.svg';
import { ReactComponent as ArrowIconCircle } from 'svg/ic_arrow_circle.svg';
import { ReactComponent as IconGourpButtonReactTypeVideo } from 'svg/gourp-button-react-type-video.svg';

const ArrowNext = ({ Icon, className, style, onClick }: some) => {
  const replaceClass = className.replace('slick-arrow', '');
  const isDisable = replaceClass.indexOf('slick-disabled') !== -1;
  return (
    <IconButton
      className={replaceClass}
      style={{
        ...style,
        zIndex: 100,
        position: 'absolute',
        padding: 0,
        backgroundColor: WHITE,
        transform: 'rotate(90deg)',
      }}
      onClick={onClick}
      disabled={isDisable}
    >
      <Icon style={{ color: !isDisable ? BLACK : undefined }} />
    </IconButton>
  );
};

const ArrowBack = ({ Icon, className, style, onClick }: some) => {
  const replaceClass = className.replace('slick-arrow', '');
  const isDisable = replaceClass.indexOf('slick-disabled') !== -1;
  return (
    <IconButton
      className={replaceClass}
      style={{ ...style, zIndex: 100, position: 'absolute', padding: 0, backgroundColor: WHITE }}
      disabled={isDisable}
      onClick={onClick}
    >
      <Icon style={{ color: !isDisable ? BLACK : undefined, transform: 'rotate(-90deg)' }} />
    </IconButton>
  );
};

export interface SimpleDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  postPreview?: any;
  hotelList: any;
  listPhotos: any;
  loading: boolean;
}

function PreviewHotel(props: SimpleDialogProps) {
  const { setOpen, open, postPreview, hotelList, listPhotos, loading } = props;
  const { submitForm } = useFormikContext();

  const isPostTypeDefault = postPreview?.type === POST_TYPE.DEFAULT;
  const isPostTypeVideo = postPreview?.type === POST_TYPE.VIDEO;
  const isPostTypeItem = postPreview?.type === POST_TYPE.ITEM;

  const handleClose = () => {
    setOpen(false);
  };
  const imageUrl = listPhotos ? listPhotos[0]?.location : '';
  if (!listPhotos) return <div />;

  return (
    <Dialog
      className="article-preview-hotel"
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <Box style={{ maxHeight: 788, height: '100%', width: 375 }}>
        <Box>
          <Row style={{ justifyContent: 'space-between' }}>
            <Row>
              <IconMobile style={{ marginRight: 16 }} /> Xem trước bài viết
            </Row>
            <IconButton onClick={handleClose}>
              <CloseIcon style={{ color: '#3D3F40' }} />
            </IconButton>
          </Row>

          <Card
            className="scrollbar-2"
            style={isPostTypeItem ? { height: 740, overflow: 'auto' } : { height: 'fit-content' }}
          >
            {isPostTypeDefault && (
              <>
                <LayoutReview mediaInfos={listPhotos} layout={postPreview?.layout} />

                <CardContent style={{ paddingBottom: 0 }}>
                  <Slider
                    infinite
                    slidesToShow={1}
                    responsive={[
                      {
                        breakpoint: 1750,
                        settings: {
                          slidesToShow: 1,
                          slidesToScroll: 1,
                        },
                      },
                      {
                        breakpoint: 1300,
                        settings: {
                          slidesToShow: 1,
                          slidesToScroll: 1,
                        },
                      },
                      {
                        breakpoint: 700,
                        settings: { slidesToShow: 1, slidesToScroll: 1 },
                      },
                    ]}
                    slidesToScroll={1}
                    arrows
                    nextArrow={<ArrowNext Icon={ArrowIconCircle} />}
                    prevArrow={<ArrowBack Icon={ArrowIconCircle} />}
                  >
                    {hotelList?.map((ele: any) => (
                      <HotelCardMobile hotelData={ele} />
                    ))}
                  </Slider>
                </CardContent>

                <CardContent style={{ padding: '8px 16px', display: 'flex' }}>
                  <div
                    style={{
                      color: GRAY_DARK,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      height: '100%',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: postPreview?.content && replaceURLWithHTMLLinks(postPreview?.content),
                    }}
                  />
                </CardContent>
              </>
            )}

            {isPostTypeVideo && (
              <Box style={{ position: 'relative', width: '100%', backgroundColor: 'black' }}>
                <ReactPlayer playing url={imageUrl} height={638} width={375} loop />
                <IconGourpButtonReactTypeVideo className="article-preview-hotel-type-video-group-button" />

                <div className="article-preview-hotel-type-video-text">
                  <Typography
                    variant="subtitle1"
                    className="article-preview-hotel-type-video-title"
                  >
                    {postPreview?.title}
                  </Typography>
                  <div
                    className="article-preview-hotel-type-video-content"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: postPreview?.content && replaceURLWithHTMLLinks(postPreview?.content),
                    }}
                  />
                </div>
              </Box>
            )}

            {isPostTypeItem && <PreviewPostItem postPreview={postPreview} />}
          </Card>
        </Box>
      </Box>
      <Card style={{ overflow: 'unset', zIndex: 2 }}>
        <Row style={{ margin: 16, justifyContent: 'space-between' }}>
          <LoadingButton
            loading={loading}
            variant="outlined"
            size="large"
            style={{ minWidth: 120, marginRight: 25 }}
            disableElevation
            onClick={() => handleClose()}
          >
            Tiếp tục soạn thảo
          </LoadingButton>
          <LoadingButton
            loading={loading}
            type="submit"
            variant="contained"
            size="large"
            style={{ minWidth: 120 }}
            color="primary"
            disableElevation
            onClick={() => submitForm()}
          >
            Chia sẻ bài viết ngay
          </LoadingButton>
        </Row>
      </Card>
    </Dialog>
  );
}

export default PreviewHotel;
