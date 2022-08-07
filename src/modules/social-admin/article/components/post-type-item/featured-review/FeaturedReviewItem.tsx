import React, { useState } from 'react';
import { Avatar, Card, CardHeader, CardContent, IconButton, Typography } from '@material-ui/core';
import { formatDateText } from 'models/moment';
import { ReactComponent as IconDeleteSmall } from 'svg/icon_delete_small.svg';
import { ReactComponent as IconCheckedGreen } from 'svg/icon_checked_green.svg';
import { ReactComponent as IconUnknownUser } from 'svg/unknown_user.svg';
import { truncateWords, countWords } from 'helpers/common';
import { some } from 'configs/utils';
import { getOptionGenerateAvatar } from 'helpers/avatar';

const cssClass = 'post-featured-review-item';

interface Props {
  dataItem: any;
  hotelReviewsSelected?: some[];
  isShowDelete?: boolean;
  selectedList?: some[];
  setSelectedList?(values: some[]): void;
  onDelete?(values: any): void;
}

const FeaturedReviewItem: React.FC<Props> = (props: Props) => {
  const {
    dataItem,
    isShowDelete,
    onDelete,
    selectedList,
    setSelectedList,
    hotelReviewsSelected = [],
  } = props;
  const [checkIds, setCheckIds] = useState<number[]>([]);
  const [isFull, setIsFull] = useState<boolean>(false);

  const optionsAvatar = getOptionGenerateAvatar({
    id: dataItem?.id,
    name: dataItem?.username || 'A D',
    size: 40,
  });

  React.useEffect(() => {
    if (hotelReviewsSelected?.length > 0 && setSelectedList) {
      setCheckIds(hotelReviewsSelected.map(item => item.id));
      setSelectedList([...hotelReviewsSelected]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card
      className={`${cssClass} ${selectedList && 'pointer'}`}
      onClick={() => {
        if (selectedList && setSelectedList) {
          if (!checkIds.find(v => v === dataItem?.id)) {
            setCheckIds([...checkIds, dataItem.id]);
            setSelectedList([...selectedList, dataItem]);
          }
          const indexCheckId = checkIds.indexOf(dataItem?.id);
          if (indexCheckId > -1) {
            checkIds.splice(indexCheckId, 1);
            setCheckIds([...checkIds]);
            selectedList?.splice(indexCheckId, 1);
            setSelectedList([...selectedList]);
          }
        }
      }}
    >
      <CardHeader
        avatar={
          <>
            {dataItem?.avatar && (
              <Avatar src={dataItem?.avatar} style={{ width: 40, height: 40 }} />
            )}
            {dataItem?.id && !dataItem?.avatar && (
              <Avatar
                style={{
                  width: 40,
                  height: 40,
                  fontSize: 16,
                  backgroundColor: optionsAvatar.backgroundColor,
                }}
              >
                {optionsAvatar.letters}
              </Avatar>
            )}
            {!dataItem?.id && <IconUnknownUser style={{ width: 40, height: 40 }} />}
          </>
        }
        title={
          <div className={`${cssClass}-box-title`}>
            <span className={`${cssClass}-name`}>{dataItem?.username || 'Ẩn danh'}</span>
            <span className={`${cssClass}-rating text-primary`}>{dataItem?.rating}/5</span>
          </div>
        }
        subheader={
          <span className={`${cssClass}-time`}>{formatDateText(dataItem?.publishedDate)}</span>
        }
        action={
          <>
            {isShowDelete && (
              <IconButton aria-label="settings" onClick={onDelete}>
                <IconDeleteSmall />
              </IconButton>
            )}
            {checkIds?.includes(dataItem?.id) && <IconCheckedGreen />}
          </>
        }
      />
      <CardContent style={{ padding: '0px 16px 10px 16px', minHeight: 80 }}>
        <Typography variant="subtitle2" style={{ marginBottom: 5 }}>
          {dataItem?.title}
        </Typography>
        <div>
          <Typography variant="caption" style={{ fontSize: 14, marginBottom: 5, marginRight: 5 }}>
            <div
              className={`${cssClass}-content`}
              dangerouslySetInnerHTML={{
                __html: !isFull ? truncateWords(dataItem?.content, 15) : dataItem?.content,
              }}
            />
          </Typography>
          {dataItem?.content && countWords(dataItem?.content) > 15 && !isFull && (
            <Typography
              variant="caption"
              style={{ color: '#899296', fontSize: 14, cursor: 'pointer', marginLeft: 0 }}
              onClick={(e: any) => {
                e.stopPropagation();
                setIsFull(true);
              }}
            >
              Xem thêm
            </Typography>
          )}
          {isFull && (
            <Typography
              variant="caption"
              style={{ color: '#899296', fontSize: 14, cursor: 'pointer', marginLeft: 0 }}
              onClick={(e: any) => {
                e.stopPropagation();
                setIsFull(false);
              }}
            >
              Ẩn bớt
            </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(FeaturedReviewItem);
