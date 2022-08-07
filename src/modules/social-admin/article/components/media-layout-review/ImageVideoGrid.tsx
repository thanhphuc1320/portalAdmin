import React from 'react';
import getImageOrientation from 'get-image-orientation';
import { ReactComponent as IconVolumnOn } from 'svg/icon_volumn_on.svg';
import { ReactComponent as IconVolumnOff } from 'svg/icon_volumn_off.svg';
import { MEDIA_TYPE } from 'modules/social-admin/constants';
import { ImgCdn } from 'modules/common/components/elements';

const cssClass = 'aspect-media-item';

interface Props {
  mediaItem: any;
  orientation?: string;
  index: number;
  controls?: boolean;
  className?: string;
  styleAspectRatio?: any;
  styleMedia?: any;
  onSelected?(index: number): void | undefined;
  onEndedVideo?(): void | undefined;
  onEndedVideoIndex?(index: number): void | undefined;
}

const AspectMediaItem: React.FC<Props> = props => {
  const { mediaItem, index, className, styleAspectRatio, styleMedia } = props;

  const playingIndex = -1;
  const muted = true;

  let aspectBox = 0;
  switch (className) {
    case 'box_ratio_2_1':
      aspectBox = 2;
      break;
    case 'box_ratio_1_2':
      aspectBox = 0.5;
      break;
    case 'box_ratio_1_1':
      aspectBox = 1;
      break;
    case 'box_ratio_1_3':
      aspectBox = 1 / 3;
      break;
    case 'box_ratio_3_2':
      aspectBox = 3 / 2;
      break;
    case 'box_ratio_1d5p3_2p3':
      aspectBox = 0.75;
      break;
    case 'box_ratio_2p3_1d5p3':
      aspectBox = 1.33333;
      break;
    case 'box_ratio_one_2_3':
      aspectBox = 2 / 3;
      break;
    case 'box_ratio_one_16_9':
      aspectBox = 16 / 9;
      break;
    default:
      aspectBox = 1;
      break;
  }

  const orientationMedia = getImageOrientation(mediaItem?.width, mediaItem?.height);
  const aspectCSS = orientationMedia?.aspect - aspectBox;
  const direction = aspectCSS >= 0 ? 'h100' : 'w100';

  let imgAspect = '';
  if (orientationMedia?.aspect < 1) {
    imgAspect = 'img-portrait';
  }
  if (orientationMedia?.aspect === 1) {
    imgAspect = 'img-square';
  }
  if (orientationMedia?.aspect > 1) {
    imgAspect = 'img-landscape';
  }
  if (orientationMedia?.aspect > 2) {
    imgAspect = 'img-landscape-large';
  }

  const isPlayingVideo = playingIndex === index;
  const clsVideo = isPlayingVideo ? 'hide-thumbnail' : 'show-thumbnail';

  return (
    <div
      className={`${cssClass} ${className || ''} ${imgAspect} ${clsVideo}`}
      style={styleAspectRatio}
    >
      {mediaItem?.type === MEDIA_TYPE.IMAGE && (
        <ImgCdn
          url={mediaItem?.location}
          widthProp={640}
          heightProp={640}
          styleProps={styleMedia}
          className={direction}
        />
      )}
      {mediaItem?.type === MEDIA_TYPE.VIDEO && (
        <>
          <ImgCdn
            url={mediaItem?.thumbnail}
            className={`thumbnail-video ${direction}`}
            widthProp={640}
            heightProp={640}
            styleProps={styleMedia}
          />
          <span className="react-player-mute">{muted ? <IconVolumnOff /> : <IconVolumnOn />}</span>
        </>
      )}
    </div>
  );
};

export default AspectMediaItem;
