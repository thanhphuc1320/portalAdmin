import React, { useCallback, useEffect, useState } from 'react';
import { goBack, push } from 'connected-react-router';
import { useSnackbar } from 'notistack';
import queryString from 'query-string';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Form, Formik } from 'formik';
import moment, { Moment } from 'moment';
import * as yup from 'yup';

import {
  Box,
  Button,
  ButtonBase,
  Checkbox,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormControl,
  Radio,
  RadioGroup,
  Grid,
  makeStyles,
  Paper,
  Typography,
  IconButton,
} from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';

import ConfirmDialog from 'modules/common/components/ConfirmDialog';
import DateField from 'modules/common/components/DateField';
import SelectTimeCheck from 'modules/common/components/SelectTimeCheck';
import { FieldTextContent } from 'modules/common/components/FieldContent';
import { setFlightList } from 'modules/social-admin/article/redux/articleReducer';
import ButtonPhotos from 'modules/common/components/DndPhotos/ButtonPhotos';
import TextAreaMentions from 'modules/common/components/MentionsInput/TextAreaMentions';
import DndPhotos from 'modules/common/components/DndPhotos';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import LoadingButton from 'modules/common/components/LoadingButton';
import LoadingBox from 'modules/common/components/LoadingBox';
import { Col, IOSSwitch, Row, snackbarSetting } from 'modules/common/components/elements';
import {
  DATE_FORMAT_BACK_END,
  DATE_FORMAT_C_DATE_HOUR,
  DATE_FORMAT_FILTER_FROM,
  DATE_FORMAT_SHOW,
  DATE_TIME_HOUR_FORMAT,
  HOUR_MINUTE,
} from 'models/moment';

import { AppState } from 'redux/reducers';
import { fetchThunk } from 'modules/common/redux/thunk';
import { setNotistackMessage } from 'modules/common/redux/reducer';

import {
  SERVICE_TYPE,
  POST_TYPE,
  POST_TYPE_OPTIONS,
  MEDIA_LAYOUT,
} from 'modules/social-admin/constants';
import { updateMediaDimension } from 'helpers/image';
import { isNumeric } from 'helpers/common';
import { TIME_DEFAULT } from '../../constants';
import { some } from '../../../../constants';
import { API_PATHS } from 'configs/API';
import { isEmpty } from 'configs/utils';

import {
  BLACK_400,
  BLACK_500,
  GREEN_500,
  GREY_400,
  ORANGE_400,
  PRIMARY,
  RED,
  RED_200,
} from 'configs/colors';

import CardInfo from './CardInfo';
import DiaglogDenyPost from './DiaglogDenyPost';
import DialogHistoryPost from './DialogHistoryPost';
import HotelServices from './HotelServices';
import PreviewHotel from './PreviewHotel';
import MediaLayoutReview from './media-layout-review';
import FightServices from './flight-service';
import PostTypeItem from './post-type-item';

import { ReactComponent as IconShape } from 'svg/Shape.svg';
import { ReactComponent as IconPendingPost } from 'svg/icon_pending_post_grey.svg';

import './style.scss';

const useStyles = makeStyles(() =>
  createStyles({
    buttonIcon: { '& .hide': { display: 'none' }, '&:hover .hide': { display: 'inline-block' } },
    container: {
      width: '80%',
      height: 160,
    },
    myTextarea: {
      padding: 8,
      fontFamily: 'sans-serif',
    },
  }),
);

const postDataDefault = {
  serviceType: SERVICE_TYPE.ARTICLE,
  aliasCode: null,
  type: POST_TYPE.DEFAULT,
  title: '',
  content: '',
  caId: null,
  layout: MEDIA_LAYOUT.SLIDE_LEGACY,
  rooms: '1',
  adults: '2',
  createdByName: '',
  id: null,
  userId: null,
  createdAt: '',
  status: '',
  reasonDeny: '',
  linkPostingRule: '',
  isScheduleSetup: false,
  shareable: false,
  datePosted: moment(new Date(), DATE_FORMAT_BACK_END)
    .add(1, 'days')
    .format(DATE_FORMAT_BACK_END),
  timePosted: TIME_DEFAULT,
  checkIn: null,
  checkOut: null,
  checkInAt: null,
  checkOutAt: null,
  hotelId: undefined,
  hotelName: undefined,
  hotelAction: undefined,
  hotelTags: undefined,
  hotelVideoItem: undefined,
  hotelImageItem: undefined,
  hotelReviews: undefined,
  hotelPostIds: undefined,
  hotelOriginPrice: 0,
  hotelReviewsOriginTotal: 0,
};

const messageTitleDefault = 'Nhập tối đa 80 ký tự';
const messageContentDefault = 'Nhập tối đa 10.000 ký tự';
interface Props {
  caIdList: some[];
}

const CreateUpdateArticleTable: React.FC<Props> = props => {
  const { caIdList } = props;

  const intl = useIntl();
  const flightList = useSelector((state: AppState) => state.article.flightList);
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();
  const location = useLocation();

  const [loading, setLoading] = useState<boolean>(false);
  const [listMedias, setListMedias] = useState<some[]>([]);
  const [filter, setFilter] = useState<any>({});
  const [hotelList, setHotelList] = useState<some[]>([]);
  const [openPreview, setOpenPreview] = useState(false);
  const [isRequiredCA, setIsRequiredCA] = useState(false);
  const [contentPost, setContentPost] = useState<string>();
  const [disabledSchedulePost, setDisabledSchedulePost] = useState<boolean>();
  const [messageTitle, setMessageTitle] = useState<string>(messageTitleDefault);
  const [messageContent, setMessageContent] = useState<string>(messageContentDefault);
  const [postData, setPostData] = useState<any>(postDataDefault);
  const [showServiceType, setShowServiceType] = useState(false);
  const [arraySelect, setArraySelect] = useState<number>(-1);
  const [openDialog, setOpenDialog] = useState(false);
  const [approvePost, onApprovePost] = useState(false);
  const [denyPost, onDenyPost] = useState(false);
  const [historyPost, onHistoryPost] = useState(false);
  const [isDisableSave, setIsDisableSave] = useState(false);
  const [isFocusedDatePicker, setIsFocusedDatePicker] = useState(false);
  const [mentionUsers, setMentionUsers] = useState({});
  const [numberMediaBefore, setNumberMediaBefore] = useState<number>(0);
  const [linkPostingRule, setLinkPostingRule] = useState<string>('');
  const [hotelItemOrigin, setHotelItemOrigin] = useState<any>();

  const { query } = location as any;
  const filterParams = (queryString.parse(location.search) as unknown) as any;
  const isPostTypeDefault = postData?.type === POST_TYPE.DEFAULT;
  const isPostTypeVideo = postData?.type === POST_TYPE.VIDEO;
  const isPostTypeItem = postData?.type === POST_TYPE.ITEM;

  const getAdminPostDetail = useCallback(
    async (postId: Number) => {
      setLoading(true);
      const json = await dispatch(fetchThunk(`${API_PATHS.adminPost}?id=${postId}`, 'get'));
      if (json?.code === 200) {
        setMentionUsers(json?.data?.metadata?.mentionUsers);
        setContentPost(json.data.content[0]?.content);
        setPostData({
          ...postData,
          ...json.data.content[0],
          timePosted: json.data.content[0]?.publishedAt
            ? moment(json.data.content[0]?.publishedAt, DATE_FORMAT_C_DATE_HOUR).format(HOUR_MINUTE)
            : TIME_DEFAULT,
          datePosted: json.data.content[0]?.publishedAt
            ? moment(json.data.content[0]?.publishedAt, DATE_FORMAT_C_DATE_HOUR).format(
                DATE_FORMAT_BACK_END,
              )
            : moment(new Date(), DATE_FORMAT_C_DATE_HOUR)
                .add(1, 'days')
                .format(DATE_FORMAT_BACK_END),
        });

        const tempMedias: some[] = json.data.content[0]?.mediaInfos.map((element: any) => {
          if (element.type === 'image') {
            return {
              extension: 'jpg/png',
              location: element.location,
              size: element.size,
              type: 'image',
              attachedServices: [],
              id: element.id,
              width: element?.width,
              height: element?.height,
              createdAt: element?.createdAt,
            };
          }
          if (element.type === 'video') {
            return element;
          }
        });
        setListMedias(tempMedias);

        const postDetail = json.data?.content[0];
        const serviceType = postDetail?.serviceType;

        if (serviceType === SERVICE_TYPE.HOTEL) {
          const tempHotelInfo = postDetail?.serviceInfos?.map((element: any) => element?.hotelInfo);
          setShowServiceType(!!tempHotelInfo);
          setHotelList(tempHotelInfo);
          if (postDetail?.type === POST_TYPE.ITEM) {
            const hotelItemTemp = !isEmpty(tempHotelInfo) ? tempHotelInfo[0] : {};
            setHotelItemOrigin(hotelItemTemp);
          }
        }

        if (serviceType === SERVICE_TYPE.FLIGHT) {
          const tempFlightInfo = postDetail?.serviceInfos?.map(
            (element: any) => element?.flightInfo,
          );
          setShowServiceType(!!tempFlightInfo);
          dispatch(setFlightList(tempFlightInfo));
        }
        setLoading(false);
      } else {
        setLoading(false);
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
      }
    },
    [closeSnackbar, dispatch, enqueueSnackbar, postData],
  );

  const getPostingRuleByCaId = React.useCallback(async () => {
    const json = await dispatch(
      fetchThunk(`${API_PATHS.getAdminApplicationSettings}?key=default_posting_rule_link`, 'get'),
    );
    if (json?.code === 200) {
      const defaultPostingRuleLinkArray = json?.data?.content || [];
      const postingRule = defaultPostingRuleLinkArray?.find(s => s?.caId === postData?.caId);
      setLinkPostingRule(postingRule?.value);
    } else {
      json?.message &&
        enqueueSnackbar(
          json?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
    }
  }, [dispatch, enqueueSnackbar, closeSnackbar, postData]);

  const onChangeItemPrice = useCallback(
    (dataItem: any) => {
      const indexChanged: number = flightList?.findIndex(
        (item: any) => item?.ticketOutboundId === dataItem?.ticketOutboundId,
      );
      flightList[indexChanged] = dataItem;
      dispatch(setFlightList(flightList));
    },
    [flightList, dispatch],
  );

  const updateSortedFlightList = useCallback(
    (sortedFlightList: some[]) => {
      dispatch(setFlightList(sortedFlightList || []));
    },
    [dispatch],
  );

  const getServiceInfos = useCallback(
    (serviceType: string, postValues: any) => {
      if (serviceType === SERVICE_TYPE.HOTEL) {
        if (postValues?.type === POST_TYPE.ITEM && !isEmpty(hotelList) && hotelList?.length > 0) {
          const tempHotelItem = hotelList[0] || {};
          return [
            {
              serviceType: SERVICE_TYPE.HOTEL,
              hotelInfo: {
                ...tempHotelItem,
                checkInAt: postValues?.checkInAt,
                checkOutAt: postValues?.checkOutAt,
                originPrice: Number(postValues?.hotelOriginPrice),
                tagItems: postValues?.hotelTags || [],
                reviews: postValues?.hotelReviews || [],
                postIds: postValues?.hotelPostIds || [],
                action: postValues?.hotelAction,
              },
            },
          ];
        }
        return hotelList.map((element: any) => {
          return {
            id: element?.id,
            serviceType: SERVICE_TYPE.HOTEL,
            hotelInfo: {
              ...element,
            },
          };
        });
      }
      if (serviceType === SERVICE_TYPE.FLIGHT) {
        return flightList.map((element: any) => {
          return {
            id: element?.id,
            serviceType: SERVICE_TYPE.FLIGHT,
            flightInfo: {
              ...element,
            },
          };
        });
      }
      return [];
    },
    [hotelList, flightList],
  );

  const getMediaPostSave = useCallback(
    async (postValues: any) => {
      if (postValues?.type === POST_TYPE.ITEM) {
        return [postValues?.hotelImageItem, postValues?.hotelVideoItem];
      }
      return await updateMediaDimension(listMedias);
    },
    [listMedias],
  );

  const postAdmin = useCallback(
    async (values: any) => {
      setIsDisableSave(true);
      let tempHashTags: any = `${values.content}`;
      tempHashTags = tempHashTags
        .split(' ')
        .map(element => (element.charAt(0) === '#' ? element : false));

      const listMediaNew = await getMediaPostSave(values);
      const serviceInfosNew = getServiceInfos(values?.serviceType, values);

      const json = await dispatch(
        fetchThunk(
          API_PATHS.adminPost,
          'post',
          JSON.stringify({
            isActive: values?.isActive,
            serviceType: values?.serviceType,
            type: values?.type,
            title: values?.title,
            caId: values?.caId,
            content: values?.content,
            shareable: values?.shareable,
            createdTime: moment().format(DATE_FORMAT_FILTER_FROM),
            mediaInfos: listMediaNew,
            layout: values?.layout,
            bannerInfo: {},
            publishedAt:
              values?.datePosted && values?.timePosted && values?.isScheduleSetup
                ? moment(
                    `${values?.datePosted} ${values?.timePosted}`,
                    DATE_TIME_HOUR_FORMAT,
                  ).format(DATE_FORMAT_C_DATE_HOUR)
                : null,
            serviceInfos: serviceInfosNew,
            hashTags: tempHashTags.filter(element => element),
          }),
        ),
      );
      if (json?.code === 200) {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'success',
            }),
          );
        setOpenDialog(true);
      } else {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
        setIsDisableSave(false);
      }
    },
    [closeSnackbar, dispatch, enqueueSnackbar, getServiceInfos, getMediaPostSave],
  );

  const putAdmin = useCallback(
    async (values: any) => {
      let tempHashTags: any = `${values.content}`;
      tempHashTags = tempHashTags
        .split(' ')
        .map(element => (element.charAt(0) === '#' ? element : false));

      const listMediaNew = await getMediaPostSave(values);
      const json = await dispatch(
        fetchThunk(
          `${API_PATHS.adminPost}?id=${query?.postId}`,
          'put',
          JSON.stringify({
            serviceType: values?.serviceType,
            type: values?.type,
            title: values?.title,
            caId: values?.caId,
            content: values?.content,
            shareable: values?.shareable,
            createdTime: moment().format(DATE_FORMAT_FILTER_FROM),
            // eslint-disable-next-line no-nested-ternary
            mediaInfos: listMediaNew,
            layout: values?.layout,
            bannerInfo: {},
            publishedAt:
              values?.datePosted &&
              values?.timePosted &&
              values?.isScheduleSetup &&
              !disabledSchedulePost
                ? moment(
                    `${values?.datePosted} ${values?.timePosted}`,
                    DATE_TIME_HOUR_FORMAT,
                  ).format(DATE_FORMAT_C_DATE_HOUR)
                : null,
            serviceInfos: getServiceInfos(values?.serviceType, values),
            hashTags: tempHashTags.filter(element => element),
          }),
        ),
      );

      if (json?.code === 200) {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'success',
            }),
          );
        setOpenDialog(true);
      } else {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
      }
    },
    [
      closeSnackbar,
      disabledSchedulePost,
      dispatch,
      enqueueSnackbar,
      getServiceInfos,
      query,
      getMediaPostSave,
    ],
  );

  const putApprovePost = useCallback(
    async (isAprrove: boolean, valuesForm?: any) => {
      const url = isAprrove
        ? `${API_PATHS.postApprove}?id=${query?.postId}`
        : `${API_PATHS.denyApprove}?id=${query?.postId}`;
      const params = isAprrove
        ? undefined
        : {
            reason: valuesForm?.reasonDeny,
            linkPostingRule,
          };
      const json = await dispatch(fetchThunk(url, 'put', JSON.stringify(params), false));

      if (json?.code === 200) {
        dispatch(push('/'));
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'success',
            }),
          );
      } else {
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
      }
    },
    [closeSnackbar, dispatch, enqueueSnackbar, query, linkPostingRule],
  );

  const actionSuggestHashTag = useCallback(
    async (str: any, caId: any) => {
      const searchStr = queryString.stringify({
        caId,
        search: str.trimLeft(),
      });

      let tempUrl = '';
      if (!str) {
        return;
      }
      if (!caId) {
        enqueueSnackbar(
          'Bạn chưa chọn dịch vụ cho bài viết!',
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
      }
      tempUrl = `${API_PATHS.suggestHashTags}?${searchStr}`;
      const json = await dispatch(fetchThunk(tempUrl, 'post'));
      // eslint-disable-next-line consistent-return
      return json?.data?.content;
    },
    [closeSnackbar, dispatch, enqueueSnackbar],
  );

  const outsideRange = (e: Moment, start?: Moment) =>
    start
      ? start.startOf('day').isAfter(e)
      : moment()
          .startOf('day')
          .isAfter(e);

  const resetFlightListInit = useCallback(() => {
    dispatch(setFlightList([]));
  }, [dispatch]);

  useEffect(() => {
    setFilter({ ...filter, status: 1 });
    if (query?.postId) {
      getAdminPostDetail(query?.postId);
    }
    if (filterParams?.type && !query?.postId) {
      setPostData({ ...postData, type: filterParams?.type, serviceType: SERVICE_TYPE.HOTEL });
    }
    resetFlightListInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCheckCaId = useCallback((caId: number) => {
    if (!caId) {
      setIsRequiredCA(true);
    }
  }, []);

  const checkHotelTags = tags => {
    for (const item of tags) {
      if (isEmpty(item.value)) {
        return true;
      }
      if (item.value && isNumeric(item.value) && Number(item.value) <= 0) {
        return true;
      }
    }
    return false;
  };

  const validateButtonPreview = (dataForm: any) => {
    if (isPostTypeItem) {
      if (isEmpty(dataForm?.hotelId)) {
        dispatch(setNotistackMessage('Vui lòng chọn khách sạn!', 'warning'));
        return true;
      }
      if (isEmpty(dataForm?.hotelAction)) {
        dispatch(setNotistackMessage('Vui lòng chọn hành động!', 'warning'));
        return true;
      }
      if (checkHotelTags(dataForm?.hotelTags)) {
        dispatch(
          setNotistackMessage('Giá trị của các Tag phải nhập chữ hoặc số dương!', 'warning'),
        );
        return true;
      }
      if (isEmpty(dataForm?.hotelVideoItem)) {
        dispatch(setNotistackMessage('Vui lòng thêm 1 video!', 'warning'));
        return true;
      }
    }
    return false;
  };

  const getValidateTypeDefault = () => {
    return {
      content: yup
        .string()
        .nullable()
        .max(10000, 'Nhập tối đa 10.000 ký tự')
        .trim(),
    };
  };

  const getValidateTypeVideo = () => {
    return {
      title: yup
        .string()
        .nullable()
        .max(80, 'Nhập tối đa 80 ký tự')
        .trim(),
      content: yup
        .string()
        .nullable()
        .max(10000, 'Nhập tối đa 10.000 ký tự')
        .trim(),
    };
  };

  const getValidateTypeItem = () => {
    return {
      hotelId: yup.number().required('Vui lòng chọn khách sạn'),
      hotelOriginPrice: yup
        .number()
        .typeError('Vui lòng nhập giá hiển thị')
        .required('Vui lòng nhập giá hiển thị')
        .min(1, 'Vui lòng nhập giá hiển thị')
        .max(999999999, 'Giá hiển thị tối đa là 999999999'),
      hotelAction: yup.string().required('Vui lòng chọn hành động'),
      hotelVideoItem: yup.string().required('Vui lòng thêm 1 video'),
      hotelImageItem: yup.string().required('Vui lòng thêm 1 ảnh đại diện'),
      hotelPostIds: yup
        .array()
        .required('Vui lòng chọn bài viết liên quan nổi bật')
        .min(1, 'Tối tối 1 bài viết liên quan nổi bật')
        .max(3, 'Tối đa 3 bài viết liên quan nổi bật'),
    };
  };

  const getSchema = React.useMemo(() => {
    const schemaTypeDefault = isPostTypeDefault ? getValidateTypeDefault() : {};
    const schemaTypeVideo = isPostTypeVideo ? getValidateTypeVideo() : {};
    const schemaTypeItem = isPostTypeItem ? getValidateTypeItem() : {};
    let result: some = {};
    result = {
      ...schemaTypeDefault,
      ...schemaTypeVideo,
      ...schemaTypeItem,
      caId: yup
        .string()
        .typeError('Vui lòng chọn kênh chia sẻ')
        .required('Vui lòng chọn kênh chia sẻ'),
      datePosted: yup.string().when('isScheduleSetup', {
        is: value => value === true,
        then: yup.string().required(intl.formatMessage({ id: 'required' })),
      }),
      timePosted: yup.string().when('isScheduleSetup', {
        is: value => value === true,
        then: yup.string().required(intl.formatMessage({ id: 'required' })),
      }),
      reasonDeny: denyPost
        ? yup
            .string()
            .trim()
            .min(10, 'Vui lòng nhập từ 10 - 255 ký tự')
            .max(255, 'Vui lòng nhập từ 10 - 255 ký tự')
        : undefined,
      linkPostingRule: denyPost
        ? yup
            .string()
            .nullable()
            .trim()
            .required('Vui lòng nhập link')
        : undefined,
    };
    return result;
  }, [denyPost, intl, isPostTypeDefault, isPostTypeVideo, isPostTypeItem]);

  const storeSchema = yup.object().shape(getSchema);

  const resetFormPost = () => {
    setContentPost('');
    setListMedias([]);
    setHotelList([]);
    resetFlightListInit();
    setShowServiceType(false);
    setIsDisableSave(false);
  };

  const resetByChangeTypePost = () => {
    resetFormPost();
  };

  const validateCustom = (values: some) => {
    const errors: some = {};

    if (
      moment(`${values?.datePosted} ${values?.timePosted}`, DATE_TIME_HOUR_FORMAT).isBefore(
        Date.now(),
      )
    ) {
      enqueueSnackbar(
        intl.formatMessage({ id: 'IDS_HMS_TIME_ERROR' }),
        snackbarSetting(key => closeSnackbar(key), { color: 'error' }),
      );
      errors.schedulePost = intl.formatMessage({
        id: 'IDS_HMS_TIME_ERROR',
      });
    }

    return errors;
  };

  const handleDefaultViewLayout = numOfList => {
    switch (numOfList) {
      case 2:
        return MEDIA_LAYOUT.GRID_TWO_A;
      case 3:
        return MEDIA_LAYOUT.GRID_THREE_A;
      case 4:
        return MEDIA_LAYOUT.GRID_FOUR_A;
      case 5:
        return MEDIA_LAYOUT.GRID_FIVE_A;

      default:
        return MEDIA_LAYOUT.SLIDE_LEGACY;
    }
  };

  const handleAddMedias = useCallback((list, setFieldValue) => {
    setFieldValue('layout', handleDefaultViewLayout(list?.length), true);
    setListMedias([...list]);
  }, []);

  return (
    <>
      <Formik
        enableReinitialize
        validationSchema={storeSchema}
        initialValues={postData?.publishedAt ? { ...postData, isScheduleSetup: true } : postData}
        validateOnChange={false}
        validate={values => {
          validateCustom({
            ...values,
            timePosted: disabledSchedulePost ? TIME_DEFAULT : values?.timePosted,
            datePosted: disabledSchedulePost
              ? moment(new Date())
                  .add(1, 'days')
                  .format(DATE_FORMAT_BACK_END)
              : values?.datePosted,
          });
        }}
        onSubmit={(values, { setErrors }) => {
          if (isPostTypeDefault && isEmpty(listMedias) && !values.content) {
            dispatch(setNotistackMessage('Vui lòng thêm nội dung hoặc thêm ảnh/video!', 'warning'));
            return;
          }
          if (isPostTypeVideo && isEmpty(listMedias)) {
            setErrors({ mediaInfos: 'Vui lòng thêm 1 video cho bài viết loại video' });
            return;
          }
          if (isPostTypeItem) {
            if (checkHotelTags(values?.hotelTags)) {
              dispatch(
                setNotistackMessage('Giá trị của các Tag phải nhập chữ hoặc số dương!', 'warning'),
              );
              return;
            }
            if (!isEmpty(values?.hotelReviews) && values?.hotelReviews?.length > 3) {
              dispatch(setNotistackMessage('Tối đa 3 đánh giá nổi bật!', 'warning'));
              return;
            }
            if (isEmpty(values?.hotelReviews) && values?.hotelReviewsOriginTotal > 0) {
              dispatch(
                setNotistackMessage(
                  `Vui lòng thêm đánh giá nổi bật, vì khách sạn đang có ${values?.hotelReviewsOriginTotal} đánh giá!`,
                  'warning',
                ),
              );
              return;
            }
          }

          if (!values?.caId) {
            onCheckCaId(values?.caId);
            return;
          }

          if (query && query?.postId) {
            values?.isScheduleSetup ? putAdmin(values) : putAdmin({ ...values, publishedAt: null });
          } else {
            postAdmin(values);
          }
        }}
      >
        {({ values, errors, setFieldValue, resetForm, submitCount }) => {
          const numberPublishedAt = moment(
            postData?.publishedAt,
            DATE_FORMAT_C_DATE_HOUR,
          ).valueOf();
          const numberNow = moment(new Date(), DATE_FORMAT_C_DATE_HOUR).valueOf();

          if (postData?.status === 'APPROVED' && numberPublishedAt < numberNow) {
            setDisabledSchedulePost(true);
          }

          let colorStatus;
          if (postData?.status === 'WAITING') {
            colorStatus = ORANGE_400;
          } else if (postData?.status === 'APPROVED') {
            colorStatus = GREEN_500;
          } else {
            colorStatus = RED;
          }

          return (
            <Form className="form-create-update-article">
              <Col>
                {filterParams?.postId && (
                  <Paper style={{ padding: '16px 12px' }}>
                    <Row style={{ marginTop: 8, flexWrap: 'wrap' }}>
                      <Grid item xs={1} style={{ marginBottom: 12 }}>
                        <Typography variant="caption" style={{ color: BLACK_400 }}>
                          Loại
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          style={{ color: BLACK_500, padding: '4px 0px 8px' }}
                        >
                          {POST_TYPE_OPTIONS?.find(element => element?.id === postData?.type)?.name}
                        </Typography>
                      </Grid>

                      <Grid item xs={2} style={{ marginBottom: 12 }}>
                        <Typography variant="caption" style={{ color: BLACK_400 }}>
                          Người tạo
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          style={{ color: BLACK_500, padding: '4px 0px 8px' }}
                        >
                          {postData?.createdByName}
                        </Typography>
                      </Grid>
                      <Grid item xs={1} style={{ marginBottom: 12 }}>
                        <Typography variant="caption" style={{ color: BLACK_400 }}>
                          Post ID
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          style={{ color: BLACK_500, padding: '4px 0px 8px' }}
                        >
                          {postData?.id}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} style={{ marginBottom: 12 }}>
                        <Typography variant="caption" style={{ color: BLACK_400 }}>
                          Mã tài khoản
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          style={{
                            color: BLACK_500,
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px 0px 8px',
                          }}
                        >
                          {postData?.userId}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} style={{ marginBottom: 12 }}>
                        <Typography variant="caption" style={{ color: BLACK_400 }}>
                          Thời gian tạo
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          style={{
                            color: BLACK_500,
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px 0px 8px',
                          }}
                        >
                          {moment(postData?.createdAt).format(DATE_FORMAT_SHOW)}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        style={{ marginBottom: 12, display: 'flex', flexDirection: 'column' }}
                      >
                        <Typography variant="caption" style={{ color: BLACK_400 }}>
                          Lịch sử chỉnh sửa
                        </Typography>
                        <ButtonBase
                          style={{ display: 'flex', justifyContent: 'flex-start' }}
                          onClick={() => onHistoryPost(true)}
                        >
                          <Typography
                            variant="body2"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '4px 0px 8px',
                              color: PRIMARY,
                            }}
                          >
                            Xem lịch sử
                          </Typography>
                        </ButtonBase>
                      </Grid>
                      <Grid item xs={2} style={{ marginBottom: 12 }}>
                        <Typography variant="caption" style={{ color: BLACK_400 }}>
                          Trạng thái
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          style={{
                            color: colorStatus,
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px 0px 8px',
                          }}
                        >
                          {postData?.status === 'WAITING' && 'Chờ duyệt'}
                          {postData?.status === 'APPROVED' && 'Đã duyệt'}
                          {postData?.status === 'DENIED' && 'Bị chặn'}
                        </Typography>
                      </Grid>
                    </Row>
                    <Divider />

                    {/* B2C (dinogo/mytour)  */}
                    {postData?.status === 'APPROVED' && (
                      <Box width="100%" display="flex" justifyContent="flex-end" mt={3 / 2}>
                        <Box>
                          <LoadingButton
                            onClick={() => {
                              onDenyPost(true);
                              getPostingRuleByCaId();
                            }}
                            variant="contained"
                            size="large"
                            style={{ minWidth: 120 }}
                            color="primary"
                            disableElevation
                          >
                            Chặn bài viết
                          </LoadingButton>
                        </Box>
                      </Box>
                    )}

                    {/* B2B (tripi partner)  */}
                    {postData?.status === 'WAITING' && (
                      <Box width="100%" display="flex" justifyContent="space-between" mt={3 / 2}>
                        <Button onClick={() => {}} color="primary" style={{}}>
                          <IconPendingPost />
                          <Typography
                            variant="body2"
                            style={{
                              color: RED_200,
                              marginLeft: 32,
                            }}
                          >
                            Bài viết đang chờ duyệt
                          </Typography>
                        </Button>
                        <Box>
                          <LoadingButton
                            onClick={() => {
                              onDenyPost(true);
                              getPostingRuleByCaId();
                            }}
                            variant="outlined"
                            size="large"
                            style={{ minWidth: 120, marginRight: 16 }}
                            color="primary"
                            disableElevation
                          >
                            <Typography variant="body2">Chặn bài viết</Typography>
                          </LoadingButton>
                          <LoadingButton
                            onClick={() => {
                              onApprovePost(true);
                            }}
                            variant="contained"
                            size="large"
                            style={{ minWidth: 120 }}
                            color="primary"
                            disableElevation
                          >
                            <Typography variant="body2">Đồng ý duyệt bài</Typography>
                          </LoadingButton>
                        </Box>
                      </Box>
                    )}
                  </Paper>
                )}

                {query && !query?.postId && (
                  <Paper className="pager-section-form">
                    <Row style={{ justifyContent: 'space-between' }}>
                      <FormControlLabel
                        style={{ maxWidth: 150 }}
                        control={<></>}
                        label={
                          <Typography
                            variant="body2"
                            style={{ fontWeight: 'bold', marginLeft: 12 }}
                          >
                            Kiểu hiển thị
                          </Typography>
                        }
                      />

                      <FormControl component="fieldset">
                        <RadioGroup
                          row
                          name="type"
                          value={(values as any).type}
                          onChange={e => {
                            const tempPostType = (e.target as HTMLInputElement).value;
                            setFieldValue('type', tempPostType);

                            let tempServiceType = SERVICE_TYPE.ARTICLE;
                            if (tempPostType === POST_TYPE.ITEM) {
                              tempServiceType = SERVICE_TYPE.HOTEL;
                            }
                            setPostData({
                              ...postData,
                              type: tempPostType,
                              serviceType: tempServiceType,
                            });
                            resetByChangeTypePost();
                          }}
                        >
                          <FormControlLabel
                            key={POST_TYPE.DEFAULT}
                            value={POST_TYPE.DEFAULT}
                            control={<Radio size="small" color="primary" />}
                            label={<Typography variant="body2">Mặc định</Typography>}
                          />
                          <FormControlLabel
                            key={POST_TYPE.VIDEO}
                            value={POST_TYPE.VIDEO}
                            control={<Radio size="small" color="primary" />}
                            label={<Typography variant="body2">Video</Typography>}
                          />
                          <FormControlLabel
                            key={POST_TYPE.ITEM}
                            value={POST_TYPE.ITEM}
                            control={<Radio size="small" color="primary" />}
                            label={<Typography variant="body2">Item</Typography>}
                          />
                        </RadioGroup>
                      </FormControl>
                    </Row>
                  </Paper>
                )}

                {isPostTypeItem && (
                  <PostTypeItem
                    caIdList={caIdList}
                    listMedias={listMedias}
                    hotelItem={hotelItemOrigin}
                    hotelList={hotelList}
                    setHotelList={setHotelList}
                  />
                )}

                {(isPostTypeDefault || isPostTypeVideo) && (
                  <Paper className="pager-section-form">
                    {isPostTypeVideo && (
                      <>
                        <Row
                          style={{
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: 16,
                            marginBottom: 10,
                            maxWidth: '100%',
                          }}
                        >
                          <Typography variant="subtitle1">Tiêu đề</Typography>

                          {errors.title && submitCount > 0 ? (
                            <Typography variant="body2" style={{ color: RED }}>
                              {errors.title}
                            </Typography>
                          ) : (
                            <Typography variant="body2" style={{ color: BLACK_400 }}>
                              {messageTitle}
                            </Typography>
                          )}
                        </Row>
                        <Row>
                          <FieldTextContent
                            name="title"
                            onChange={event => {
                              setFieldValue('title', event.target.value);
                              setMessageTitle(`${event.target.value?.length} /80 kí tự`);
                            }}
                            label={null}
                            inputProps={{ maxLength: 80, autoComplete: 'off' }}
                            formControlStyle={{ width: '100%', marginRight: 0 }}
                            style={{ width: '100%' }}
                            optional
                          />
                        </Row>
                      </>
                    )}

                    <Row
                      style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: 16,
                        marginBottom: 0,
                        maxWidth: '100%',
                      }}
                    >
                      <Typography variant="subtitle1" style={{}}>
                        Nội dung
                      </Typography>
                      <div>
                        {errors.content && submitCount > 0 ? (
                          <Typography variant="body2" style={{ color: RED }}>
                            {errors.content}
                          </Typography>
                        ) : (
                          <Typography variant="body2" style={{ color: BLACK_400 }}>
                            {messageContent}
                          </Typography>
                        )}
                      </div>
                    </Row>
                    <Row
                      style={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box width="100%">
                        <div>
                          <TextAreaMentions
                            className={classes.myTextarea}
                            value={contentPost}
                            mentionUsers={mentionUsers}
                            hashTag={actionSuggestHashTag}
                            onChange={val => {
                              if (val.length <= 10000) {
                                setMessageContent(`${val.length} /10.000 kí tự`);
                                setContentPost(val);
                                setFieldValue('content', val, true);
                              }
                            }}
                          />
                        </div>
                      </Box>
                    </Row>

                    <Col>
                      <Typography variant="body2" style={{ margin: '32px 20px 8px 0px' }}>
                        Chọn kênh chia sẻ
                      </Typography>
                      <FormControlAutoComplete<some>
                        value={caIdList?.find((v: some) => v.id === values?.caId) || null}
                        formControlStyle={{ width: 400 }}
                        placeholder="Chọn kênh chia sẻ"
                        onChange={(e: any, value: some | null) => {
                          setFieldValue('caId', value?.id, true);
                          value?.id && setIsRequiredCA(false);
                        }}
                        options={caIdList as some[]}
                        getOptionLabel={(one: some) => one.name}
                        optional
                        errorMessage={errors.caId && String(errors.caId)}
                        disabled={
                          !!filterParams?.postId || !isEmpty(listMedias) || numberMediaBefore > 0
                        }
                      />
                      {isRequiredCA && (
                        <Typography variant="body2" style={{ color: RED }}>
                          Bạn cần lựa chọn kênh chia sẻ trước khi tiếp tục!
                        </Typography>
                      )}
                    </Col>
                  </Paper>
                )}

                {isPostTypeDefault && (
                  <Paper
                    style={{
                      margin: '10px 0px',
                      backgroundColor: '#F7F7F7',
                    }}
                  >
                    <Row
                      style={{
                        backgroundColor: 'white',
                        padding: '16px 12px',
                        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      <Typography variant="subtitle1">Thêm ảnh / video</Typography>
                      <Typography variant="body2" style={{ color: GREY_400, marginLeft: 4 }}>
                        (tối đa 5 ảnh và video, hỗ trợ định dạng JPEG, PNG, GIF, MP4, AVI, MOV, FLV)
                      </Typography>
                    </Row>

                    <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ padding: '16px 12px', overflow: 'auto' }}>
                        {values?.caId ? (
                          <DndPhotos
                            cardID={values?.caId ? values?.caId : 0}
                            label="Tải lên Ảnh/Video"
                            listMedias={listMedias}
                            setListMedias={(list: some[]) => {
                              handleAddMedias(list, setFieldValue);
                            }}
                            isChecked={[]}
                            handleRemoveItem={(mediaItem: any) => {
                              if (mediaItem) {
                                const tempCreate = listMedias.findIndex(
                                  ele => ele?.createdAt === mediaItem.createdAt,
                                );
                                listMedias.splice(tempCreate, 1);
                                setListMedias([...listMedias]);
                                setFieldValue(
                                  'layout',
                                  handleDefaultViewLayout(listMedias?.length),
                                  true,
                                );
                              }
                            }}
                            setTempListPhoto={list => {
                              setListMedias([...list]);
                              if (list?.length !== listMedias?.length) {
                                setFieldValue(
                                  'layout',
                                  handleDefaultViewLayout(listMedias?.length),
                                  true,
                                );
                              }
                            }}
                            maxNumberFile={5}
                            fileType="media"
                            setNumberMediaBefore={setNumberMediaBefore}
                          />
                        ) : (
                          <ButtonPhotos
                            label="Tải lên Ảnh/Video"
                            onClick={() => onCheckCaId(values?.caId)}
                          />
                        )}
                      </div>
                      <MediaLayoutReview
                        mediaList={listMedias}
                        layout={values?.layout}
                        onSelectedLayout={(layout: string) => {
                          setFieldValue('layout', layout, true);
                        }}
                      />
                    </Row>
                  </Paper>
                )}

                {isPostTypeVideo && (
                  <Paper
                    style={{
                      margin: '10px 0px',
                      backgroundColor: '#F7F7F7',
                    }}
                  >
                    <Row
                      style={{
                        backgroundColor: 'white',
                        padding: '16px 12px',
                        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      <Typography variant="subtitle1">Thêm video</Typography>
                      <Typography variant="body2" style={{ color: GREY_400, marginLeft: 4 }}>
                        (tối đa 1 video, thời lượng 5 giây - 3 phút)
                      </Typography>
                    </Row>

                    <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          padding: '16px 12px',
                          height: 'auto',
                          overflow: 'auto',
                        }}
                      >
                        {values?.caId ? (
                          <DndPhotos
                            cardID={values?.caId ? values?.caId : 0}
                            label="Tải lên Video"
                            listMedias={listMedias}
                            setListMedias={(list: some[]) => {
                              handleAddMedias(list, setFieldValue);
                            }}
                            isChecked={[]}
                            handleRemoveItem={(mediaItem: any) => {
                              if (mediaItem) {
                                const tempCreate = listMedias.findIndex(
                                  ele => ele?.createdAt === mediaItem.createdAt,
                                );
                                listMedias.splice(tempCreate, 1);
                                setListMedias([...listMedias]);
                                setFieldValue(
                                  'layout',
                                  handleDefaultViewLayout(listMedias?.length),
                                  true,
                                );
                              }
                            }}
                            setTempListPhoto={list => {
                              setListMedias([...list]);
                              if (list?.length !== listMedias?.length) {
                                setFieldValue(
                                  'layout',
                                  handleDefaultViewLayout(listMedias?.length),
                                  true,
                                );
                              }
                            }}
                            maxNumberFile={1}
                            fileType="video"
                            checkPostTypeVideo
                            setNumberMediaBefore={setNumberMediaBefore}
                          />
                        ) : (
                          <ButtonPhotos
                            label="Tải lên Video"
                            onClick={() => onCheckCaId(values?.caId)}
                          />
                        )}
                      </div>
                    </Row>
                    {errors.mediaInfos && submitCount > 0 && isEmpty(listMedias) && (
                      <Row style={{ padding: 15 }}>
                        <Typography variant="body2" style={{ color: RED }}>
                          {errors.mediaInfos}
                        </Typography>
                      </Row>
                    )}
                  </Paper>
                )}

                {/* Services */}
                {(isPostTypeDefault || isPostTypeVideo) && (
                  <Paper
                    style={{
                      margin: '10px 0px',
                      backgroundColor: '#F7F7F7',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: 'white',
                        padding: '16px 12px',
                        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Row style={{ justifyContent: 'space-between', marginBottom: 20 }}>
                        <Typography variant="subtitle1">Dịch vụ đính kèm</Typography>
                        <IOSSwitch
                          checked={showServiceType}
                          onChange={() => {
                            if (!values?.caId) {
                              onCheckCaId(values?.caId);
                              return;
                            }
                            setShowServiceType(!showServiceType);
                          }}
                        />
                      </Row>
                      {showServiceType && (
                        <CardInfo
                          countFlight={flightList?.length}
                          serviceType={values?.serviceType}
                          onChange={(serviceType: string) => {
                            setFieldValue('serviceType', serviceType);
                          }}
                          isHideHotel={false}
                          isHideFlight={isPostTypeVideo}
                          isHideTrain={isPostTypeVideo}
                          isHideActivity={isPostTypeVideo}
                        />
                      )}
                    </div>
                    {showServiceType && (
                      <>
                        {values.serviceType === SERVICE_TYPE.HOTEL && showServiceType && (
                          <HotelServices
                            arraySelect={arraySelect}
                            setArraySelect={setArraySelect}
                            setHotelList={setHotelList}
                            hotelList={hotelList}
                            serviceNumber={isPostTypeVideo ? 1 : 5}
                          />
                        )}
                        {values.serviceType === SERVICE_TYPE.FLIGHT && showServiceType && (
                          <FightServices
                            caId={values?.caId || 0}
                            serviceNumber={isPostTypeVideo ? 1 : 5}
                            onChangePrice={onChangeItemPrice}
                            sortedList={updateSortedFlightList}
                          />
                        )}
                      </>
                    )}
                  </Paper>
                )}

                {/* Setup schedule */}
                <Paper className="pager-section-form">
                  <Row>
                    <FormControlLabel
                      style={{ maxWidth: 150, marginTop: 20 }}
                      control={<></>}
                      label={
                        <Typography variant="body2" style={{ fontWeight: 'bold', marginLeft: 12 }}>
                          <FormattedMessage id="IDS_SAP_SETUP_SHARING" />
                        </Typography>
                      }
                    />
                  </Row>
                  <Divider style={{ margin: '15px 0px' }} />
                  <Row style={{ justifyContent: 'space-between' }}>
                    <FormControlLabel
                      style={{ marginLeft: 15, marginTop: -15 }}
                      control={
                        <Checkbox
                          size="small"
                          checked={values.isScheduleSetup}
                          color="primary"
                          onChange={e => {
                            setFieldValue(`isScheduleSetup`, e.target.checked);
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2">
                          <FormattedMessage id="IDS_SAP_POST_DISPLAY_SETTING" />
                        </Typography>
                      }
                      disabled={disabledSchedulePost}
                    />
                    <div className="flex-row">
                      <DateField
                        label={null}
                        style={{ width: 80, marginRight: 12 }}
                        optional
                        date={
                          values.datePosted
                            ? moment(values.datePosted, DATE_FORMAT_BACK_END)
                            : moment(new Date(), DATE_FORMAT_BACK_END).add(1, 'days')
                        }
                        onChange={(date?: Moment) => {
                          if (date) setFieldValue(`datePosted`, date.format(DATE_FORMAT_BACK_END));
                        }}
                        isOutsideRange={outsideRange}
                        errorMessage={
                          submitCount > 0 && (errors as some).datePosted
                            ? (errors as some).datePosted
                            : ''
                        }
                        disabled={disabledSchedulePost}
                        onFocus={setIsFocusedDatePicker}
                      />
                      <SelectTimeCheck
                        time={values.timePosted || ''}
                        onChangeTime={value => {
                          setFieldValue('timePosted', value);
                        }}
                        errorMessage={
                          submitCount > 0 && (errors as some).timePosted
                            ? (errors as some).timePosted
                            : ''
                        }
                        disabled={disabledSchedulePost}
                      />
                    </div>
                  </Row>

                  <Row>
                    <FormControlLabel
                      style={{ marginLeft: 15 }}
                      control={
                        <Checkbox
                          size="small"
                          checked={values.shareable}
                          color="primary"
                          onChange={e => {
                            setFieldValue(`shareable`, e.target.checked);
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2">
                          <FormattedMessage id="IDS_SAP_ALLOW_SHARING" />
                        </Typography>
                      }
                    />
                  </Row>
                </Paper>

                <Row
                  style={{
                    marginTop: 20,
                    justifyContent: 'space-between',
                    marginBottom: isFocusedDatePicker ? 170 : 0,
                  }}
                >
                  <LoadingButton
                    loading={loading}
                    variant="outlined"
                    size="large"
                    style={{ minWidth: 120 }}
                    disableElevation
                    onClick={() => dispatch(goBack())}
                  >
                    <Typography variant="body2" color="textSecondary">
                      <FormattedMessage id="cancel" />
                    </Typography>
                  </LoadingButton>
                  <Row>
                    <LoadingButton
                      disabled={values?.constructor === Object && !Object.keys(values).length}
                      loading={loading}
                      variant="outlined"
                      size="large"
                      style={{ minWidth: 120, marginRight: 25 }}
                      disableElevation
                      onClick={() => {
                        if (!validateButtonPreview(values)) {
                          setOpenPreview(true);
                        }
                      }}
                    >
                      Xem trước
                    </LoadingButton>
                    <LoadingButton
                      loading={loading}
                      type="submit"
                      variant="contained"
                      size="large"
                      style={{ minWidth: 120 }}
                      color="primary"
                      disableElevation
                      disabled={isDisableSave}
                    >
                      Chia sẻ bài viết ngay
                    </LoadingButton>
                  </Row>
                </Row>
              </Col>
              <PreviewHotel
                open={openPreview}
                setOpen={setOpenPreview}
                postPreview={values}
                hotelList={hotelList}
                listPhotos={listMedias}
                loading={loading}
              />

              <Dialog
                open={openDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle>
                  <Typography variant="subtitle1">Tạo bài viết thành công</Typography>
                  {filterParams?.postId && (
                    <IconButton
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        padding: 0,
                      }}
                      onClick={() => setOpenDialog(false)}
                    >
                      <IconClose />
                    </IconButton>
                  )}
                </DialogTitle>
                <Divider />
                <DialogContent>
                  <Box width="100%" display="flex" justifyContent="center">
                    <IconShape />
                  </Box>
                  <DialogContentText>
                    <Typography variant="body1">
                      Bài viết đã được tạo thành công với trạng thái “Đã duyệt” và được hiển thị
                      công khai
                    </Typography>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Box width="100%" display="flex" justifyContent="space-between">
                    <Button
                      onClick={() => {
                        dispatch(push('/'));
                        setOpenDialog(false);
                      }}
                      color="primary"
                    >
                      Quản lý bài viết
                    </Button>
                    <LoadingButton
                      onClick={() => {
                        dispatch(push('/article/create'));
                        setOpenDialog(false);
                        resetFormPost();
                        resetForm();
                      }}
                      variant="contained"
                      size="large"
                      style={{ minWidth: 120 }}
                      color="primary"
                      disableElevation
                    >
                      Thêm bài viết khác
                    </LoadingButton>
                  </Box>
                </DialogActions>
              </Dialog>
              <ConfirmDialog
                open={approvePost}
                onAccept={() => {
                  putApprovePost(true);
                  onApprovePost(false);
                }}
                titleLabel={
                  <Typography
                    variant="h6"
                    style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'center' }}
                  >
                    Bạn đã duyệt bài viết?
                  </Typography>
                }
                onClose={() => onApprovePost(false)}
                onReject={() => onApprovePost(false)}
              >
                <Typography variant="body2" style={{ display: 'flex', justifyContent: 'center' }}>
                  Bài viết đã được đăng thành công
                </Typography>
              </ConfirmDialog>

              <DiaglogDenyPost
                open={denyPost}
                linkPostingRule={linkPostingRule}
                setLinkPostingRule={setLinkPostingRule}
                onAccept={() => {
                  putApprovePost(false, values);
                  onDenyPost(false);
                }}
                onClose={() => onDenyPost(false)}
                onReject={() => onDenyPost(false)}
              />
              <DialogHistoryPost open={historyPost} onClose={() => onHistoryPost(false)} />
            </Form>
          );
        }}
      </Formik>
      <LoadingBox loading={loading} style={{ bottom: 'auto' }} />
    </>
  );
};

export default React.memo(CreateUpdateArticleTable);
