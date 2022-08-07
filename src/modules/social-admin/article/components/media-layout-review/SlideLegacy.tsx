import React from 'react';
import getImageOrientation from 'get-image-orientation';
import { some } from 'configs/utils';
import ImageVideoCommon from './ImageVideoGrid';
import { PRIMARY } from 'configs/colors';

const cssClass = 'feed-media-layout-slide-legacy';

interface Props {
  data: some[];
  muted?: boolean;
  playIndex?: number;
  playing?: boolean;
  controls?: boolean;
  widthMobi: number;
  onSlideChange?(e: any): void;
  onSelected?(key: number): void | undefined;
  onEndedVideo?(): void | undefined;
}
const SlideLegacy: React.FC<Props> = props => {
  const { data, onSelected, onEndedVideo, widthMobi } = props;

  const orientationMedia = getImageOrientation(data[0]?.width, data[0]?.height);
  let heightVideo: number = widthMobi;
  let classNameBoxRatio = '';

  if (orientationMedia?.aspect < 1) {
    classNameBoxRatio = 'box_ratio_one_2_3';
    heightVideo = widthMobi / (2 / 3);
  }
  if (orientationMedia?.aspect === 1) {
    classNameBoxRatio = 'box_ratio_one_1_1';
    heightVideo = widthMobi;
  }
  if (orientationMedia?.aspect > 1) {
    classNameBoxRatio = 'box_ratio_one_16_9';
    heightVideo = widthMobi / (16 / 9);
  }
  // extend
  if (orientationMedia?.ratio === '1/1') {
    classNameBoxRatio = 'box_ratio_one_1_1';
    heightVideo = widthMobi;
  }
  // heightVideo = heightVideo > widthMobi ? widthMobi : heightVideo;

  return (
    <div className="feed-media-layout">
      <div className={`${cssClass}`} style={{ width: widthMobi, height: heightVideo }}>
        <ImageVideoCommon
          mediaItem={data && data[0]}
          index={0}
          className={classNameBoxRatio}
          styleAspectRatio={{
            width: widthMobi,
            height: heightVideo,
          }}
          onSelected={onSelected}
          onEndedVideo={onEndedVideo}
        />
      </div>
      {data?.length > 1 && (
        <div className={`${cssClass}-nav-preview`}>
          {data.map((item, key) => (
            <span
              className={`${cssClass}-nav-preview-icon`}
              style={key === 0 ? { background: PRIMARY } : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SlideLegacy;
