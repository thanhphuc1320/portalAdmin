import { Box, Card, CardContent, IconButton, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import ReactPlayer from 'react-player';
import { ReactComponent as IconMobile } from 'svg/icon-mobile.svg';
import { ReactComponent as IconGourpButtonReactTypeVideo } from 'svg/gourp-button-react-type-video.svg';
import { Row } from 'modules/common/components/elements';
import { replaceURLWithHTMLLinks } from 'modules/social-admin/utils/helpers/helpers';
import { GRAY_DARK } from 'configs/colors';
import { some } from 'configs/utils';
import { POST_TYPE } from 'modules/social-admin/constants';

export interface SimpleDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  postData?: any;
  mediaList?: some[];
  postType: string;
  mediaLink: string;
}

function PostCrawlerPreview(props: SimpleDialogProps) {
  const { setOpen, open, postData, mediaLink, postType } = props;

  const handleClose = () => {
    setOpen(false);
  };

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
            <IconButton onClick={() => handleClose()}>
              <CloseIcon style={{ color: '#3D3F40' }} />
            </IconButton>
          </Row>
          <Card>
            {postType === POST_TYPE.VIDEO && (
              <Box style={{ position: 'relative', width: '100%', backgroundColor: 'black' }}>
                <ReactPlayer playing url={mediaLink} width={375} height={670} loop />
                <IconGourpButtonReactTypeVideo className="article-preview-hotel-type-video-group-button" />

                <div className="article-preview-hotel-type-video-text">
                  <Typography
                    variant="subtitle1"
                    className="article-preview-hotel-type-video-title"
                  >
                    {postData?.title}
                  </Typography>
                  <div
                    className="article-preview-hotel-type-video-content"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: postData?.content ? replaceURLWithHTMLLinks(postData?.content) : '',
                    }}
                  />
                </div>
              </Box>
            )}
            {postType === 'default' && postData?.content && (
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
                    __html: replaceURLWithHTMLLinks(postData?.content),
                  }}
                />
              </CardContent>
            )}
          </Card>
        </Box>
      </Box>
    </Dialog>
  );
}

export default PostCrawlerPreview;
