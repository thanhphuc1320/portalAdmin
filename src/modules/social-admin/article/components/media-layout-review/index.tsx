import React, { useCallback } from 'react';
import { Typography, IconButton } from '@material-ui/core';
import { isArray } from 'lodash';
import LayoutReview from './LayoutReview';
import { ReactComponent as IconLayoutSlideLegacy } from 'svg/medialayout/icon_layout_slide.svg';
import { ReactComponent as IconLayoutSlideLegacyActive } from 'svg/medialayout/icon_layout_slide_active.svg';
import { ReactComponent as IconLayout2A } from 'svg/medialayout/2a.svg';
import { ReactComponent as IconLayout2AActive } from 'svg/medialayout/2a_active.svg';
import { ReactComponent as IconLayout2B } from 'svg/medialayout/2b.svg';
import { ReactComponent as IconLayout2BActive } from 'svg/medialayout/2b_active.svg';
import { ReactComponent as IconLayout2C } from 'svg/medialayout/2c.svg';
import { ReactComponent as IconLayout2CActive } from 'svg/medialayout/2c_active.svg';

import { ReactComponent as IconLayout3A } from 'svg/medialayout/3a.svg';
import { ReactComponent as IconLayout3AActive } from 'svg/medialayout/3a_active.svg';
import { ReactComponent as IconLayout3B } from 'svg/medialayout/3b.svg';
import { ReactComponent as IconLayout3BActive } from 'svg/medialayout/3b_active.svg';
import { ReactComponent as IconLayout4A } from 'svg/medialayout/4a.svg';
import { ReactComponent as IconLayout4AActive } from 'svg/medialayout/4a_active.svg';
import { ReactComponent as IconLayout4B } from 'svg/medialayout/4b.svg';
import { ReactComponent as IconLayout4BActive } from 'svg/medialayout/4b_active.svg';
import { ReactComponent as IconLayout4C } from 'svg/medialayout/4c.svg';
import { ReactComponent as IconLayout4CActive } from 'svg/medialayout/4c_active.svg';
import { ReactComponent as IconLayout5A } from 'svg/medialayout/5a.svg';
import { ReactComponent as IconLayout5AActive } from 'svg/medialayout/5a_active.svg';
import { ReactComponent as IconLayout5B } from 'svg/medialayout/5b.svg';
import { ReactComponent as IconLayout5BActive } from 'svg/medialayout/5b_active.svg';
import { MEDIA_LAYOUT } from 'modules/social-admin/constants';
import { some, isEmpty } from 'configs/utils';

import './style.scss';

export const MEDIA_LAYOUT_LIST = [
  {
    id: 'GRID_TWO_A',
    quantity: 2,
    component: <IconLayout2A />,
    componentActive: <IconLayout2AActive />,
  },
  {
    id: 'GRID_TWO_B',
    quantity: 2,
    component: <IconLayout2B />,
    componentActive: <IconLayout2BActive />,
  },
  {
    id: 'GRID_TWO_C',
    quantity: 2,
    component: <IconLayout2C />,
    componentActive: <IconLayout2CActive />,
  },
  {
    id: 'GRID_THREE_A',
    quantity: 3,
    component: <IconLayout3A />,
    componentActive: <IconLayout3AActive />,
  },
  {
    id: 'GRID_THREE_B',
    quantity: 3,
    component: <IconLayout3B />,
    componentActive: <IconLayout3BActive />,
  },
  {
    id: 'GRID_FOUR_A',
    quantity: 4,
    component: <IconLayout4A />,
    componentActive: <IconLayout4AActive />,
  },
  {
    id: 'GRID_FOUR_B',
    quantity: 4,
    component: <IconLayout4B />,
    componentActive: <IconLayout4BActive />,
  },
  {
    id: 'GRID_FOUR_C',
    quantity: 4,
    component: <IconLayout4C />,
    componentActive: <IconLayout4CActive />,
  },
  {
    id: 'GRID_FIVE_A',
    quantity: 5,
    component: <IconLayout5A />,
    componentActive: <IconLayout5AActive />,
  },
  {
    id: 'GRID_FIVE_B',
    quantity: 5,
    component: <IconLayout5B />,
    componentActive: <IconLayout5BActive />,
  },
];

interface Props {
  mediaList: some[];
  layout: string;
  onSelectedLayout(layout: string): void;
}

const HeaderLayoutReview: React.FC<Props> = props => {
  const { mediaList, layout, onSelectedLayout } = props;

  const getButtonsLayout = useCallback(() => {
    if (isEmpty(mediaList) || !isArray(mediaList)) {
      return [];
    }
    return MEDIA_LAYOUT_LIST?.filter(l => l?.quantity === mediaList?.length);
  }, [mediaList]);

  const iconList = getButtonsLayout();

  return (
    <div className="article-media-layout">
      <div className="article-media-layout-head">
        <div className="article-media-layout-head-title">
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>
            Chọn bố cục hiển thị
          </Typography>
        </div>
        <div className="article-media-layout-head-group-icon">
          {iconList &&
            iconList.map((item: any, index: number) => (
              <IconButton key={index} style={{}} onClick={() => onSelectedLayout(item?.id)}>
                {layout === item?.id ? item?.componentActive : item?.component}
              </IconButton>
            ))}
          <IconButton
            key={'SLIDE_LEGACY'}
            style={{}}
            onClick={() => onSelectedLayout(MEDIA_LAYOUT.SLIDE_LEGACY)}
          >
            {layout === MEDIA_LAYOUT.SLIDE_LEGACY ? (
              <IconLayoutSlideLegacyActive />
            ) : (
              <IconLayoutSlideLegacy />
            )}
          </IconButton>
        </div>
      </div>
      <div className="article-media-layout-body">
        <LayoutReview mediaInfos={mediaList} layout={layout} />
      </div>
    </div>
  );
};

export default React.memo(HeaderLayoutReview);
