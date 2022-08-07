export const NOTIFICATION_PAGE = 1;
export const NOTIFICATION_SIZE = 10;
export const NOTIFICATION_SORT = 'createdAt,desc';
export const NOTIFICATION_CAID_DEFAULT = 1;

export const DATE_FORMAT_TIME = 'DD/MM/YYYY • hh:mm:ss';
export const DATE_FORMAT = 'YYYY-MM-DD';

export const TYPE_OF_INTERACTION = {
  LIKE_FEED_EVENT: 'LIKE_FEED_EVENT',
  LIKE_COMMENT_EVENT: 'LIKE_COMMENT_EVENT',
  COMMENT_ON_FEED_EVENT: 'COMMENT_ON_FEED_EVENT',
  REPLY_COMMENT_EVENT: 'REPLY_COMMENT_EVENT',
  SHARE_FEED_EVENT: 'SHARE_FEED_EVENT',
};

export const TYPE_OF_INTERACTION_POST = ['LIKE_FEED_EVENT', 'SHARE_FEED_EVENT'];

export const TYPE_OF_INTERACTION_COMMENT = [
  'LIKE_COMMENT_EVENT',
  'COMMENT_ON_FEED_EVENT',
  'REPLY_COMMENT_EVENT',
];

export const TYPE_OF_INTERACTION_RESPOND = ['COMMENT_ON_FEED_EVENT', 'REPLY_COMMENT_EVENT'];

export const USER_INTER_ACTON = [
  { id: 'LIKE_FEED_EVENT', show: false, name: 'thích bài viết' },
  { id: 'LIKE_COMMENT_EVENT', show: true, name: 'thích bình luận' },
  { id: 'COMMENT_ON_FEED_EVENT', show: true, name: 'bình luận' },
  { id: 'REPLY_COMMENT_EVENT', show: true, name: 'nhắc tên' },
  { id: 'SHARE_FEED_EVENT', show: true, name: 'chia sẻ' },
];

export const REPLY_COMMENT = [
  {
    id: true,
    name: 'Đã phản hồi',
  },
  {
    id: false,
    name: 'Chưa phản hồi',
  },
];

export const STATUS_NOTIFICATION = [
  {
    id: 'READ',
    name: 'Đã đọc',
  },
  {
    id: 'UNREAD',
    name: 'Chưa đọc',
  },
];

export const ACTIONS = {
  MULTI_UNREAD: 'MULTI_UNREAD',
  MULTI_DELETE: 'MULTI_DELETE',
  MULTI_RESPOND: 'MULTI_RESPOND',
};

export const OPTIONS_ACTIONS = [
  { id: ACTIONS.MULTI_UNREAD, name: 'Đánh dấu chưa đọc' },
  { id: ACTIONS.MULTI_DELETE, name: 'Xóa thông báo' },
  { id: ACTIONS.MULTI_RESPOND, name: 'Trả lời' },
];
