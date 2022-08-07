import { ButtonBase, Grid, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { GREY_100, GREY_400 } from 'configs/colors';
import { some, SUCCESS_CODE } from '../../../constants';
import { uploadImage } from 'modules/common/redux/reducer';
import { AppState } from 'redux/reducers';
import { ReactComponent as AddIcon } from 'svg/icon_add_media.svg';
import { snackbarSetting } from 'modules/common/components/elements';
import LoadingIcon from './LoadingIcon';
import { GridCustom, GridImage, GridItem } from './DndPhotos/Grid';

interface Props {
  setUrl(value: string): void;
  url: string;
  style?: React.CSSProperties;
  widthImg?: number;
  heightImg?: number;
}

const UploadImageOne: React.FC<Props> = (props: Props) => {
  const { setUrl, url, style, widthImg, heightImg } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleUploadFile = useCallback(
    async (value: File[] | some, number: number = 0) => {
      try {
        setLoading(true);
        if (value[number]?.path?.split('.').indexOf('jfif') === -1) {
          const json = await dispatch(uploadImage([value[number]]));
          if (json?.code === SUCCESS_CODE) {
            setUrl(json.data?.url);
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
        setLoading(false);
      }
    },
    [closeSnackbar, dispatch, enqueueSnackbar, setUrl],
  );

  const uploadPhoto = useCallback(
    async (files: File[]) => {
      const fileImages: File[] = [];
      files.forEach(async (file: File) => {
        if (file.type.includes('image')) {
          fileImages.push(file);
        }
      });

      fileImages?.forEach(async (file: File) => {
        if (file.size > 5242880) {
          enqueueSnackbar(
            'Chỉ chấp nhận kích thước ảnh tối đa là 5MB, tối thiểu là 10KB.',
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
          setLoading(false);
          return;
        }
        const fileImagesUploads: File[] = [];
        const image = new Image();
        image.src = URL.createObjectURL(file);
        image.onload = async () => {
          fileImagesUploads.push(file);

          await handleUploadFile(fileImagesUploads, 0);
        };
      });
    },
    [closeSnackbar, enqueueSnackbar, handleUploadFile],
  );

  const { getRootProps, getInputProps } = useDropzone({
    noKeyboard: true,
    multiple: false,
    onDrop: (acceptedFiles: File[]) => {
      let isUpload = true;
      if (!acceptedFiles.length) {
        enqueueSnackbar(
          'Chỉ chấp nhận định dạng .jpg và .png. Kích thước ảnh tối đa là 5MB, tối thiểu là 10KB.',
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
        setLoading(false);
        isUpload = false;
      }
      isUpload && uploadPhoto && uploadPhoto(acceptedFiles);
    },
    accept: 'image/jpeg,image/png,image/jpg',
    // maxSize: 5242880,
    minSize: 10240, // 10kb
  });

  return (
    <div className="uploadImageOne">
      <GridCustom>
        {loading && <LoadingIcon style={{ height: heightImg || 128, width: widthImg || 210 }} />}
        <ButtonBase
          style={{
            background: GREY_100,
            border: `1px dashed ${GREY_400}`,
            boxSizing: 'border-box',
            borderRadius: 4,
            width: widthImg || 200,
            height: heightImg || 160,
            display: 'flex',
            ...style,
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {url && (
            <GridItem>
              <GridImage
                isChecked={[]}
                onRemove={() => setUrl('')}
                src={url}
                index={0}
                createdAt="1"
                type="image"
                setFilesUpload={() => {}}
                widthImg={widthImg}
                heightImg={heightImg}
              />
            </GridItem>
          )}
          {!url && (
            <Typography
              variant="body2"
              style={{
                color: GREY_400,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <AddIcon className="svgFillAll" width={24} stroke={GREY_400} />
            </Typography>
          )}
        </ButtonBase>
      </GridCustom>

      <Grid item xs={3} />
    </div>
  );
};

export default UploadImageOne;
