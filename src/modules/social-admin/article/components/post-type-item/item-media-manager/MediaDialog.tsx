import React, { useState, useCallback, useEffect } from 'react';
import { Grid, Box, Typography, Avatar, Dialog } from '@material-ui/core';
import { useFormikContext } from 'formik';
import ReactPlayer from 'react-player';
import LoadingButton from 'modules/common/components/LoadingButton';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import queryString from 'query-string';
import { isArray } from 'lodash';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { API_PATHS } from 'configs/API';
import { fetchThunk } from 'modules/common/redux/thunk';
import { setNotistackMessage } from 'modules/common/redux/reducer';
import { ReactComponent as IconPlayVideo } from 'svg/icon_play_video.svg';
import { ReactComponent as IconCheckedGreen } from 'svg/icon_checked_green.svg';
import { ReactComponent as IconNoSearch } from 'svg/No_Search_Result.svg';
import { ReactComponent as IconNoImage } from 'svg/no_image.svg';
import { some, isEmpty } from 'configs/utils';
import { RED } from 'configs/colors';
import { Row } from 'modules/common/components/elements';
import { HOTEL_MEDIA_TYPE } from 'modules/social-admin/constants';
import { getImageDuration } from 'helpers/image';
import './style.scss';

const MEDIA_TYPE_OPTIONS = [
  { id: 'VIDEO', name: 'Video' },
  { id: 'IMAGE', name: 'Image' },
];

const cssClass = 'dialog-post-item-media-manager';
const hotelImageCDN = 'https://tripi.vn/cdn-cgi/image/width=1280/';

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  addVideoToPost: (videoItem: any) => void;
  hotelId: number;
  caId: number;
}

const MediaDialog: React.FC<Props> = props => {
  const { setOpen, open, hotelId, caId, addVideoToPost } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { setFieldValue } = useFormikContext();

  const [mediaList, setMediaList] = useState<some[]>([]);
  const [selectedList, setSelectedList] = useState<some[]>([]);
  const [checkIndexs, setCheckIndexs] = useState<number[]>([]);
  const [watchItem, setWatchItem] = useState<any>();
  const [selectedVideo, setSelectedVideo] = useState<any>();
  const [selectedImage, setSelectedImage] = useState<any>();
  const [typeFilter, setTypeFilter] = useState<string>('');

  const fetchMediasByHotel = useCallback(
    async (type: string, caIdHotel: number) => {
      const params = {
        id: hotelId,
        type: type || '',
        caId: caIdHotel,
        page: 1,
        size: 500,
      };
      const json = await dispatch(
        fetchThunk(`${API_PATHS.searchHotelMedias}?${queryString.stringify(params)}`, 'get'),
      );
      if (json?.code === 200) {
        setMediaList(json?.data?.content || []);
      } else {
        json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
      }
    },
    [dispatch, hotelId],
  );

  useEffect(() => {
    if (open && hotelId) {
      fetchMediasByHotel('', caId);
    }
  }, [open, hotelId, caId, fetchMediasByHotel]);

  const onAddToPost = async () => {
    if (!isEmpty(selectedImage)) {
      const imageDuration: any = await getImageDuration(selectedImage);
      const imageUpload = {
        extension: 'jpg/png',
        location: selectedImage?.url?.replace(hotelImageCDN, ''),
        size: null,
        type: 'image',
        width: imageDuration?.width,
        height: imageDuration?.height,
        attachedServices: [],
      };
      setFieldValue('hotelImageItem', imageUpload, true);
    }
    if (!isEmpty(selectedVideo)) {
      const videoUpload = {
        isLinkVideo: true,
        type: 'video',
        location: selectedVideo?.url,
        order: 1,
        videoId: null,
        provider: 'HOTEL_ITEM',
        thumbnail: null,
        downloadLink: selectedVideo?.url,
      };
      setFieldValue('hotelVideoItem', videoUpload, true);
      addVideoToPost(selectedVideo);
    }

    setCheckIndexs([]);
    setSelectedList([]);
    setWatchItem(undefined);
    setSelectedVideo(undefined);
    setSelectedImage(undefined);
    setOpen(false);
  };

  return (
    <Dialog className={`${cssClass}`} maxWidth="md" open={open} onClose={() => setOpen(false)}>
      <div className={`${cssClass}-in`}>
        <Typography
          variant="h6"
          style={{ marginTop: 15, marginBottom: 15, fontWeight: 'bold', textAlign: 'center' }}
        >
          Quản lý hình ảnh
        </Typography>

        <Grid container spacing={2} style={{ borderRadius: 5, marginBottom: 10 }}>
          <Grid item xs={12} sm={6}>
            <div className={`${cssClass}-left`}>
              <div className={`${cssClass}-left-head`}>
                <FormControlAutoComplete<some>
                  placeholder="Tất cả"
                  value={MEDIA_TYPE_OPTIONS.find((v: some) => v.id === typeFilter) || null}
                  onChange={(e: any, valueItem: some | null) => {
                    fetchMediasByHotel(valueItem?.id, caId);
                    setTypeFilter(valueItem?.id);
                  }}
                  options={MEDIA_TYPE_OPTIONS}
                  getOptionLabel={(one: some) => one.name}
                  getOptionSelected={(option: some, value: some) => {
                    return option?.id === value?.id;
                  }}
                  optional
                  formControlStyle={{ width: 150, minWidth: 'unset', marginRight: 15 }}
                />
              </div>
              <div className={`${cssClass}-left-body`}>
                {isArray(mediaList) &&
                  mediaList?.map((mediaItem: any, index: number) => (
                    <div className={`${cssClass}-left-body-item`} key={index}>
                      <Box
                        className={`${cssClass}-left-body-item-in`}
                        onClick={() => {
                          if (!checkIndexs?.includes(index)) {
                            setWatchItem(mediaItem);

                            if (mediaItem?.type === HOTEL_MEDIA_TYPE.IMAGE) {
                              setSelectedImage(mediaItem);

                              // select 2
                              if (
                                selectedList?.length === 1 &&
                                selectedList[0]?.type === HOTEL_MEDIA_TYPE.VIDEO
                              ) {
                                setSelectedList([...selectedList, mediaItem]);
                                setCheckIndexs([...checkIndexs, index]);
                              } else {
                                setSelectedList([mediaItem]);
                                setCheckIndexs([index]);
                              }
                            }
                            if (mediaItem?.type === HOTEL_MEDIA_TYPE.VIDEO) {
                              setSelectedVideo(mediaItem);

                              // select 2
                              if (
                                selectedList?.length === 1 &&
                                selectedList[0]?.type === HOTEL_MEDIA_TYPE.IMAGE
                              ) {
                                setSelectedList([...selectedList, mediaItem]);
                                setCheckIndexs([...checkIndexs, index]);
                              } else {
                                setSelectedList([mediaItem]);
                                setCheckIndexs([index]);
                              }
                            }
                          } else {
                            const indexCheckId = checkIndexs.indexOf(index);
                            if (indexCheckId > -1) {
                              checkIndexs.splice(indexCheckId, 1);
                              setCheckIndexs([...checkIndexs]);

                              selectedList?.splice(indexCheckId, 1);
                              setSelectedList([...selectedList]);
                              setWatchItem(undefined);

                              if (mediaItem?.type === HOTEL_MEDIA_TYPE.IMAGE) {
                                setSelectedImage(undefined);
                              }
                              if (mediaItem?.type === HOTEL_MEDIA_TYPE.VIDEO) {
                                setSelectedVideo(undefined);
                              }
                            }
                          }
                        }}
                      >
                        {mediaItem?.type === HOTEL_MEDIA_TYPE.IMAGE && (
                          <Avatar
                            key={index}
                            variant="square"
                            src={mediaItem?.url}
                            alt="media manager"
                            style={{ width: 120, height: 120 }}
                          />
                        )}
                        {mediaItem?.type === HOTEL_MEDIA_TYPE.VIDEO && (
                          <>
                            <ReactPlayer url={mediaItem?.url} muted width={120} height="100%" />
                            <IconPlayVideo style={{ top: 40, right: 40 }} />
                          </>
                        )}
                      </Box>
                      {checkIndexs?.includes(index) && <IconCheckedGreen />}
                    </div>
                  ))}

                {isEmpty(mediaList) && (
                  <Row
                    style={{
                      minWidth: 200,
                      minHeight: 380,
                      justifyContent: 'center',
                      margin: 'auto',
                    }}
                  >
                    <IconNoSearch />
                  </Row>
                )}
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className={`${cssClass}-right`}>
              <div className={`${cssClass}-right-body ${!isEmpty(watchItem) && 'has-data'}`}>
                {isEmpty(watchItem) && <IconNoImage />}
                {watchItem?.type === HOTEL_MEDIA_TYPE.IMAGE && (
                  <img src={watchItem?.url} alt="media manager" />
                )}

                {watchItem?.type === HOTEL_MEDIA_TYPE.VIDEO && (
                  <Box
                    style={{
                      position: 'relative',
                      display: 'flex',
                      justifyItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'black',
                    }}
                  >
                    <ReactPlayer playing url={watchItem?.url} controls muted width={429} />
                  </Box>
                )}
              </div>
            </div>
          </Grid>
        </Grid>

        <div
          style={{
            borderRadius: 4,
            marginBottom: 15,
          }}
        >
          <Row>
            <Typography variant="body2" style={{ color: RED }}>
              Bạn cần chọn 1 video và 1 ảnh đại diện cho video
            </Typography>
          </Row>
          <Row style={{ marginTop: 5, justifyContent: 'flex-end' }}>
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
              onClick={() => onAddToPost()}
              disableElevation
              disabled={isEmpty(watchItem)}
            >
              Thêm vào bài viết
            </LoadingButton>
          </Row>
        </div>
      </div>
    </Dialog>
  );
};

export default React.memo(MediaDialog);
