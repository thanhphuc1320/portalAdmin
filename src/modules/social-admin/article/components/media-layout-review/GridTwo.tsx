import React from 'react';
import ImageVideoCommon from './ImageVideoGrid';

const cssClass = 'feed-media-layout-grid-two';

interface PropsGrid {
  item0?: any;
  item1?: any;
  widthMobi: number;
  onSelected?(key: number): void | undefined;
  onEndedVideo?(): void | undefined;
}

export const GridTwoA: React.FC<PropsGrid> = props => {
  const { item0, item1, widthMobi, onSelected, onEndedVideo } = props;

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
        <ImageVideoCommon
          mediaItem={item1}
          index={1}
          className="box_ratio_1_2"
          styleAspectRatio={{
            width: widthMobi / 2 - 1,
            height: widthMobi,
          }}
          onSelected={onSelected}
          onEndedVideo={onEndedVideo}
        />
      </div>
    </div>
  );
};

export const GridTwoB: React.FC<PropsGrid> = props => {
  const { item0, item1, widthMobi, onSelected, onEndedVideo } = props;

  return (
    <div className={`${cssClass}-b`}>
      <div className={`${cssClass}-b-col-1`}>
        <ImageVideoCommon
          mediaItem={item0}
          index={0}
          className="box_ratio_2_1"
          styleAspectRatio={{ width: widthMobi, height: widthMobi / 2 }}
          onSelected={onSelected}
          onEndedVideo={onEndedVideo}
        />
      </div>
      <div className={`${cssClass}-b-col-2`}>
        <ImageVideoCommon
          mediaItem={item1}
          index={1}
          className="box_ratio_2_1"
          styleAspectRatio={{
            width: widthMobi,
            height: widthMobi / 2,
            marginTop: 2,
          }}
          onSelected={onSelected}
          onEndedVideo={onEndedVideo}
        />
      </div>
    </div>
  );
};

export const GridTwoC: React.FC<PropsGrid> = props => {
  const { item0, item1, widthMobi, onSelected, onEndedVideo } = props;

  return (
    <div className={`${cssClass}-c`}>
      <div className={`${cssClass}-c-col-1`}>
        <ImageVideoCommon
          mediaItem={item0}
          index={0}
          className="box_ratio_1_1"
          styleAspectRatio={{
            width: widthMobi / 2 - 1,
            height: widthMobi / 2,
          }}
          onSelected={onSelected}
          onEndedVideo={onEndedVideo}
        />
      </div>
      <div className={`${cssClass}-c-col-2`}>
        <ImageVideoCommon
          mediaItem={item1}
          index={1}
          className="box_ratio_1_1"
          styleAspectRatio={{
            width: widthMobi / 2 - 1,
            height: widthMobi / 2,
          }}
          onSelected={onSelected}
          onEndedVideo={onEndedVideo}
        />
      </div>
    </div>
  );
};
