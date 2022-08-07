import React from 'react';
import ImageVideoCommon from './ImageVideoGrid';

const cssClass = 'feed-media-layout-grid-five';

interface PropsGrid {
  item0?: any;
  item1?: any;
  item2?: any;
  item3?: any;
  item4?: any;
  widthMobi: number;
  onSelected?(key: number): void | undefined;
  onEndedVideo?(): void | undefined;
}

export const GridFiveA: React.FC<PropsGrid> = props => {
  const { item0, item1, item2, item3, item4, widthMobi, onSelected, onEndedVideo } = props;

  return (
    <div className={`${cssClass}-a`}>
      <div className={`${cssClass}-a-row-1`}>
        <div className={`${cssClass}-a-row-1-col-1`}>
          <ImageVideoCommon
            mediaItem={item0}
            index={0}
            className="box_ratio_1d5p3_2p3"
            styleAspectRatio={{
              width: widthMobi * (1.5 / 3) - 1.5,
              height: widthMobi * (2 / 3),
              marginBottom: 2,
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
        <div className={`${cssClass}-a-row-1-col-2`}>
          <ImageVideoCommon
            mediaItem={item1}
            index={1}
            className="box_ratio_1d5p3_2p3"
            styleAspectRatio={{
              width: widthMobi * (1.5 / 3) - 1.5,
              height: widthMobi * (2 / 3),
              marginBottom: 2,
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
      </div>
      <div className={`${cssClass}-a-row-2`}>
        <div className={`${cssClass}-a-row-2-col-1`}>
          <ImageVideoCommon
            mediaItem={item2}
            index={2}
            className="box_ratio_1_1"
            styleAspectRatio={{
              width: widthMobi * (1 / 3) - 1.5,
              height: widthMobi * (1 / 3),
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
        <div className={`${cssClass}-a-row-2-col-2`}>
          <ImageVideoCommon
            mediaItem={item3}
            index={3}
            className="box_ratio_1_1"
            styleAspectRatio={{
              width: widthMobi * (1 / 3) - 1.5,
              height: widthMobi * (1 / 3),
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
        <div className={`${cssClass}-a-row-2-col-3`}>
          <ImageVideoCommon
            mediaItem={item4}
            index={4}
            className="box_ratio_1_1"
            styleAspectRatio={{
              width: widthMobi * (1 / 3) - 1.5,
              height: widthMobi * (1 / 3),
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
      </div>
    </div>
  );
};

export const GridFiveB: React.FC<PropsGrid> = props => {
  const { item0, item1, item2, item3, item4, widthMobi, onSelected, onEndedVideo } = props;

  return (
    <div className={`${cssClass}-b`}>
      <div className={`${cssClass}-b-col-1`}>
        <div className={`${cssClass}-b-col-1-row-1`}>
          <ImageVideoCommon
            mediaItem={item0}
            index={0}
            className="box_ratio_2p3_1d5p3"
            styleAspectRatio={{
              width: widthMobi * (2 / 3) - 1.5,
              height: widthMobi * (1.5 / 3),
              marginBottom: 3,
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
        <div className={`${cssClass}-b-col-1-row-2`}>
          <ImageVideoCommon
            mediaItem={item1}
            index={1}
            className="box_ratio_2p3_1d5p3"
            styleAspectRatio={{
              width: widthMobi * (2 / 3) - 1.5,
              height: widthMobi * (1.5 / 3),
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
      </div>
      <div className={`${cssClass}-b-col-2`}>
        <div className={`${cssClass}-b-col-2-row-1`}>
          <ImageVideoCommon
            mediaItem={item2}
            index={2}
            className="box_ratio_1_1"
            styleAspectRatio={{
              width: widthMobi * (1 / 3) - 1.5,
              height: widthMobi * (1 / 3),
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
        <div className={`${cssClass}-b-col-2-row-2`}>
          <ImageVideoCommon
            mediaItem={item3}
            index={3}
            className="box_ratio_1_1"
            styleAspectRatio={{
              width: widthMobi * (1 / 3) - 1.5,
              height: widthMobi * (1 / 3),
              marginTop: 2,
              marginBottom: 2,
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
        <div className={`${cssClass}-b-col-2-row-3`}>
          <ImageVideoCommon
            mediaItem={item4}
            index={4}
            className="box_ratio_1_1"
            styleAspectRatio={{
              width: widthMobi * (1 / 3) - 1.5,
              height: widthMobi * (1 / 3) - 1,
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
      </div>
    </div>
  );
};
