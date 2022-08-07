import {
  Avatar,
  Button,
  Grid,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import { API_PATHS, getBaseUrlWebApp } from 'configs/API';
import { BLACK_500, PINK, PRIMARY, RED, BLACK_400, WHITE } from 'configs/colors';
import { Form, Formik } from 'formik';
import { DATE_FORMAT_TIME } from 'modules/social-admin/follower/constants';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { Action } from 'typesafe-actions';
import * as Yup from 'yup';
import { some, isEmpty } from 'configs/utils';
import imageDefault from 'images/img_hotel_default.jpg';
import { snackbarSetting } from 'modules/common/components/elements';
import LoadingButton from 'modules/common/components/LoadingButton';
import { fetchThunk } from 'modules/common/redux/thunk';
import { CA_INFO } from 'modules/auth/constants';
import { replaceURLWithHTMLLinks } from 'modules/social-admin/utils/helpers/helpers';
import { getTagUserPost } from '../../constants';
import { TYPE_OF_INTERACTION_RESPOND } from '../constants';

interface Props {
  readList: some[];
  hadelCloseDialog: () => void;
}
const DialogContentRead: React.FC<Props> = ({ readList, hadelCloseDialog }) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [messageContent, setMessageContent] = useState<string>();
  const [commentsRepliesHistory, setCommentsRepliesHistory] = useState<some[]>([]);
  const [expanded, setExpanded] = useState<string | false>('');
  const dataRead = !isEmpty(readList) ? readList[0] : undefined;

  const fetchCommentsRepliesHistory = useCallback(
    async (postId: number) => {
      const json = await dispatch(
        fetchThunk(`${API_PATHS.getAdminCommentsRepliesHistory}?postId=${postId}`, 'get'),
      );
      if (json?.code === 200) {
        setCommentsRepliesHistory(json?.data?.content || []);
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
    [closeSnackbar, dispatch, enqueueSnackbar],
  );

  useEffect(() => {
    fetchCommentsRepliesHistory(dataRead?.postId);
  }, [fetchCommentsRepliesHistory, dataRead]);

  const actionSearchUser = useCallback(
    async (str: any) => {
      const tempUrl = `${API_PATHS.suggestUsers}?search=${str.trimLeft()}`;
      const json = await dispatch(fetchThunk(tempUrl, 'post'));
      return json?.data?.content;
    },
    [dispatch],
  );

  const putApprovePost = useCallback(
    async (params: some) => {
      const url = `${API_PATHS.updateNotificationsRespond}`;
      const json = await dispatch(fetchThunk(url, 'put', JSON.stringify(params), false));
      if (json?.code === 200) {
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
    [closeSnackbar, dispatch, enqueueSnackbar],
  );

  const getDataMentionUser = (userObject: any) => {
    const dataMentionUser: some[] = [];
    if (!isEmpty(userObject)) {
      dataMentionUser.push({ id: Number(userObject?.id), name: userObject?.name || '' });
    }
    return dataMentionUser;
  };

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const Item = ({ entity: { name } }) => (
    <>
      <Typography variant="body2" style={{}}>
        {name}
      </Typography>
    </>
  );

  const storeSchema = Yup.object().shape({
    content: Yup.string()
      .required('Không được để trống !')
      .max(2200, 'Nhập tối đa 2.200 kí tự !'),
  });

  const webBaseUrl = getBaseUrlWebApp();
  let webAppFeedUrl = `${webBaseUrl}/partner/feed/${dataRead?.postId}`;
  const caName = CA_INFO?.find(element => element?.id === dataRead?.caId)?.name;
  if (caName === 'Dinogo') {
    webAppFeedUrl = `${webBaseUrl}/dinogo/feed/${dataRead?.postId}`;
  }
  if (caName === 'Mytour') {
    webAppFeedUrl = `${webBaseUrl}/mytour/feed/${dataRead?.postId}`;
  }

  const isDisabledRespond = !TYPE_OF_INTERACTION_RESPOND.includes(dataRead?.event);
  const respondIds = !isEmpty(readList) ? readList.map(r => r?.id) : [];

  return (
    <div className="notification-dialogContentRead">
      <Formik
        initialValues={{ content: '' }}
        validationSchema={storeSchema}
        onSubmit={async values => {
          putApprovePost({ ...values, ids: respondIds, content: values?.content });
          hadelCloseDialog();
        }}
      >
        {({ values, setFieldValue, errors }) => {
          return (
            <Form>
              <div style={{ width: 720, padding: 16 }}>
                <Typography
                  variant="subtitle1"
                  style={{ color: BLACK_500, marginBottom: 15, textAlign: 'center' }}
                >
                  Bài viết
                </Typography>
                <Grid container style={{ marginBottom: 24 }}>
                  <Grid item xs={2}>
                    {dataRead?.post?.thumbnail ? (
                      <Avatar
                        variant="rounded"
                        src={dataRead?.post?.thumbnail}
                        style={{ width: 128, height: 128, borderRadius: 10 }}
                      />
                    ) : (
                      <Avatar
                        variant="rounded"
                        src={imageDefault}
                        style={{ width: 128, height: 128, borderRadius: 10 }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={10}>
                    <div
                      style={{
                        padding: 10,
                        marginLeft: 10,
                        height: 100,
                        boxSizing: 'border-box',
                        overflowY: 'auto',
                      }}
                    >
                      <Typography variant="body2">{dataRead?.post?.content}</Typography>
                    </div>
                    <div style={{ textAlign: 'right', marginTop: 15 }}>
                      <a
                        href={webAppFeedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: PRIMARY,
                          fontSize: 17,
                          textDecoration: 'none',
                        }}
                      >
                        Xem bài viết
                      </a>
                    </div>
                  </Grid>
                </Grid>

                <Grid container style={{ marginBottom: 24 }}>
                  <div className="wrapper-accordion">
                    <Typography variant="subtitle1" style={{ color: BLACK_500 }}>
                      Lịch sử bình luận ({commentsRepliesHistory?.length})
                    </Typography>
                  </div>

                  {!isEmpty(commentsRepliesHistory) &&
                    commentsRepliesHistory?.map((item: any, index: number) => {
                      return (
                        <Accordion
                          key={index}
                          expanded={expanded === `panel-${index}`}
                          onChange={handleChange(`panel-${index}`)}
                          style={{ width: '100%' }}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <div className="accordion-head">
                              <div className="accordion-head-time">
                                <span className="datetime">
                                  {item?.comment?.createdAt &&
                                    moment(item?.comment?.createdAt).format(DATE_FORMAT_TIME)}
                                </span>
                              </div>
                              <div className="accordion-head-mention flex-row">
                                <span className="accordion-head-mention-app user-mention text-primary mr-4">
                                  {item?.userOrg?.org?.name}
                                </span>
                                <span className="accordion-head-mention-dot mr-4"> • </span>
                                <span className="accordion-head-mention-admin mr-4">
                                  @{item?.userOrg?.orgRole?.name}
                                </span>
                                <span className="accordion-head-mention-reply mr-4">
                                  Đã trả lời:
                                </span>
                                <div className="accordion-head-mention-user-list">
                                  {!isEmpty(item?.replyTos) &&
                                    item?.replyTos?.map((replyTo: any, replyToIndex: number) => {
                                      return (
                                        <span
                                          key={replyToIndex}
                                          className="accordion-head-mention-user user-mention text-blue mr-4"
                                        >
                                          {replyTo?.comment?.user?.name
                                            ? `@${replyTo?.comment?.user?.name}`
                                            : ''}
                                        </span>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails className="accordion-details-wrapper">
                            <div className="accordion-details-comment-list">
                              {!isEmpty(item?.replyTos) &&
                                item?.replyTos?.map((replyTo: any, replyToIndex: number) => {
                                  return (
                                    <div key={replyToIndex} className="accordion-details-comment">
                                      <div className="accordion-details-comment-time">
                                        <span className="datetime">
                                          {replyTo?.createdAt &&
                                            moment(replyTo?.createdAt).format(DATE_FORMAT_TIME)}
                                        </span>
                                      </div>
                                      <div className="accordion-details-comment-content">
                                        <span className="accordion-head-mention-user user-mention text-blue mr-4">
                                          {replyTo?.comment?.user?.name
                                            ? `@${replyTo?.comment?.user?.name}`
                                            : ''}
                                        </span>
                                        <span
                                          className="accordion-details-comment-content-text user-mention-in"
                                          style={{ whiteSpace: 'pre-line' }}
                                          dangerouslySetInnerHTML={{
                                            __html: replaceURLWithHTMLLinks(
                                              getTagUserPost(
                                                replyTo?.comment?.content,
                                                getDataMentionUser(replyTo?.comment?.user),
                                                'text-blue',
                                              ),
                                            ),
                                          }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                            {!isEmpty(item?.comment) && (
                              <div className="accordion-details-comment-admin">
                                <div className="accordion-details-comment-admin-time">
                                  <span className="datetime">
                                    {item?.comment?.createdAt &&
                                      moment(item?.comment?.createdAt).format(DATE_FORMAT_TIME)}
                                  </span>
                                </div>
                                <div className="accordion-details-comment-admin-content">
                                  <span className="accordion-head-mention-user user-mention text-primary mr-4">
                                    {item?.comment?.user?.name
                                      ? `@${item?.comment?.user?.name}`
                                      : ''}
                                  </span>
                                  <span className="accordion-head-mention-reply mr-4">
                                    Đã trả lời:
                                  </span>
                                  <span
                                    className="accordion-details-comment-admin-content-text user-mention-in"
                                    style={{ whiteSpace: 'pre-line' }}
                                    dangerouslySetInnerHTML={{
                                      __html: replaceURLWithHTMLLinks(
                                        getTagUserPost(
                                          item?.comment?.content,
                                          item?.replyTos?.map(rep => rep?.comment?.user),
                                          'text-blue',
                                        ),
                                      ),
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                </Grid>

                <div className="comment-reply-title">
                  <Typography variant="subtitle1" style={{ color: BLACK_500 }}>
                    Trả lời bình luận ({readList[0] && readList[0]?.comment ? readList?.length : 0})
                  </Typography>
                </div>

                <div className="wrapper-comment-reply">
                  <div className="comment-reply-comment-list">
                    {!isEmpty(readList) &&
                      readList?.map((readItem: any, readIndex: number) => {
                        if (isEmpty(readItem?.comment)) {
                          return <div />;
                        }
                        return (
                          <div key={readIndex} className="comment-reply-comment">
                            <div className="comment-reply-comment-time">
                              <span className="datetime">
                                {readItem?.createdAt &&
                                  moment(readItem?.createdAt).format(DATE_FORMAT_TIME)}
                              </span>
                            </div>
                            <div className="comment-reply-comment-content">
                              <span
                                key={readIndex}
                                className="comment-reply-user user-mention text-primary mr-4"
                              >
                                {readItem?.senderName ? `@${readItem?.senderName}` : ''}
                              </span>
                              <span className="comment-reply-label mr-4">Bình luận:</span>
                              <span
                                className="comment-reply-comment-content-text user-mention-in"
                                style={{ whiteSpace: 'pre-line' }}
                                dangerouslySetInnerHTML={{
                                  __html: replaceURLWithHTMLLinks(
                                    getTagUserPost(
                                      readItem?.comment?.content,
                                      [
                                        {
                                          id: readItem?.sender,
                                          name: readItem?.senderName,
                                        },
                                      ],
                                      'text-blue',
                                    ),
                                  ),
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className="comment-reply-mention flex-row">
                    <span className="comment-reply-app user-mention text-primary mr-4">
                      {caName}
                    </span>
                    <strong className="comment-reply-reply mr-4">phản hồi</strong>
                    <div className="comment-reply-user-list">
                      {!isEmpty(readList) &&
                        readList?.map((readItem: any, readIndex: number) => {
                          return (
                            <span
                              key={readIndex}
                              className="comment-reply-user user-mention text-blue mr-4"
                            >
                              {readItem?.senderName ? `@${readItem?.senderName}` : ''}
                            </span>
                          );
                        })}
                    </div>
                  </div>

                  <div className="comment-reply-textarea">
                    <ReactTextareaAutocomplete
                      value={values?.content ? values?.content : ''}
                      name="content"
                      style={{
                        fontSize: 18,
                        fontWeight: 500,
                        width: '100%',
                      }}
                      className="read-textarea"
                      onChange={e => {
                        setMessageContent(`${e.target.value.length} /2.200 kí tự`);
                        setFieldValue('content', e.target.value);
                      }}
                      loadingComponent={() => <span>Loading...</span>}
                      trigger={{
                        '@': {
                          dataProvider: token => {
                            return actionSearchUser(token);
                          },
                          component: Item,
                          output: item => {
                            return `@${item.name}`;
                          },
                        },
                      }}
                      disabled={isDisabledRespond}
                    />
                    <div style={{ marginTop: 6 }}>
                      {errors?.content ? (
                        <Typography variant="body2" style={{ color: RED }}>
                          {errors?.content}
                        </Typography>
                      ) : (
                        <Typography variant="body2" style={{ color: BLACK_400 }}>
                          {messageContent}
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: 20,
                  }}
                >
                  <Button
                    style={{
                      minWidth: 150,
                      height: 40,
                      border: '1px solid rgb(204 0 102)',
                      background: 'transparent',
                      marginRight: 15,
                    }}
                    variant="outlined"
                    color="secondary"
                    onClick={hadelCloseDialog}
                  >
                    <Typography variant="button" style={{ color: PINK }}>
                      Hủy
                    </Typography>
                  </Button>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="medium"
                    style={{ minWidth: 150, height: 40 }}
                    color="primary"
                    disableElevation
                    disabled={isDisabledRespond}
                  >
                    <Typography variant="button" style={{ color: WHITE }}>
                      Phản hồi
                    </Typography>
                  </LoadingButton>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default DialogContentRead;
