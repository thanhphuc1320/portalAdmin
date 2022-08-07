import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  createStyles,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  MenuProps,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import CheckIcon from '@material-ui/icons/Check';
import { ROUTES } from 'configs/routes';
import { getTagUserPost, SIZENUMBEROFCOMMENT } from 'modules/social-admin/constants';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import Slider from 'react-slick';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { API_PATHS } from '../../../../configs/API';
import { BLACK, GRAY_DARK, PINK, PRIMARY, WHITE } from '../../../../configs/colors';
import { some } from '../../../../constants';
import { AppState } from '../../../../redux/reducers';
import { ReactComponent as CloseCircle } from '../../../../svg/iconly-light-outline-close-circle.svg';
import { ReactComponent as DeleteLight } from '../../../../svg/iconly-light-outline-delete.svg';
import { ReactComponent as EditLight } from '../../../../svg/iconly-light-outline-edit.svg';
import { ReactComponent as TimeCircle } from '../../../../svg/iconly-light-outline-time-circle.svg';
import { ReactComponent as ArrowIconCircle } from '../../../../svg/ic_arrow_circle.svg';
import { Col, IOSSwitch, snackbarSetting } from '../../../common/components/elements';
import { fetchThunk } from '../../../common/redux/thunk';
import { replaceURLWithHTMLLinks } from '../../utils/helpers/helpers';
// import { DataCommentProps } from '../utils';
import CommentCard from './CommentCard';
import HotelCardMobile from './HotelCardMobile';

const ArrowNext = ({ Icon, className, style, onClick }: some) => {
  const replaceClass = className.replace('slick-arrow', '');
  const isDisable = replaceClass.indexOf('slick-disabled') !== -1;
  return (
    <IconButton
      className={replaceClass}
      style={{
        ...style,
        zIndex: 100,
        position: 'absolute',
        padding: 0,
        backgroundColor: WHITE,
        transform: 'rotate(90deg)',
      }}
      onClick={onClick}
      disabled={isDisable}
    >
      <Icon style={{ color: !isDisable ? BLACK : undefined }} />
    </IconButton>
  );
};

const ArrowBack = ({ Icon, className, style, onClick }: some) => {
  const replaceClass = className.replace('slick-arrow', '');
  const isDisable = replaceClass.indexOf('slick-disabled') !== -1;
  return (
    <IconButton
      className={replaceClass}
      style={{ ...style, zIndex: 100, position: 'absolute', padding: 0, backgroundColor: WHITE }}
      disabled={isDisable}
      onClick={onClick}
    >
      <Icon style={{ color: !isDisable ? BLACK : undefined, transform: 'rotate(-90deg)' }} />
    </IconButton>
  );
};

const StyledMenu = withStyles({
  list: {
    padding: '0px',
  },
})((props: MenuProps) => <Menu {...props} />);

const useStyles = makeStyles({
  cardAreaA: {
    height: 72,
    backgroundColor: '#dcf2e3', // #e5ebed
    marginRight: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  cardAreaB: {
    height: 72,
    backgroundColor: '#e5ebed',
    marginRight: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  cardAreaButton: {
    height: 72,
    display: 'flex',
    flexDirection: 'column',
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const AntTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: PRIMARY,
  },
})(Tabs);

interface StyledTabProps {
  label: string;
}

const AntTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      minWidth: 72,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(4),
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        color: '#3d3f40',
        opacity: 1,
      },
      '&$selected': {
        color: PRIMARY,
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: PRIMARY,
      },
    },
    selected: {},
  }),
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

export interface SimpleDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  contentEdit?: any;
  openEdit?: boolean;
  handleSwitch: (value: any) => void;
  setOpenEdit: (value: boolean) => void;
  onDeletePost: (value: boolean) => void;
  setDeletePostData: (value: any) => void;
  dataMentionUser?: some;
  switchPreviewArticle?: boolean;
}

function PreviewArticle(props: SimpleDialogProps) {
  const {
    setOpen,
    open,
    contentEdit,
    handleSwitch,
    onDeletePost,
    setDeletePostData,
    dataMentionUser,
    switchPreviewArticle,
  } = props;
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [dataComments, setDataComments] = useState<some>();
  const [userComments, setUserComments] = useState<some>();
  const [ListDataComments, setListDataComments] = useState<some>();
  const [isActive, setIsActive] = useState<boolean>();
  const [sttMenu, setSttMenu] = useState(contentEdit?.status);
  const [numberOfComment, setNumberOfComment] = useState(SIZENUMBEROFCOMMENT);
  const [totalComments, setTotalComments] = useState();

  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory();

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenu = async (action: string) => {
    setSttMenu(action);
    setAnchorEl(null);
    const url =
      // eslint-disable-next-line no-nested-ternary
      action === 'APPROVED'
        ? `${API_PATHS.approvePost}?id=${contentEdit?.id}`
        : action === 'WAITING'
        ? `${API_PATHS.waitPost}?id=${contentEdit?.id}`
        : `${API_PATHS.blockPost}?id=${contentEdit?.id}`;
    if (sttMenu === action) return;
    const json = await dispatch(fetchThunk(url, 'put'));
    if (json?.code === 200) {
      history.go(0);
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
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const classes = useStyles();

  const handleClose = () => {
    handleCloseMenu();
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setValue(newValue);
  };

  const deletePostComment = useCallback(
    async (id: number) => {
      const json = await dispatch(fetchThunk(`${API_PATHS.listComments}?id=${id}`, 'delete'));
      if (json?.code === 200) {
        history.go(0);
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
    [closeSnackbar, dispatch, enqueueSnackbar, history],
  );

  const fetchDataComments = useCallback(
    async (numberOfComments: number) => {
      const json = await dispatch(
        fetchThunk(
          `${API_PATHS.listComments}?postId=${contentEdit?.id}&size=${numberOfComments}`,
          'get',
        ),
      );
      if (json?.data) {
        setUserComments(json?.data?.metadata?.mentionUsers);
        setListDataComments(json?.data);
        setDataComments(json?.data?.content);
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
    [closeSnackbar, contentEdit, dispatch, enqueueSnackbar],
  );

  const getPost = useCallback(async () => {
    const json = await dispatch(fetchThunk(`${API_PATHS.adminPost}?id=${contentEdit.id}`, 'get'));
    if (json?.code === 200) {
      setTotalComments(json.data.content[0].numOfComment);
    } else {
      json?.message &&
        enqueueSnackbar(
          json?.message,
          snackbarSetting(key => closeSnackbar(key), {
            color: 'error',
          }),
        );
    }
  }, [closeSnackbar, contentEdit.id, dispatch, enqueueSnackbar]);
  useEffect(() => {
    fetchDataComments(numberOfComment);
    setSttMenu(contentEdit?.status);
    getPost();
  }, [contentEdit, fetchDataComments, getPost, numberOfComment]);

  useEffect(() => {
    setIsActive(switchPreviewArticle);
  }, [switchPreviewArticle]);

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <Box style={{ maxHeight: 788, height: '100%', width: 375 }}>
        <AntTabs
          value={value}
          onChange={handleChange}
          aria-label="ant example"
          style={{ borderBottom: ' 1px solid #cfcfcf' }}
        >
          <AntTab label="Nội dung bài viết" />
          <AntTab label={`Bình luận (${totalComments})`} />
        </AntTabs>
        <Box>
          <TabPanel value={value} index={0}>
            <Card>
              {contentEdit?.mediaInfos[0]?.type === 'image' ? (
                <CardMedia
                  component="span"
                  style={{ height: 375 }}
                  image={contentEdit?.mediaInfos[0]?.location}
                  title=""
                />
              ) : (
                !!contentEdit?.mediaInfos.length && (
                  <Box style={{ position: 'relative', width: '100%' }}>
                    <ReactPlayer
                      playing
                      url={contentEdit?.mediaInfos[0]?.location}
                      controls
                      height={360}
                      width={375}
                    />
                  </Box>
                )
              )}
              {contentEdit && (
                <CardContent>
                  <Slider
                    infinite
                    slidesToShow={1}
                    responsive={[
                      {
                        breakpoint: 1750,
                        settings: {
                          slidesToShow: 1,
                          slidesToScroll: 1,
                        },
                      },
                      {
                        breakpoint: 1300,
                        settings: {
                          slidesToShow: 1,
                          slidesToScroll: 1,
                        },
                      },
                      {
                        breakpoint: 700,
                        settings: { slidesToShow: 1, slidesToScroll: 1 },
                      },
                    ]}
                    slidesToScroll={1}
                    arrows
                    nextArrow={<ArrowNext Icon={ArrowIconCircle} />}
                    prevArrow={<ArrowBack Icon={ArrowIconCircle} />}
                  >
                    {contentEdit?.serviceInfos.map((ele: any) => (
                      <HotelCardMobile hotelData={ele?.hotelInfo} />
                    ))}
                  </Slider>
                </CardContent>
              )}
              {contentEdit?.content && (
                <CardContent style={{ padding: '0px 16px 0px' }}>
                  <div
                    style={{
                      color: GRAY_DARK,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      height: '100%',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: replaceURLWithHTMLLinks(
                        getTagUserPost(contentEdit?.content, dataMentionUser),
                      ),
                    }}
                  />
                </CardContent>
              )}
              <CardContent style={{ paddingTop: 0 }}>
                <Typography
                  variant="caption"
                  style={{ color: '#899296', marginRight: 16, fontWeight: 'bold' }}
                >
                  {contentEdit?.numOfLike} lượt thích
                </Typography>
                <Typography
                  variant="caption"
                  style={{ color: '#899296', marginRight: 16, fontWeight: 'bold' }}
                >
                  {contentEdit?.numOfComment} bình luận
                </Typography>
                <Typography variant="caption" style={{ color: '#899296', fontWeight: 'bold' }}>
                  {contentEdit?.numOfView} lượt xem
                </Typography>
              </CardContent>
              <Box style={{ display: 'flex' }}>
                {sttMenu === 'APPROVED' && (
                  <CardActionArea className={classes.cardAreaA} onClick={handleClickMenu}>
                    <CheckIcon
                      className="svgFillAll"
                      style={{
                        width: 20,
                      }}
                    />
                    <Typography variant="subtitle2" style={{ color: GRAY_DARK }}>
                      Đã duyệt
                    </Typography>
                  </CardActionArea>
                )}
                {sttMenu === 'WAITING' && (
                  <CardActionArea
                    style={{
                      backgroundColor: '#fcd9d9',
                    }}
                    className={classes.cardAreaButton}
                    onClick={handleClickMenu}
                  >
                    <TimeCircle
                      className="svgFillAll"
                      style={{
                        width: 20,
                      }}
                    />
                    <Typography variant="subtitle2" style={{ color: GRAY_DARK }}>
                      Chờ duyệt
                    </Typography>
                  </CardActionArea>
                )}
                {sttMenu === 'DENIED' && (
                  <CardActionArea
                    style={{
                      backgroundColor: '#ffe9cf',
                    }}
                    className={classes.cardAreaButton}
                    onClick={handleClickMenu}
                  >
                    <CloseCircle
                      className="svgFillAll"
                      style={{
                        width: 20,
                      }}
                    />
                    <Typography variant="subtitle2" style={{ color: GRAY_DARK }}>
                      Bị chặn
                    </Typography>
                  </CardActionArea>
                )}
                <CardActionArea className={classes.cardAreaB}>
                  <IOSSwitch
                    checked={isActive}
                    onChange={() => {
                      setIsActive(!isActive);
                      handleSwitch({ ...contentEdit, isActive });
                    }}
                  />
                  <Typography variant="subtitle2" style={{ color: GRAY_DARK }}>
                    Hiện
                  </Typography>
                </CardActionArea>
                <CardActionArea
                  className={classes.cardAreaB}
                  onClick={() => {
                    history.push({
                      pathname: ROUTES.article.update,
                      search: `postId=${contentEdit?.id}`,
                    });

                    // setOpenEdit(!openEdit);
                    // handleClose();
                  }}
                >
                  <EditLight />
                  <Typography variant="subtitle2" style={{ color: GRAY_DARK }}>
                    Chỉnh sửa
                  </Typography>
                </CardActionArea>
                <CardActionArea
                  className={classes.cardAreaB}
                  onClick={() => {
                    onDeletePost(true);
                    handleClose();
                    setDeletePostData(contentEdit);
                  }}
                >
                  <DeleteLight />
                  <Typography variant="subtitle2" style={{ color: GRAY_DARK }}>
                    Xóa
                  </Typography>
                </CardActionArea>
              </Box>
            </Card>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Col style={{ paddingBottom: 30 }}>
              {dataComments?.length > 0 ? (
                <>
                  {dataComments?.map((element: any) => (
                    <CommentCard
                      userComments={userComments}
                      dataComment={element}
                      deletePostComment={deletePostComment}
                    />
                  ))}
                  {ListDataComments?.totalPages !== 1 ? (
                    <Button
                      onClick={() => {
                        setNumberOfComment(numberOfComment + SIZENUMBEROFCOMMENT);
                      }}
                      variant="contained"
                      color="secondary"
                      style={{
                        color: WHITE,
                        background: PINK,
                        margin: '50px auto 10px',
                        padding: 10,
                        maxWidth: 150,
                      }}
                    >
                      Xem thêm bình luận
                    </Button>
                  ) : (
                    false
                  )}
                </>
              ) : (
                <Typography
                  variant="body1"
                  style={{ color: GRAY_DARK, textAlign: 'center', margin: 32 }}
                >
                  Không có bình luận
                </Typography>
              )}
            </Col>
          </TabPanel>
        </Box>
      </Box>
      <StyledMenu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        style={{
          padding: 0,
        }}
      >
        <MenuItem
          style={{
            backgroundColor: '#dcf2e3',
          }}
          onClick={() => {
            handleMenu('APPROVED');
          }}
        >
          <CardActionArea className={classes.cardAreaButton}>
            <CheckIcon
              className="svgFillAll"
              style={{
                width: 20,
              }}
            />
            <Typography variant="subtitle2" style={{ color: GRAY_DARK }}>
              Đã duyệt
            </Typography>
          </CardActionArea>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenu('WAITING');
          }}
          style={{
            backgroundColor: '#fcd9d9',
          }}
        >
          <CardActionArea className={classes.cardAreaButton}>
            <TimeCircle
              className="svgFillAll"
              style={{
                width: 20,
              }}
            />
            <Typography variant="subtitle2" style={{ color: GRAY_DARK }}>
              Chờ duyệt
            </Typography>
          </CardActionArea>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenu('DENIED');
          }}
          style={{
            backgroundColor: '#ffe9cf',
          }}
        >
          <CardActionArea className={classes.cardAreaButton}>
            <CloseCircle
              className="svgFillAll"
              style={{
                width: 20,
              }}
            />
            <Typography variant="subtitle2" style={{ color: GRAY_DARK }}>
              Bị chặn
            </Typography>
          </CardActionArea>
        </MenuItem>
      </StyledMenu>
    </Dialog>
  );
}

export default PreviewArticle;
