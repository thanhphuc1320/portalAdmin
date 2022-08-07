import React, { useCallback } from 'react';
import { MEDIA_LAYOUT } from 'modules/social-admin/constants';
import SlideLegacy from './SlideLegacy';
import { GridTwoA, GridTwoB, GridTwoC } from './GridTwo';
import { GridThreeA, GridThreeB } from './GridThree';
import { GridFourA, GridFourB, GridFourC } from './GridFour';
import { GridFiveA, GridFiveB } from './GridFive';
import { some, isEmpty } from 'configs/utils';

const widthMobi = 375;

interface Props {
  mediaInfos: some[];
  layout: string;
}

const MediaInfos: React.FC<Props> = props => {
  const { mediaInfos, layout } = props;

  const renderMediaLayout = useCallback(() => {
    if (isEmpty(mediaInfos)) {
      return;
    }

    const item0 = (!isEmpty(mediaInfos[0]) && mediaInfos[0]) || {};
    const item1 = (!isEmpty(mediaInfos[1]) && mediaInfos[1]) || {};
    const item2 = (!isEmpty(mediaInfos[2]) && mediaInfos[2]) || {};
    const item3 = (!isEmpty(mediaInfos[3]) && mediaInfos[3]) || {};
    const item4 = (!isEmpty(mediaInfos[4]) && mediaInfos[4]) || {};

    switch (layout) {
      case MEDIA_LAYOUT.GRID_TWO_A:
        return (
          <GridTwoA
            item0={item0}
            item1={item1}
            onSelected={() => {}}
            onEndedVideo={() => {}}
            widthMobi={widthMobi}
          />
        );
      case MEDIA_LAYOUT.GRID_TWO_B:
        return (
          <GridTwoB
            item0={item0}
            item1={item1}
            onSelected={() => {}}
            onEndedVideo={() => {}}
            widthMobi={widthMobi}
          />
        );
      case MEDIA_LAYOUT.GRID_TWO_C:
        return (
          <GridTwoC
            item0={item0}
            item1={item1}
            onSelected={() => {}}
            onEndedVideo={() => {}}
            widthMobi={widthMobi}
          />
        );

      case MEDIA_LAYOUT.GRID_THREE_A:
        return (
          <GridThreeA
            item0={item0}
            item1={item1}
            item2={item2}
            onSelected={() => {}}
            onEndedVideo={() => {}}
            widthMobi={widthMobi}
          />
        );
      case MEDIA_LAYOUT.GRID_THREE_B:
        return (
          <GridThreeB
            item0={item0}
            item1={item1}
            item2={item2}
            onSelected={() => {}}
            onEndedVideo={() => {}}
            widthMobi={widthMobi}
          />
        );

      case MEDIA_LAYOUT.GRID_FOUR_A:
        return (
          <GridFourA
            item0={item0}
            item1={item1}
            item2={item2}
            item3={item3}
            onSelected={() => {}}
            onEndedVideo={() => {}}
            widthMobi={widthMobi}
          />
        );
      case MEDIA_LAYOUT.GRID_FOUR_B:
        return (
          <GridFourB
            item0={item0}
            item1={item1}
            item2={item2}
            item3={item3}
            onSelected={() => {}}
            onEndedVideo={() => {}}
            widthMobi={widthMobi}
          />
        );
      case MEDIA_LAYOUT.GRID_FOUR_C:
        return (
          <GridFourC
            item0={item0}
            item1={item1}
            item2={item2}
            item3={item3}
            onSelected={() => {}}
            onEndedVideo={() => {}}
            widthMobi={widthMobi}
          />
        );

      case MEDIA_LAYOUT.GRID_FIVE_A:
        return (
          <GridFiveA
            item0={item0}
            item1={item1}
            item2={item2}
            item3={item3}
            item4={item4}
            onSelected={() => {}}
            onEndedVideo={() => {}}
            widthMobi={widthMobi}
          />
        );
      case MEDIA_LAYOUT.GRID_FIVE_B:
        return (
          <GridFiveB
            item0={item0}
            item1={item1}
            item2={item2}
            item3={item3}
            item4={item4}
            onSelected={() => {}}
            onEndedVideo={() => {}}
            widthMobi={widthMobi}
          />
        );
      default:
        return (
          <SlideLegacy
            data={mediaInfos}
            onSelected={() => {}}
            onEndedVideo={() => {}}
            widthMobi={widthMobi}
            onSlideChange={() => {}}
          />
        );
    }
  }, [mediaInfos, layout]);

  return (
    <div className="media-layout-reviewer">
      <div className="media-layout-reviewer-wrap-gallery">{renderMediaLayout()}</div>
    </div>
  );
};

export default React.memo(MediaInfos);
