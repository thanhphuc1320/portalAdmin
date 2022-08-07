import React, { useCallback, useContext, useState, useEffect } from 'react';
import { ButtonBase, Grid, Typography } from '@material-ui/core';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as tus from 'tus-js-client';
import { API_PATHS } from 'configs/API';
import { GREY_100, GREY_400 } from 'configs/colors';
import {
  MAX_NUMBER_PHOTOS,
  MIN_UPLOAD_FILE_VIDEO,
  RETRY_DELAYS_UPLOAD_VIDEO,
  some,
  SUCCESS_CODE,
} from '../../../../constants';
import { uploadImage } from 'modules/common/redux/reducer';
import { AppState } from 'redux/reducers';
import { ReactComponent as AddIcon } from 'svg/icon_add_media.svg';
import { snackbarSetting } from 'modules/common/components/elements';
import { fetchThunk } from '../../redux/thunk';
import LoadingIcon from '../LoadingIcon';
import DragItem from './DragItem';
import { GridCustom, GridImage, GridItem } from './Grid';
import GridContext from './GridContext';
import { getImageDuration } from 'helpers/image';
import { getCreatedAtBackEnd } from 'models/moment';

type fileType = 'media' | 'image' | 'video';

interface Props {
  isChecked: number[];
  handleRemoveItem(mediaItem: any): void;
  setListMedias(value: some[]): void;
  listMedias: some[];
  cardID: number;
  maxNumberFile?: number;
  fileType?: fileType;
  checkPostTypeVideo?: boolean;
  label?: string;
  setNumberMediaBefore(value: number): void;
  isNoCDN?: boolean;
}

const DndPhotosCore: React.FC<Props> = (props: Props) => {
  const {
    isChecked,
    handleRemoveItem,
    setListMedias,
    listMedias,
    cardID,
    maxNumberFile,
    fileType,
    checkPostTypeVideo,
    label,
    isNoCDN,
    setNumberMediaBefore,
  } = props;

  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { items, moveItem } = useContext<any>(GridContext);
  const temListMedias: any = listMedias;
  const [filesUpload, setFilesUpload] = useState<any>();
  const [loadingImages, setLoadingImages] = useState<boolean>(false);
  const [loadingVideos, setLoadingVideos] = useState<boolean>(false);
  const [filesToLoading, setFilesToLoading] = useState<any>(items?.length);
  const maxFilesUpload = maxNumberFile && maxNumberFile > 0 ? maxNumberFile : MAX_NUMBER_PHOTOS;

  const handleUploadImage = useCallback(
    async (value: File[] | some, number: number = 0, filesLength?: number) => {
      setLoadingImages(true);
      try {
        if (value[number]?.path?.split('.').indexOf('jfif') === -1) {
          const json = await dispatch(uploadImage([value[number]]));
          if (json?.code === SUCCESS_CODE) {
            const imageDuration: any = await getImageDuration(json.data);
            const tempData = {
              extension: 'jpg/png',
              location: json.data?.url,
              size: json.data?.size,
              type: 'image',
              attachedServices: [],
              width: imageDuration?.width,
              height: imageDuration?.height,
              createdAt: getCreatedAtBackEnd(),
            };
            temListMedias.push(tempData);
            return json;
          }
        } else {
          enqueueSnackbar(
            `Định dạng ảnh ${value[number]?.name} không hợp lệ !`,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
        }
      } catch (error) {
      } finally {
        if (number + 1 < value.length) {
          handleUploadImage(value, number + 1, filesLength);
        }
        if (number + 1 === value.length) {
          const tempLengthPhotos = temListMedias.length;
          if (tempLengthPhotos > maxFilesUpload) {
            enqueueSnackbar(
              `Số lượng vượt quá ${maxFilesUpload}!`,
              snackbarSetting(key => closeSnackbar(key), {
                color: 'error',
              }),
            );
          }
          const tempListPhotos = temListMedias.slice(0, maxFilesUpload);
          setListMedias(tempListPhotos);
        }
      }
    },
    [closeSnackbar, dispatch, enqueueSnackbar, setListMedias, temListMedias, maxFilesUpload],
  );

  const getVideoDuration = file =>
    new Promise(resolve => {
      const reader: any = new FileReader();
      reader.onload = () => {
        const media = new Audio(reader.result);
        media.onloadedmetadata = () => resolve(media.duration);
      };
      reader.readAsDataURL(file);
    });

  const getVideoUpload = useCallback(
    async (id: string) => {
      return await dispatch(fetchThunk(`${API_PATHS.uploadVideoStatusV2}?id=${id}`, 'get'));
    },
    [dispatch],
  );

  const checkUpload = useCallback(
    async (files: any) => {
      setLoadingVideos(true);
      try {
        const dataFXt = moment(new Date())
          .add(3, 'minute')
          .toISOString();
        const duration: any = await getVideoDuration(files);
        let url = API_PATHS.uploadVideoInitV2;
        if (duration >= 60 && files?.size > MIN_UPLOAD_FILE_VIDEO) {
          url = API_PATHS.uploadVideoTusInitializeV2;
        }

        const json = await dispatch(
          fetchThunk(
            url,
            'post',
            JSON.stringify({
              duration,
              expiredAt: dataFXt,
              length: files?.size,
              watermarkCaId: cardID,
            }),
          ),
        );
        // eslint-disable-next-line camelcase
        const uploadLink = json?.data?.upload_link;
        // eslint-disable-next-line camelcase
        const idVideo = json?.data?.video_id;
        if (uploadLink) {
          const formData = new FormData();
          formData.append('file', files);
          if (duration >= 60 && files?.size > MIN_UPLOAD_FILE_VIDEO) {
            const upload = new tus.Upload(files, {
              uploadUrl: uploadLink,
              overridePatchMethod: false,
              retryDelays: RETRY_DELAYS_UPLOAD_VIDEO,
              metadata: {
                filename: files.name,
                filetype: files.type,
              },
              onError(error) {
                enqueueSnackbar(
                  `Failed because: ${error}`,
                  snackbarSetting(key => closeSnackbar(key), {
                    color: 'error',
                  }),
                );
              },
              // onSuccess() {
              //   console.log('Download %s from %s', upload.url);
              // },
            });

            upload.findPreviousUploads().then(previousUploads => {
              if (previousUploads.length) {
                upload.resumeFromPreviousUpload(previousUploads[0]);
              }
              upload.start();
            });
          } else {
            // no token, yes blob
            dispatch(fetchThunk(uploadLink, 'post', formData, false, {}, true));
          }

          const jsonVideo = await getVideoUpload(idVideo);

          if (jsonVideo.code === 200) {
            let status = true;
            while (status) {
              const jsonVideo2 = await getVideoUpload(idVideo);
              if (jsonVideo2?.data?.status === 'COMPLETE') {
                status = false;
                temListMedias.push(jsonVideo2?.data);
              }
              await new Promise(resolve => setTimeout(resolve, 3000));
            }

            const tempListPhotos = temListMedias.slice(0, maxFilesUpload);
            setListMedias(tempListPhotos);
          } else {
            enqueueSnackbar(
              jsonVideo?.message,
              snackbarSetting(key => closeSnackbar(key), {
                color: 'error',
              }),
            );
          }
        }
      } catch (error) {
      } finally {
      }
    },
    [
      cardID,
      closeSnackbar,
      dispatch,
      enqueueSnackbar,
      getVideoUpload,
      setListMedias,
      temListMedias,
      maxFilesUpload,
    ],
  );

  const handleUploadVideo = useCallback(
    async (files: File[], number: number = 0, filesLength?: number) => {
      const duration: any = await getVideoDuration(files[number]);
      if (checkPostTypeVideo && (duration < 5 || duration > 180)) {
        enqueueSnackbar(
          `Thời lượng video cho phép từ 5 giây - 3 phút`,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
        return;
      }

      files.length && checkUpload(files[number]);

      if (number + 1 < files.length) {
        handleUploadVideo(files, number + 1, filesLength);
      }
      if (number + 1 === files.length) {
        const tempLengthVideos = temListMedias.length;
        if (tempLengthVideos > maxFilesUpload) {
          enqueueSnackbar(
            `Số lượng vượt quá ${maxFilesUpload}!`,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
        }
        const tempListVideos = temListMedias?.slice(0, maxFilesUpload);
        setListMedias(tempListVideos);
      }
    },
    [
      checkUpload,
      closeSnackbar,
      enqueueSnackbar,
      setListMedias,
      temListMedias,
      maxFilesUpload,
      checkPostTypeVideo,
    ],
  );

  const uploadPhoto = useCallback(
    async (files: File[]) => {
      const fileImages: File[] = [];
      const fileVideos: File[] = [];
      const filesUploaded: File[] = [];

      files.forEach(async (file: File) => {
        if (file.type.includes('image')) {
          if (file.size > 5242880) {
            enqueueSnackbar(
              'Chỉ chấp nhận kích thước ảnh tối đa là 5MB, tối thiểu là 10KB.',
              snackbarSetting(key => closeSnackbar(key), {
                color: 'error',
              }),
            );
            return;
          }

          const fileImagesUploads: File[] = [];
          const image = new Image();
          image.src = URL.createObjectURL(file);
          image.onload = async () => {
            fileImagesUploads.push(file);
            await handleUploadImage(fileImagesUploads, 0, fileImages.length);
          };
          filesUploaded.push(file);
        }

        if (file.type.includes('video')) {
          fileVideos.push(file);
          filesUploaded.push(file);
        }
      });

      setFilesUpload(filesUploaded);
      setNumberMediaBefore(filesUploaded?.length || 0);
      if (fileVideos.length) handleUploadVideo(fileVideos, 0, fileVideos.length);
    },
    [closeSnackbar, enqueueSnackbar, handleUploadImage, handleUploadVideo, setNumberMediaBefore],
  );

  const getFileTypeUpload = useCallback(() => {
    if (fileType === 'image') {
      return 'image/jpeg,image/png,image/jpg';
    }
    if (fileType === 'video') {
      return 'video/mp4, video/avi, video/mov, video/flv';
    }
    return 'image/jpeg,image/png,image/jpg, video/mp4, video/avi, video/mov, video/flv';
  }, [fileType]);

  const { getRootProps, getInputProps } = useDropzone({
    noKeyboard: true,
    multiple: true,
    onDrop: (acceptedFiles: File[]) => {
      let isUpload = true;
      if (!acceptedFiles.length) {
        enqueueSnackbar(
          'Chỉ chấp nhận định dạng  .mp4, .avi, .mov, .flv .jpg và .png. Kích thước ảnh tối đa là 5MB, tối thiểu là 10KB.',
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
        isUpload = false;
      }
      if (acceptedFiles.length > maxFilesUpload) {
        enqueueSnackbar(
          `Số lượng vượt quá ${maxFilesUpload}!`,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
        isUpload = false;
      }
      isUpload && uploadPhoto && uploadPhoto(acceptedFiles);
    },
    accept: getFileTypeUpload(),
    // maxSize: 5242880,
    minSize: 10240, // 10kb
  });

  const actionLoading = (number: number) => {
    const elementLoading: some = [];
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < number; index++) {
      elementLoading?.push(index);
    }
    return elementLoading?.map(() => <LoadingIcon style={{ height: 128, width: 210 }} />);
  };

  const listLoading = useCallback(() => {
    const numberFilesUpload = filesToLoading;
    const numberItems = items?.length;

    if (numberItems <= numberFilesUpload) {
      const arrLoading = actionLoading(numberFilesUpload - numberItems);
      return arrLoading;
    }
  }, [filesToLoading, items]);

  useEffect(() => {
    if (filesUpload?.length > 0) {
      const count = filesUpload?.length + filesToLoading;
      setFilesToLoading(count);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesUpload]);

  useEffect(() => {
    const numberFilesUpload = filesToLoading;
    const numberItems = items?.length;
    if (numberFilesUpload > 5) setFilesToLoading(5);
    if (numberFilesUpload === numberItems) {
      setLoadingImages(false);
      setLoadingVideos(false);
    }
  }, [items, filesToLoading]);

  const handleFuncRemove = item => {
    handleRemoveItem(item);
    if (filesToLoading > 0) {
      setFilesToLoading(filesToLoading - 1);
    }
  };

  return (
    <div className="DndPhotosCore">
      <GridCustom>
        {items &&
          items.map((item: any, index: number) => (
            <DragItem key={item.createdAt} createdAt={item.createdAt} onMoveItem={moveItem}>
              {item && (
                <GridItem>
                  <GridImage
                    key={item.createdAt}
                    isChecked={isChecked}
                    onRemove={() => handleFuncRemove(item)}
                    src={item.location}
                    index={index}
                    createdAt={item.createdAt}
                    type={item.type}
                    setFilesUpload={setFilesUpload}
                    disabled={loadingImages || loadingVideos}
                    isNoCDN={isNoCDN}
                  />
                </GridItem>
              )}
            </DragItem>
          ))}
        {listLoading()}
        <ButtonBase
          style={{
            background: GREY_100,
            border: `1px dashed ${GREY_400}`,
            boxSizing: 'border-box',
            borderRadius: 4,
            width: 200,
            height: 160,
            display: `${temListMedias.length >= maxFilesUpload ? 'none' : 'flex'}`,
            marginRight: 10,
            marginBottom: 10,
            cursor: `${loadingImages || loadingVideos ? 'not-allowed' : 'pointer'}`,
          }}
          {...getRootProps()}
          disabled={loadingImages || loadingVideos}
          // onClick={saveFunctions}
        >
          <input {...getInputProps()} />
          <Typography
            variant="body2"
            style={{
              color: GREY_400,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <AddIcon width={48} stroke={GREY_400} />
            {label && (
              <Typography
                variant="body2"
                style={{
                  color: GREY_400,
                  whiteSpace: 'pre-line',
                  position: 'relative',
                  top: 5,
                }}
              >
                {label}
              </Typography>
            )}
          </Typography>
        </ButtonBase>
      </GridCustom>

      <Grid item xs={3} />
    </div>
  );
};

export default DndPhotosCore;
