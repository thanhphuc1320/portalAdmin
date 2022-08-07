import React from 'react';
import ImageVideoCommon from './ImageVideoGrid';

const cssClass = 'feed-media-layout-grid-four';

interface PropsGrid {
  item0?: any;
  item1?: any;
  item2?: any;
  item3?: any;
  widthMobi: number;
  onSelected?(key: number): void | undefined;
  onEndedVideo?(): void | undefined;
}

export const GridFourA: React.FC<PropsGrid> = props => {
  const { item0, item1, item2, item3, widthMobi, onSelected, onEndedVideo } = props;

  return (
    <div className={`${cssClass}-a`}>
      <div className={`${cssClass}-a-col-1`}>
        <ImageVideoCommon
          mediaItem={item0}
          index={0}
          className="box_ratio_2_3"
          styleAspectRatio={{
            width: widthMobi * (2 / 3) - 1,
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
              width: widthMobi * (1 / 3) - 1,
              height: widthMobi * (1 / 3) - 1.5,
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
              width: widthMobi * (1 / 3) - 1,
              height: widthMobi * (1 / 3) - 1.5,
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
        <div className={`${cssClass}-a-col-2-row-3`}>
          <ImageVideoCommon
            mediaItem={item3}
            index={3}
            className="box_ratio_1_1"
            styleAspectRatio={{
              width: widthMobi * (1 / 3) - 1,
              height: widthMobi * (1 / 3) - 1.5,
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
      </div>
    </div>
  );
};

export const GridFourB: React.FC<PropsGrid> = props => {
  const { item0, item1, item2, item3, widthMobi, onSelected, onEndedVideo } = props;

  return (
    <div className={`${cssClass}-b`}>
      <div className={`${cssClass}-b-col-1`}>
        <ImageVideoCommon
          mediaItem={item0}
          index={0}
          className="box_ratio_3_2"
          styleAspectRatio={{
            width: widthMobi,
            height: widthMobi * (2 / 3),
            marginBottom: 2,
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
              width: widthMobi * (1 / 3) - 1.5,
              height: widthMobi * (1 / 3),
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
              width: widthMobi * (1 / 3) - 1,
              height: widthMobi * (1 / 3),
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
        <div className={`${cssClass}-b-col-2-row-3`}>
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
      </div>
    </div>
  );
};

export const GridFourC: React.FC<PropsGrid> = props => {
  const { item0, item1, item2, item3, widthMobi, onSelected, onEndedVideo } = props;

  return (
    <div className={`${cssClass}-c`}>
      <div className={`${cssClass}-c-col-1`}>
        <div className={`${cssClass}-c-col-1-row-1`}>
          <ImageVideoCommon
            mediaItem={item0}
            index={0}
            className="box_ratio_1_1"
            styleAspectRatio={{
              width: widthMobi * (1 / 2) - 1.5,
              height: widthMobi * (1 / 2),
              marginBottom: 3,
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
        <div className={`${cssClass}-c-col-1-row-2`}>
          <ImageVideoCommon
            mediaItem={item1}
            index={1}
            className="box_ratio_1_1"
            styleAspectRatio={{
              width: widthMobi * (1 / 2) - 1.5,
              height: widthMobi * (1 / 2),
              marginBottom: 3,
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
      </div>
      <div className={`${cssClass}-c-col-2`}>
        <div className={`${cssClass}-c-col-2-row-1`}>
          <ImageVideoCommon
            mediaItem={item2}
            index={2}
            className="box_ratio_1_1"
            styleAspectRatio={{
              width: widthMobi * (1 / 2) - 1.5,
              height: widthMobi * (1 / 2),
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
        <div className={`${cssClass}-c-col-2-row-2`}>
          <ImageVideoCommon
            mediaItem={item3}
            index={3}
            className="box_ratio_1_1"
            styleAspectRatio={{
              width: widthMobi * (1 / 2) - 1.5,
              height: widthMobi * (1 / 2),
            }}
            onSelected={onSelected}
            onEndedVideo={onEndedVideo}
          />
        </div>
      </div>
    </div>
  );
};
