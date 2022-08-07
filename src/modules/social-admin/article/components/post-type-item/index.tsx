import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Paper, Typography, Divider, Button, Tooltip } from '@material-ui/core';
import { useFormikContext } from 'formik';
import moment, { Moment } from 'moment';
import qs from 'query-string';
import { isArray, debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { API_PATHS } from 'configs/API';

import { fetchThunk } from 'modules/common/redux/thunk';
import { setNotistackMessage } from 'modules/common/redux/reducer';
import { Row } from 'modules/common/components/elements';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import { FieldDateRangeFormControl } from 'modules/common/components/FieldContent';
import FormControlTextField from 'modules/common/components/FormControlTextField';
import DndPhotos from 'modules/common/components/DndPhotos';
import ButtonPhotos from 'modules/common/components/DndPhotos/ButtonPhotos';
import ButtonPhotosLoading from 'modules/common/components/DndPhotos/ButtonPhotosLoading';
import LoadingBox from 'modules/common/components/LoadingBox';
import { DATE_FORMAT_BACK_END, DATE_FORMAT_TIMEZONE } from 'models/moment';
import { SERVICE_TYPE } from 'modules/social-admin/constants';
import { CA_ID_INFO } from 'modules/auth/constants';
import { STATUS_UPLOAD_VIDEO } from 'constants/common';
import { isEmpty, some } from 'configs/utils';
import { GREY_400, GREY_300, PRIMARY, RED } from 'configs/colors';

import Tags from './tags';
import FeaturedReview from './featured-review';
import MediaDialog from './item-media-manager/MediaDialog';
import RelatedPosts from './RelatedPosts';

import { ReactComponent as IconArrowRight } from 'svg/arrow_right_2.svg';
import './style.scss';

const CA_ID_DEFAULT = CA_ID_INFO.TRIPI_PARTNER;
const WATERMARK_CAID_NONE = -1;
const ACTIONS = [
  { id: 'BOOK_NOW', name: 'Đặt ngay' },
  { id: 'READ_MORE', name: 'Xem thêm' },
];

const areaList = [{ id: SERVICE_TYPE.HOTEL, name: 'Khách sạn' }];

const cssClass = 'PostTypeItem';

interface Props {
  caIdList: some[];
  listMedias: some[];
  hotelItem: any;
  hotelList: some[];
  setHotelList(value: some[]): void;
}

const PostTypeItem: React.FC<Props> = (props: Props) => {
  const { caIdList, listMedias, hotelItem, setHotelList } = props;
  const { setFieldValue, values, errors, setErrors, submitCount } = useFormikContext();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const location = useLocation();
  const [hotelOptions, setHotelOptions] = useState<some[]>([]);
  const [showMedia, setShowMedia] = useState<boolean>(false);
  const [numberMediaBefore, setNumberMediaBefore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUploadLink, setLoadingUploadLink] = useState<boolean>(false);

  const postId = (location as any)?.query?.postId;
  const isUpdated = Number(postId) > 0;
  const qHotelId = (location as any)?.query?.hotelId;
  const queryHotelId = qHotelId && Number(qHotelId);
  const errorsPost = (errors as any) || {};
  const valuesPost = (values as any) || {};
  const caId = valuesPost?.caId;
  const hotelTagsForm = valuesPost?.hotelTags;

  const fetchHotelReviewsCount = useCallback(
    async (hId: number) => {
      const params = {
        hotelId: hId,
        sortBy: 'newest',
        page: 0,
        size: 100,
      };
      const json = await dispatch(
        fetchThunk(`${API_PATHS.searchHotelReviews}`, 'post', JSON.stringify(params)),
      );
      if (json?.code === 200) {
        const reviewsOriginTotal = isArray(json?.data?.content) ? json?.data?.content?.length : 0;
        setFieldValue('hotelReviewsOriginTotal', reviewsOriginTotal);
      } else {
        json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
      }
    },
    [dispatch, setFieldValue],
  );

  const updateHotelTags = useCallback(
    async (hotelInfo: any, tagsForm: some[]) => {
      if (!isEmpty(hotelInfo?.tagItems) && !isEmpty(tagsForm)) {
        let hotelTagsFormNew = tagsForm;
        hotelTagsFormNew.map((pt: any, index: number) => {
          const tagItem = hotelInfo?.tagItems?.find(vt => vt.code === pt.code);
          if (!isEmpty(tagItem)) {
            hotelTagsFormNew[index].value = tagItem?.value;
          }
          return hotelTagsFormNew[index];
        });
        setFieldValue('hotelTags', hotelTagsFormNew);
      }
    },
    [setFieldValue],
  );

  const onChangeHotel = useCallback(
    async (hotelInfo: any, tagsForm: some[]) => {
      const tempHotelList = hotelInfo ? [hotelInfo] : [];
      setHotelList(tempHotelList);
      setFieldValue('hotelId', hotelInfo?.id);
      setFieldValue('hotelName', hotelInfo?.name);
      setFieldValue('hotelOriginPrice', hotelInfo?.originPrice);
      setFieldValue('hotelReviews', []);

      fetchHotelReviewsCount(hotelInfo?.id);

      if (!(hotelInfo?.originPrice > 0)) {
        setFieldValue('hotelPriceIsNull', true);
      }
      if (!isEmpty(tagsForm)) {
        updateHotelTags(hotelInfo, tagsForm);
      }
    },
    [setFieldValue, updateHotelTags, setHotelList, fetchHotelReviewsCount],
  );

  const fetchHotelsName = useCallback(
    async (value: any) => {
      let json: any = {};
      if (!queryHotelId && Number(value.caId) > 0) {
        const paramsSearchHotelsName = {
          caId: Number(value.caId),
          term: 'a',
          checkIn: value?.checkIn,
          checkOut: value?.checkOut,
        };
        json = await dispatch(
          fetchThunk(`${API_PATHS.searchHotelsName}?${qs.stringify(paramsSearchHotelsName)}`),
        );
      }

      if (json?.data) {
        const tempHotels = json.data || [];
        setHotelOptions(tempHotels);
      } else {
        json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
      }
    },
    [dispatch, queryHotelId],
  );

  const fetchHotelsByHotelId = useCallback(
    async (id: number, params: any) => {
      if (!id) {
        return;
      }
      setLoading(true);
      const paramsSearchHotels = {
        isFirstRequest: true,
        firstRequest: true,
        hotelIds: [id],
        checkIn: params?.checkIn,
        checkOut: params?.checkOut,
        rooms: 1,
        adults: 2,
        children: 0,
        childrenAges: [],
        page: 0,
        size: 10,
        sortBy: 'price-',
      };
      const json = await dispatch(
        fetchThunk(
          `${API_PATHS.searchHotels}?caId=${params?.caId}`,
          'post',
          JSON.stringify(paramsSearchHotels),
        ),
      );

      if (json?.data) {
        const tempHotels = json.data || [];
        setHotelOptions(tempHotels);
        if (id > 0 && !isEmpty(tempHotels[0])) {
          const hotelInfoById = tempHotels[0];
          onChangeHotel(hotelInfoById, params.tagsSetting);
        }
        setLoading(false);
      } else {
        setLoading(false);
        json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
      }
    },
    [dispatch, onChangeHotel],
  );

  const getApplicationSettings = useCallback(async () => {
    setLoading(true);
    const json = await dispatch(
      fetchThunk(`${API_PATHS.getAdminApplicationSettings}?key=hotel_tags`, 'get'),
    );
    if (json?.code === 200) {
      const appliSettings = json?.data?.content || [];
      const tempTags =
        !isEmpty(appliSettings[0]) &&
        !isEmpty(appliSettings[0]?.value) &&
        JSON.parse(appliSettings[0]?.value);
      setFieldValue('hotelTags', tempTags);

      const beginAt = moment().add(2, 'days');
      const endAt = moment().add(4, 'days');
      const initCheckIn = beginAt.format(DATE_FORMAT_BACK_END);
      const initCheckOut = endAt.format(DATE_FORMAT_BACK_END);
      setFieldValue('checkIn', initCheckIn);
      setFieldValue('checkOut', initCheckOut);
      setFieldValue('checkInAt', beginAt.format(DATE_FORMAT_TIMEZONE));
      setFieldValue('checkOutAt', endAt.format(DATE_FORMAT_TIMEZONE));

      if (queryHotelId > 0) {
        setFieldValue('caId', CA_ID_DEFAULT);
        const params = {
          checkIn: initCheckIn,
          checkOut: initCheckOut,
          caId: CA_ID_DEFAULT,
          tagsSetting: tempTags,
        };
        fetchHotelsByHotelId(queryHotelId, params);
      }
      setLoading(false);
    } else {
      setLoading(false);
      json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
    }
  }, [dispatch, setFieldValue, fetchHotelsByHotelId, queryHotelId]);

  const onLoadCreateArticle = useCallback(() => {
    if (!isUpdated) {
      getApplicationSettings();
    }
  }, [isUpdated, getApplicationSettings]);

  useEffect(() => {
    onLoadCreateArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isUpdated && !isEmpty(hotelItem)) {
      setFieldValue('hotelId', hotelItem?.id);
      setFieldValue('hotelName', hotelItem?.name);
      setFieldValue('hotelOriginPrice', hotelItem?.originPrice);
      setFieldValue('hotelAction', hotelItem?.action);
      setFieldValue('hotelTags', hotelItem?.tagItems);
      setFieldValue('hotelReviews', hotelItem?.reviews);
      setFieldValue('hotelPostIds', hotelItem?.postIds);
      setFieldValue('postIdsItem', hotelItem?.postIds);
      fetchHotelReviewsCount(hotelItem?.id);
      if (hotelItem?.checkInAt && hotelItem?.checkOutAt) {
        const beginAt = moment(hotelItem?.checkInAt);
        const endAt = moment(hotelItem?.checkOutAt);
        setFieldValue('checkIn', beginAt.format(DATE_FORMAT_BACK_END));
        setFieldValue('checkOut', endAt.format(DATE_FORMAT_BACK_END));
        // DB
        setFieldValue('checkInAt', beginAt.format(DATE_FORMAT_TIMEZONE));
        setFieldValue('checkOutAt', endAt.format(DATE_FORMAT_TIMEZONE));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdated, hotelItem, listMedias, setFieldValue]);

  useEffect(() => {
    setFieldValue('hotelImageItem', !isEmpty(listMedias) && listMedias[0]);
    setFieldValue('hotelVideoItem', !isEmpty(listMedias) && listMedias[1]);
  }, [listMedias, setFieldValue]);

  const outsideRange = (e: Moment, start?: Moment) =>
    start
      ? start.startOf('day').isAfter(e)
      : moment()
          .startOf('day')
          .isAfter(e);

  const searchHotelsName = useCallback(
    async (str: string) => {
      const params = {
        caId: caId,
        term: str ? str?.trimLeft() : 'a',
        checkIn: valuesPost?.checkIn,
        checkOut: valuesPost?.checkOut,
        size: 20,
      };
      const json =
        caId &&
        (await dispatch(fetchThunk(`${API_PATHS.searchHotelsName}?${qs.stringify(params)}`)));
      return json?.data || [];
    },
    [dispatch, caId, valuesPost],
  );

  const getUploadVideoStatusV2 = useCallback(
    debounce(async (id: string) => {
      const json = await dispatch(fetchThunk(`${API_PATHS.uploadVideoStatusV2}?id=${id}`, 'get'));
      if (json?.code === 200) {
        if (json?.data?.status === STATUS_UPLOAD_VIDEO.COMPLETE) {
          setFieldValue('hotelVideoItem', json?.data, true);
          setLoadingUploadLink(false);
        } else {
          getUploadVideoStatusV2(id);
        }
      } else {
        setLoadingUploadLink(false);
        json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
      }
    }, 2500),
    [dispatch, setFieldValue, setLoadingUploadLink],
  );

  const handlUploadLinkVideo = useCallback(
    async (videoHotel: any) => {
      const dataFXt = moment()
        .add(3, 'minute')
        .toISOString();
      const dataVideoHotel = {
        link: videoHotel?.url,
        expiredAt: dataFXt,
        watermarkCaId: WATERMARK_CAID_NONE,
      };

      setLoadingUploadLink(true);
      const json = await dispatch(
        fetchThunk(API_PATHS.uploadViaLinkVideoV2, 'post', JSON.stringify(dataVideoHotel)),
      );
      if (json?.code === 200) {
        const videoUid = json?.data?.result?.uid;
        if (videoUid) {
          getUploadVideoStatusV2(videoUid);
        } else {
          setLoadingUploadLink(false);
          dispatch(setNotistackMessage('Video uid không tồn tại!', 'error'));
        }
      } else {
        setLoadingUploadLink(false);
        json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
      }
    },
    [dispatch, getUploadVideoStatusV2, setLoadingUploadLink],
  );

  const resetByCaId = useCallback(() => {
    setFieldValue('hotelId', undefined);
    setFieldValue('hotelName', undefined);
    setFieldValue('hotelOriginPrice', 0);
    setFieldValue('hotelReviews', undefined);
    setFieldValue('hotelReviewsOriginTotal', 0);
    setFieldValue('hotelPostIds', undefined);
    setFieldValue('postIdsItem', []);
  }, [setFieldValue]);

  return (
    <div className={`${cssClass}-wrapper`}>
      <Paper className="pager-section-form">
        <Typography variant="subtitle2" style={{ margin: '10px 0px' }}>
          Chọn kênh chia sẻ
        </Typography>
        <FormControlAutoComplete<some>
          value={caIdList.find((v: some) => v.id === valuesPost?.caId) || null}
          formControlStyle={{ width: 200 }}
          placeholder="Chọn kênh chia sẻ"
          onChange={(e: any, value: some | null) => {
            fetchHotelsName({ caId: value?.id });
            setFieldValue('caId', value?.id, true);
            resetByCaId();
          }}
          options={caIdList as some[]}
          getOptionLabel={(one: some) => one.name}
          optional
          errorMessage={errorsPost.caId && String(errorsPost.caId)}
          disabled={
            !!postId ||
            !isEmpty(valuesPost?.hotelImageItem) ||
            !isEmpty(valuesPost?.hotelVideoItem) ||
            numberMediaBefore > 0
          }
        />
      </Paper>

      <Paper className="pager-section-form">
        <Row style={{ margin: '10px 0px' }}>
          <Typography variant="subtitle2">Phân loại item</Typography>
        </Row>

        <Grid container spacing={1}>
          <Grid item xs={6} sm={2}>
            <FormControlAutoComplete
              id="serviceType"
              value={areaList.find((v: some) => v.id === SERVICE_TYPE.HOTEL) || null}
              formControlStyle={{ width: '100%' }}
              placeholder="Loại dịch vụ"
              onChange={(e: any, value: some | null) => {
                setFieldValue('serviceType', value?.serviceType, true);
              }}
              options={areaList as some[]}
              getOptionLabel={(one: some) => one.name}
              optional
              disabled={isUpdated || !caId || queryHotelId > 0}
            />
          </Grid>

          <Grid item xs={6} sm={4}>
            <FormControlAutoComplete
              value={
                valuesPost?.hotelId
                  ? { id: valuesPost?.hotelId, name: valuesPost?.hotelName }
                  : null
              }
              formControlStyle={{ width: '100%' }}
              placeholder="Chọn khách sạn"
              onChange={(e: any, value: any | null) => {
                onChangeHotel(value, hotelTagsForm);
              }}
              loadOptions={searchHotelsName}
              initOptions={hotelOptions}
              options={[]}
              getOptionLabel={(one: some) => one.name}
              optional
              typeSearch="hotelItem"
              disabled={isUpdated || !caId || (queryHotelId > 0 && valuesPost?.hotelId > 0)}
              errorMessage={
                !valuesPost?.hotelId && errorsPost.hotelId && String(errorsPost.hotelId)
              }
            />
          </Grid>

          <Grid item xs={6} sm={2}>
            <FieldDateRangeFormControl
              isOutsideRange={outsideRange}
              name="hotelItemCheckIn"
              placeholder="Chọn ngày check in/check out"
              style={{ minWidth: 100, marginRight: 0 }}
              optional
              startDate={
                valuesPost?.checkIn &&
                moment(valuesPost?.checkIn, DATE_FORMAT_BACK_END, true).isValid()
                  ? moment(valuesPost?.checkIn, DATE_FORMAT_BACK_END, true)
                  : undefined
              }
              endDate={
                valuesPost?.checkOut &&
                moment(valuesPost?.checkOut, DATE_FORMAT_BACK_END, true).isValid()
                  ? moment(valuesPost?.checkOut, DATE_FORMAT_BACK_END, true)
                  : undefined
              }
              onChange={(startDate, endDate) => {
                if (moment(startDate) >= moment(endDate)) {
                  setErrors({
                    hotelItemCheckIn:
                      'Thời gian check out phải lớn hơn thời gian check in. Vui lòng nhập lại.',
                  });
                  setFieldValue('checkIn', undefined);
                  setFieldValue('checkOut', undefined);
                  return;
                }
                setFieldValue('checkIn', startDate?.format(DATE_FORMAT_BACK_END), true);
                setFieldValue(
                  'checkOut',
                  startDate && !endDate
                    ? moment().format(DATE_FORMAT_BACK_END)
                    : endDate?.format(DATE_FORMAT_BACK_END),
                  true,
                );
                // save DB
                setFieldValue('checkInAt', startDate?.format(DATE_FORMAT_TIMEZONE), true);
                setFieldValue(
                  'checkOutAt',
                  startDate && !endDate
                    ? moment().format(DATE_FORMAT_TIMEZONE)
                    : endDate?.format(DATE_FORMAT_TIMEZONE),
                  true,
                );

                const paramsHotel = {
                  caId: caId,
                  tagsSetting: hotelTagsForm,
                  checkIn: startDate?.format(DATE_FORMAT_BACK_END),
                  checkOut: endDate?.format(DATE_FORMAT_BACK_END),
                };
                if (queryHotelId > 0) {
                  fetchHotelsByHotelId(queryHotelId, paramsHotel);
                }
              }}
            />
            {(errors as any).hotelItemCheckIn && (
              <Typography variant="body2" style={{ color: RED }}>
                {(errors as any).hotelItemCheckIn}
              </Typography>
            )}
          </Grid>

          <Grid item xs={6} sm={2}>
            <FormControlTextField
              name="hotelOriginPrice"
              formControlStyle={{ width: '100%' }}
              placeholder="Giá hiển thị"
              value={valuesPost.hotelOriginPrice}
              onChange={(e: any) => {
                let price = e.target.value;
                let originPrice = 0;
                if (Number.isInteger(Number(price)) && Number(price) > 0) {
                  originPrice = price;
                }
                if (Number.isInteger(Number(price)) && Number(price) >= 999999999) {
                  originPrice = 999999999;
                }
                setFieldValue('hotelOriginPrice', originPrice);
                valuesPost?.hotelPriceIsNull && setFieldValue('hotelPriceIsNull', false);
              }}
              inputProps={{ maxLength: 999999999, autoComplete: 'off' }}
              optional
              errorMessage={
                submitCount > 0 &&
                !valuesPost.hotelOriginPrice &&
                errorsPost.hotelOriginPrice &&
                String(errorsPost.hotelOriginPrice)
              }
            />
            {valuesPost.hotelOriginPrice >= 999999999 && (
              <Typography variant="body2" style={{ color: RED, marginTop: -15 }}>
                Giá trị tối đa là 999999999
              </Typography>
            )}
          </Grid>
          <Grid item xs={6} sm={2}>
            <Tooltip title="Gán nút cho hành động" placement="bottom-end">
              <FormControlAutoComplete
                value={ACTIONS.find((v: some) => v.id === valuesPost?.hotelAction) || null}
                formControlStyle={{ width: '100%' }}
                placeholder="Hành động"
                onChange={(e: any, value: some | null) => {
                  setFieldValue('hotelAction', value?.id, true);
                }}
                options={ACTIONS as some[]}
                getOptionLabel={(one: some) => one.name}
                optional
                errorMessage={errorsPost.hotelAction && String(errorsPost.hotelAction)}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            {!caId && (
              <Typography variant="body2" style={{ color: RED, marginTop: -5 }}>
                Bạn cần lựa chọn kênh chia sẻ trước khi tiếp tục!
              </Typography>
            )}
            {caId &&
              valuesPost.hotelId &&
              valuesPost.checkInAt &&
              valuesPost.hotelPriceIsNull &&
              !valuesPost.hotelOriginPrice && (
                <Typography variant="body2" style={{ color: RED, marginTop: -5 }}>
                  Không tìm thấy giá phòng trong khoảng thời gian này. Vui lòng thử lại
                </Typography>
              )}
          </Grid>
        </Grid>
      </Paper>

      <Tags tagList={hotelTagsForm} onReset={getApplicationSettings} />

      <Paper className="pager-section-form">
        <Grid container style={{ paddingTop: 10 }}>
          <Grid item xs={7}>
            <Row>
              <Typography variant="subtitle1">Thêm video đại diện</Typography>
              <Typography variant="body2" style={{ color: GREY_400, marginLeft: 4 }}>
                (tối đa 1 video, hỗ trợ định dạng MP4, AVI, MOV, FLV)
              </Typography>
            </Row>
          </Grid>
          <Grid item xs={5}>
            <Row style={{ justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  if (isEmpty(valuesPost?.hotelId && caId)) {
                    return dispatch(
                      setNotistackMessage(
                        'Bạn cần lựa chọn Kênh chia sẻ & Khách sạn trước khi tiếp tục!',
                        'warning',
                      ),
                    );
                  }
                  setShowMedia(true);
                }}
              >
                <Typography variant="body1" style={{ color: PRIMARY }}>
                  Tất cả hình ảnh khách sạn
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
        <Row style={{ margin: '10px 0px' }}>
          <div style={{ marginRight: 10 }}>
            {!caId && (
              <ButtonPhotos
                label="Tải lên video"
                onClick={() => {
                  return dispatch(
                    setNotistackMessage(
                      'Bạn cần lựa chọn kênh chia sẻ trước khi tiếp tục!',
                      'warning',
                    ),
                  );
                }}
              />
            )}

            {caId && !valuesPost?.hotelVideoItem?.isLinkVideo && (
              <DndPhotos
                label="Tải lên video"
                cardID={caId || 0}
                listMedias={valuesPost?.hotelVideoItem ? [valuesPost?.hotelVideoItem] : []}
                setListMedias={(list: any) => {
                  if (!isEmpty(list)) {
                    setFieldValue('hotelVideoItem', list[0], true);
                  } else {
                    setFieldValue('hotelVideoItem', undefined, true);
                  }
                }}
                handleRemoveItem={() => {
                  setFieldValue('hotelVideoItem', undefined, true);
                }}
                isChecked={[]}
                setTempListPhoto={() => {}}
                setNumberMediaBefore={setNumberMediaBefore}
                maxNumberFile={1}
                fileType="video"
              />
            )}

            {caId && loadingUploadLink && valuesPost?.hotelVideoItem?.isLinkVideo && (
              <ButtonPhotosLoading loading={true} label="Đang xử lý video..." />
            )}
          </div>

          {caId ? (
            <DndPhotos
              label={`Tải lên ảnh đại diện \ncho video`}
              cardID={caId || 0}
              listMedias={valuesPost?.hotelImageItem ? [valuesPost?.hotelImageItem] : []}
              setListMedias={(list: any) => {
                if (!isEmpty(list)) {
                  setFieldValue('hotelImageItem', list[0], true);
                } else {
                  setFieldValue('hotelImageItem', undefined, true);
                }
              }}
              handleRemoveItem={() => {
                setFieldValue('hotelImageItem', undefined, true);
              }}
              isChecked={[]}
              setTempListPhoto={() => {}}
              setNumberMediaBefore={() => {}}
              maxNumberFile={1}
              fileType="image"
              isNoCDN
            />
          ) : (
            <ButtonPhotos
              label={`Tải lên ảnh đại diện \ncho video`}
              onClick={() => {
                return dispatch(
                  setNotistackMessage(
                    'Bạn cần lựa chọn kênh chia sẻ trước khi tiếp tục!',
                    'warning',
                  ),
                );
              }}
            />
          )}
        </Row>
        {submitCount > 0 && errorsPost.hotelVideoItem && (
          <Typography variant="body2" style={{ color: RED }}>
            - {errorsPost.hotelVideoItem}
          </Typography>
        )}
        {submitCount > 0 && errorsPost.hotelImageItem && (
          <Typography variant="body2" style={{ color: RED }}>
            - {errorsPost.hotelImageItem}
          </Typography>
        )}
      </Paper>

      <FeaturedReview />
      <RelatedPosts postIds={valuesPost?.postIdsItem} />
      <MediaDialog
        open={showMedia}
        setOpen={setShowMedia}
        addVideoToPost={handlUploadLinkVideo}
        hotelId={valuesPost?.hotelId}
        caId={caId}
      />
      <LoadingBox loading={loading} style={{ bottom: 'auto' }} />
    </div>
  );
};

export default React.memo(PostTypeItem);
