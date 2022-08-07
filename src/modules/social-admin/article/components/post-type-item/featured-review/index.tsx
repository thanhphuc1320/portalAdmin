import React, { useState, useCallback } from 'react';
import { Grid, Paper, Typography, Button, ButtonBase, Divider } from '@material-ui/core';
import { isArray } from 'lodash';
import { useFormikContext } from 'formik';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { setNotistackMessage } from 'modules/common/redux/reducer';
import { Row } from 'modules/common/components/elements';
import { GREY_100, GREY_300, GREY_400, RED } from 'configs/colors';
import { ReactComponent as IconArrowRight } from 'svg/arrow_right_2.svg';
import { ReactComponent as IconComponentAdd } from 'svg/component_add.svg';
import { isEmpty, some } from 'configs/utils';
import { PRIMARY } from 'configs/colors';
import FeaturedReviewFormDialog from './FormDialog';
import FeaturedReviewItem from './FeaturedReviewItem';
import './style.scss';

const MAX_LIST = 3;

interface Props {}

const ArticleItemFeaturedReview: React.FC<Props> = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { setFieldValue, values } = useFormikContext();

  const [open, setOpen] = useState<boolean>(false);
  const hotelReviews = (values as any).hotelReviews || [];
  const hotelId = (values as any).hotelId;
  const caId = (values as any).caId;

  const onDelete = useCallback(
    (item: any | undefined) => {
      const tagListNew = hotelReviews?.filter(t => t.id !== item?.id);
      setFieldValue('hotelReviews', [...tagListNew], true);
    },
    [hotelReviews, setFieldValue],
  );

  return (
    <Paper className="pager-section-form post-featured-review">
      <Grid container style={{ paddingTop: 10 }}>
        <Grid item xs={7}>
          <Row>
            <Typography variant="subtitle1">Thêm đánh giá nổi bật</Typography>
            <Typography variant="body2" style={{ color: GREY_400, marginLeft: 7 }}>
              (Tối đa 3 đánh giá nổi bật)
            </Typography>
          </Row>
        </Grid>
        <Grid item xs={5}>
          <Row style={{ justifyContent: 'flex-end' }}>
            <Button
              onClick={() => {
                if (isEmpty(hotelId)) {
                  return dispatch(
                    setNotistackMessage(
                      'Bạn cần lựa chọn khách sạn trước khi tiếp tục!',
                      'warning',
                    ),
                  );
                }
                setOpen(true);
              }}
            >
              <Typography variant="body1" style={{ color: PRIMARY }}>
                Tất cả đánh giá
              </Typography>
              <IconArrowRight style={{ marginLeft: 10 }} />
            </Button>
          </Row>
        </Grid>
      </Grid>
      <Divider
        style={{
          borderTop: `1px dashed ${GREY_300}`,
          marginBottom: 20,
          backgroundColor: 'unset',
        }}
      />
      <Grid container spacing={2}>
        {isArray(hotelReviews) &&
          hotelReviews?.map((tag: any, index: number) => (
            <Grid key={index} item xs={12} sm={4}>
              <FeaturedReviewItem dataItem={tag} onDelete={() => onDelete(tag)} isShowDelete />
            </Grid>
          ))}
        {isEmpty(hotelReviews) && (
          <Grid item xs={12} sm={12}>
            <ButtonBase
              style={{
                background: GREY_100,
                border: `1px dashed ${GREY_400}`,
                boxSizing: 'border-box',
                borderRadius: 4,
                width: 200,
                height: 160,
                display: 'flex',
                marginTop: 4,
              }}
              onClick={() => {
                if (isEmpty(hotelId)) {
                  return dispatch(
                    setNotistackMessage(
                      'Bạn cần lựa chọn khách sạn trước khi tiếp tục!',
                      'warning',
                    ),
                  );
                }
                setOpen(true);
              }}
            >
              <Typography
                variant="body2"
                style={{
                  color: GREY_400,
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <IconComponentAdd width={48} stroke={GREY_400} />
              </Typography>
            </ButtonBase>
          </Grid>
        )}
      </Grid>

      <Row style={{ marginTop: 10 }}>
        {hotelReviews?.length > MAX_LIST && (
          <Typography variant="body2" style={{ color: RED, fontWeight: 'bold' }}>
            Tối đa {MAX_LIST} đánh giá nổi bật!
          </Typography>
        )}
      </Row>
      <FeaturedReviewFormDialog
        open={open}
        setOpen={setOpen}
        hotelId={hotelId}
        caId={caId}
        hotelReviews={hotelReviews}
        setHotelReviews={(list: some[]) => {
          setFieldValue('hotelReviews', [...list], true);
        }}
      />
    </Paper>
  );
};

export default ArticleItemFeaturedReview;
