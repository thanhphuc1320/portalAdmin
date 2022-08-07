import React from 'react';
import ImageVideoCommon from './ImageVideoGrid';

const cssClass = 'feed-media-layout-grid-three';

interface PropsGrid {
  item0?: any;
  item1?: any;
  item2?: any;
  widthMobi: number;
  onSelected?(key: number): void | undefined;
  onEndedVideo?(): void | undefined;
}

export const GridThreeA: React.FC<PropsGrid> = props => {
  const { item0, item1, item2, widthMobi, onSelected, onEndedVideo } = props;

  return (
    <div className={`${cssClass}-a`}>
      <div className={`${cssClass}-a-col-1`}>
        <ImageVideoCommon
          mediaItem={item0}
          index={0}
          className="box_ratio_1_2"
          styleAspectRatio={{
            width: widthMobi / 2 - 1,
            height: widthMobi,
          }}
          onSelected={onSelected}
          onEndedVideo={onEndedVideo}
        />
      </div>
      <div className={`${cssClass}-a-col-2`}>
        <div className={`${cssClass}-a-col-2-row-1`}>
          <ImageVideoCommon
            mediaItem={item1}
            index={1}
            className="box_ratio_1_1"
            styleAspectRatio={{
              width: widthMobi / 2 - 1,
              height: widthMobi / 2 - 1,
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
        <div className={`${cssClass}-a-col-2-row-2`}>
          <ImageVideoCommon
            mediaItem={item2}
            index={2}
            className="box_ratio_1_1"
            styleAspectRatio={{
              width: widthMobi / 2 - 1,
              height: widthMobi / 2 - 1,
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
      </div>
    </div>
  );
};

export const GridThreeB: React.FC<PropsGrid> = props => {
  const { item0, item1, item2, widthMobi, onSelected, onEndedVideo } = props;

  return (
    <div className={`${cssClass}-b`}>
      <div className={`${cssClass}-b-col-1`}>
        <ImageVideoCommon
          mediaItem={item0}
          index={0}
          className="box_ratio_2_1"
          styleAspectRatio={{
            width: widthMobi,
            height: widthMobi / 2,
            marginBottom: 3,
          }}
          onSelected={onSelected}
          onEndedVideo={onEndedVideo}
        />
      </div>
      <div className={`${cssClass}-b-col-2`}>
        <div className={`${cssClass}-b-col-2-row-1`}>
          <ImageVideoCommon
            mediaItem={item1}
            index={1}
            className="box_ratio_1_1"
            styleAspectRatio={{
              width: widthMobi / 2 - 1.5,
              height: widthMobi / 2,
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
        <div className={`${cssClass}-b-col-2-row-2`}>
          <ImageVideoCommon
            mediaItem={item2}
            index={2}
            className="box_ratio_1_1"
            styleAspectRatio={{
              width: widthMobi / 2 - 1.5,
              height: widthMobi / 2,
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
      </div>
    </div>
  );
};
