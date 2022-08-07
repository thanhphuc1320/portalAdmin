import { ButtonBase, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { GREY_500 } from 'configs/colors';
import { SUCCESS_CODE } from '../../../constants';
import { uploadFile } from 'modules/common/redux/reducer';
import { AppState } from 'redux/reducers';
import { snackbarSetting } from 'modules/common/components/elements';
import LoadingIcon from './LoadingIcon';

interface Props {
  setUrl(value: string): void;
  url?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

const UploadFileCSV: React.FC<Props> = (props: Props) => {
  const { setUrl, url, style, width, height } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleUploadFile = useCallback(
    async (value: File) => {
      try {
        setLoading(true);
        const json = await dispatch(uploadFile([value]));
        if (json?.code === SUCCESS_CODE) {
          setUrl(json.data?.url);
        } else {
          json?.message &&
            enqueueSnackbar(
              json?.message,
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

  const checkUploadFile = useCallback(
    async (files: File[]) => {
      files?.forEach(async (file: File) => {
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
        await handleUploadFile(file);
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
          'Chỉ chấp nhận định dạng .csv. Kích thước ảnh tối đa là 5MB, tối thiểu là 10B.',
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
        setLoading(false);
        isUpload = false;
      }
      isUpload && checkUploadFile && checkUploadFile(acceptedFiles);
    },
    accept: '.csv',
    // maxSize: 5242880,
    minSize: 10, // 10b
  });

  return (
    <div
      className="uploadFileCSV"
      style={{
        width: width || '100%',
        height: height || 40,
      }}
    >
      {loading && <LoadingIcon style={{ height: height || 35, width: width || 35 }} />}
      <ButtonBase
        style={{
          border: `1px solid ${GREY_500}`,
          boxSizing: 'border-box',
          borderRadius: 4,
          width: width || '100%',
          height: height || 40,
          display: 'flex',
          ...style,
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {url && <div>Download</div>}
        {!url && (
          <Typography
            variant="body2"
            style={{
              color: GREY_500,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            Choose file
          </Typography>
        )}
      </ButtonBase>
    </div>
  );
};

export default UploadFileCSV;
