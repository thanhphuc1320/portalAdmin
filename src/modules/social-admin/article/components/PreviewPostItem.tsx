import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { CardContent, Paper, Typography, Avatar } from '@material-ui/core';

import { BLACK, GRAY, WHITE } from 'configs/colors';
import { Col, Row } from 'modules/common/components/elements';
import LoadingButton from 'modules/common/components/LoadingButton';

import { ReactComponent as IconAvatarPreviewMobile } from 'svg/default_avt_mobile_preview.svg';
import { ReactComponent as IconMenuPreviewMobile } from 'svg/icon_preview_menu_mobile.svg';
import { ReactComponent as IconTickPreviewMobile } from 'svg/tick_icon.svg';
import './style.scss';

const cssClass = 'preview-post-item';
interface Props {
  postPreview?: any;
}
const PreviewPostItem: React.FC<Props> = props => {
  // eslint-disable-next-line no-empty-pattern
  const { postPreview } = props;

  const [hotelTags, setHotelTags] = useState<any>();
  const [imgCover, setImgCover] = useState<string>();
  const [videoCover, setVideoCover] = useState<string>('');

  const handlePreViewName = caId => {
    switch (caId) {
      case 1:
        return 'Tripi Partner';
      case 3:
        return 'Dinogo';

      default:
        return 'MyTour';
    }
  };

  React.useEffect(() => {
    if (postPreview.thumbnail) {
      setImgCover(postPreview?.thumbnail);
    } else {
      setImgCover(postPreview?.hotelImageItem?.location);
    }
    if (postPreview.hotelVideoItem?.location) {
      setVideoCover(postPreview.hotelVideoItem?.location);
    }
    setHotelTags(postPreview?.hotelTags);
  }, [postPreview]);

  return (
    <>
      <CardContent className={cssClass}>
        <Col style={{ position: 'relative' }}>
          <Col
            style={{
              position: 'relative',
              backgroundColor: 'black',
              maxHeight: 450,
              overflow: 'hidden',
            }}
          >
            <Row className={`${cssClass}-topHint`}>
              <Row style={{ justifyContent: 'space-between', paddingLeft: 10 }}>
                <IconAvatarPreviewMobile width={40} height={40} />
                <Typography variant="body2" style={{ color: WHITE, margin: '0px 10px' }}>
                  {handlePreViewName(postPreview?.caId)}
                </Typography>
                <IconTickPreviewMobile width={12} height={12} />
              </Row>
              <Row style={{ height: 40, alignItems: 'center', paddingRight: 10 }}>
                <IconMenuPreviewMobile />
              </Row>
            </Row>
            {!videoCover ? (
              <img
                src={imgCover}
                width={345}
                height={500}
                style={{ objectFit: 'cover' }}
                alt="item.name"
              />
            ) : (
              <ReactPlayer playing url={videoCover} width={345} height={500} loop muted />
            )}
          </Col>
          <Col style={{ width: '90%', margin: 'auto', marginTop: -35, zIndex: 1 }}>
            <Paper>
              {hotelTags &&
                hotelTags.map(item => {
                  return (
                    <Row
                      style={{
                        height: 60,
                        width: '90%',
                        borderBottom: '1px solid rgba(193,198,201,0.2)',
                        marginLeft: 10,
                      }}
                    >
                      <div className={`${cssClass}-box-icon`}>
                        <Avatar src={item?.avatar} style={{ width: 60, height: 60 }} />
                      </div>
                      <Col style={{ marginLeft: 10 }}>
                        <Typography variant="body2" style={{ color: GRAY }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body1" style={{ fontWeight: 700, color: BLACK }}>
                          {item.value < 0 ? '' : item.value}
                        </Typography>
                      </Col>
                    </Row>
                  );
                })}
            </Paper>
            <LoadingButton
              variant="contained"
              size="large"
              style={{
                minWidth: 120,
                backgroundColor: '#18A43B',
                color: WHITE,
                marginTop: 20,
                marginBottom: 20,
                padding: '15px 0px',
                borderRadius: 10,
                cursor: 'default',
              }}
              disableElevation
            >
              {postPreview.hotelAction === 'BOOK_NOW' ? 'ĐẶT NGAY' : 'XEM THÊM'}
            </LoadingButton>
          </Col>
        </Col>
      </CardContent>
    </>
  );
};

export default PreviewPostItem;
