import React, { useState, useCallback, useEffect } from 'react';
import { Grid, Typography, Dialog, DialogTitle, IconButton } from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';
import { isArray } from 'lodash';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { API_PATHS } from 'configs/API';
import { fetchThunk } from 'modules/common/redux/thunk';
import { setNotistackMessage } from 'modules/common/redux/reducer';
import { Row } from 'modules/common/components/elements';
import FeaturedReviewItem from './FeaturedReviewItem';
import LoadingIcon from 'modules/common/components/LoadingIcon';
import LoadingButton from 'modules/common/components/LoadingButton';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import { some, isEmpty } from 'configs/utils';
import { ReactComponent as IconNoSearch } from 'svg/No_Search_Result.svg';
import './style.scss';

const MAX_ITEM = 3;

const SORT_ORDER = {
  HIGHEST_RATING: 'highest_rating',
  LOWEST_RATING: 'lowest_rating',
  NEWEST: 'newest',
  OLDEST: 'oldest',
};

const SORTBY_REVIEWS_HOTEL_OPTIONS = [
  { id: SORT_ORDER.NEWEST, name: 'Mới nhât' },
  { id: SORT_ORDER.OLDEST, name: 'Cũ nhất' },
];

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  setHotelReviews(values: some[]): void;
  hotelReviews: some[];
  hotelId: number;
  caId: number;
}

const FeaturedReviewFormDialog: React.FC<Props> = props => {
  const { setOpen, open, hotelId, caId, hotelReviews, setHotelReviews } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [selectedList, setSelectedList] = useState<some[]>([]);
  const [reviewList, setReviewList] = useState<some[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderBy, setOrderBy] = useState<string>('');

  const fetchHotelReviews = useCallback(
    async (hId: number, order: string) => {
      const params = {
        hotelId: hId,
        sortBy: order || SORT_ORDER.HIGHEST_RATING,
        page: 0,
        size: 200,
      };
      setLoading(true);
      const json = await dispatch(
        fetchThunk(`${API_PATHS.searchHotelReviews}?caId=${caId}`, 'post', JSON.stringify(params)),
      );
      if (json?.code === 200) {
        setReviewList(json?.data?.content || []);
        setLoading(false);
      } else {
        json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
        setLoading(false);
      }
    },
    [dispatch, caId],
  );

  useEffect(() => {
    if (open && hotelId) {
      fetchHotelReviews(hotelId, '');
      setSelectedList([]);
    }
  }, [open, hotelId, fetchHotelReviews]);

  const onAddToPost = () => {
    if (selectedList.length > MAX_ITEM) {
      return dispatch(setNotistackMessage(`Tối đa ${MAX_ITEM} đánh giá nổi bật`, 'warning'));
    }
    setHotelReviews([...selectedList]);
    setSelectedList([]);
    setOpen(false);
  };

  return (
    <Dialog
      className="dialog-post-item-featured-review"
      maxWidth="md"
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogTitle style={{ paddingBottom: 0, paddingTop: 0 }}>
        <IconButton
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            padding: 0,
          }}
          onClick={() => setOpen(false)}
        >
          <IconClose />
        </IconButton>
      </DialogTitle>
      <div style={{ padding: '0px 15px', margin: '0px 15px' }}>
        <Typography
          variant="h6"
          style={{ marginTop: 15, marginBottom: 15, fontWeight: 'bold', textAlign: 'center' }}
        >
          Quản lý đánh giá
        </Typography>

        <Row style={{ marginTop: 10, justifyContent: 'space-between' }}>
          <div style={{ marginBottom: 10 }}>
            <Typography variant="subtitle1">Tất cả đánh giá</Typography>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <FormControlAutoComplete<some>
              placeholder="Tất cả"
              value={null}
              onChange={() => {}}
              options={[
                { id: 5, name: '★★★★★' },
                { id: 4, name: 'Từ ★★★★' },
                { id: 3, name: 'Từ ★★★' },
                { id: 2, name: 'Từ ★★' },
                { id: 1, name: 'Từ ★' },
              ]}
              getOptionLabel={(one: some) => one.name}
              getOptionSelected={(option: some, value: some) => {
                return option?.id === value?.id;
              }}
              optional
              formControlStyle={{ width: 150, minWidth: 'unset', marginRight: 15 }}
              disabled
            />
            <FormControlAutoComplete<some>
              placeholder="Sắp xếp"
              value={SORTBY_REVIEWS_HOTEL_OPTIONS.find((v: some) => v.id === orderBy) || null}
              onChange={(e: any, valueItem: some | null) => {
                setOrderBy(valueItem?.id);
                fetchHotelReviews(hotelId, valueItem?.id);
                setSelectedList([]);
              }}
              options={SORTBY_REVIEWS_HOTEL_OPTIONS}
              getOptionLabel={(one: some) => one.name}
              getOptionSelected={(option: some, value: some) => {
                return option?.id === value?.id;
              }}
              optional
              formControlStyle={{ width: 150, minWidth: 'unset', marginRight: 0 }}
            />
          </div>
        </Row>

        <div
          style={{
            borderRadius: 4,
            marginBottom: 15,
          }}
        >
          <Grid
            container
            className="scrollbar"
            spacing={2}
            style={{
              border: '1px solid #eee',
              borderRadius: 5,
              marginBottom: 20,
              maxHeight: 625,
              overflow: 'auto',
            }}
          >
            {isArray(reviewList) &&
              reviewList?.map((tag: any, index: number) => (
                <Grid key={index} item xs={12} sm={6} className="scrollbar">
                  <FeaturedReviewItem
                    dataItem={tag}
                    hotelReviewsSelected={hotelReviews}
                    selectedList={selectedList}
                    setSelectedList={setSelectedList}
                  />
                </Grid>
              ))}

            {isEmpty(reviewList) && (
              <Row
                style={{
                  minWidth: '40vw',
                  minHeight: 380,
                  justifyContent: 'center',
                }}
              >
                <IconNoSearch />
                {loading && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -70,
                      bottom: 0,
                      right: 20,
                      left: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <LoadingIcon />
                  </div>
                )}
              </Row>
            )}
          </Grid>

          <Row style={{ marginTop: 10, justifyContent: 'space-between' }}>
            <div>
              <Typography variant="body2">Tối đa 3 bình luận</Typography>
            </div>
            <div>
              <LoadingButton
                variant="outlined"
                color="primary"
                size="large"
                style={{ minWidth: 70, marginRight: 20 }}
                disableElevation
                loading={false}
                onClick={() => setOpen(false)}
              >
                Hủy
              </LoadingButton>

              <LoadingButton
                variant="contained"
                size="large"
                style={{ minWidth: 140 }}
                color="primary"
                onClick={onAddToPost}
                disableElevation
                disabled={isEmpty(selectedList)}
              >
                Thêm vào bài viết
              </LoadingButton>
            </div>
          </Row>
        </div>
      </div>
    </Dialog>
  );
};

export default React.memo(FeaturedReviewFormDialog);
