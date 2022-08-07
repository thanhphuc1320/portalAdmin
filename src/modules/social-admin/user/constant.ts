export const GROUP_USER = [
  {
    id: 'FEATURED USER',
    name: 'Người dùng nổi bậc',
  },
  {
    id: 'OTHER USER',
    name: 'Người dùng khác',
  },
];

export const TARGET_TYPE = {
  Post: 'Post',
  Hashtag: 'HashTag',
  Comment: 'Comment',
  User: 'User',
  Winner: 'Winner',
};

export const REACTION_TYPE = {
  LIKE: 'LIKE',
  SHARE: 'SHARE',
  SEARCH: 'SEARCH',
  COMMENT: 'COMMENT',
  FOLLOW: 'FOLLOW',
  VIEW: 'VIEW',
  WINNER: 'WINNER',
  BOOKMARK: 'BOOKMARK',
};

export const SELECT_TARGET_TYPE = [
  {
    id: TARGET_TYPE.Post,
    name: 'post',
  },
  {
    id: TARGET_TYPE.Hashtag,
    name: 'hashTag',
  },
  {
    id: TARGET_TYPE.User,
    name: 'user',
  },
  {
    id: TARGET_TYPE.Comment,
    name: 'comment',
  },
  {
    id: TARGET_TYPE.Winner,
    name: 'winner',
  },
];

export const NAME_TARGET_TYPE = [
  {
    id: TARGET_TYPE.Post,
    name: 'Bài viết',
  },
  {
    id: TARGET_TYPE.Hashtag,
    name: 'Hashtag',
  },
  {
    id: TARGET_TYPE.User,
    name: 'Người dùng',
  },
  {
    id: TARGET_TYPE.Comment,
    name: 'Bình luận',
  },
  {
    id: TARGET_TYPE.Winner,
    name: 'Sự kiện',
  },
];

export const NAME_REACTION_TYPE = [
  {
    id: REACTION_TYPE.LIKE,
    name: 'Thích',
  },
  {
    id: REACTION_TYPE.COMMENT,
    name: 'Bình luận',
  },
  {
    id: REACTION_TYPE.FOLLOW,
    name: 'Theo dõi',
  },
  {
    id: REACTION_TYPE.BOOKMARK,
    name: 'Lưu',
  },
  {
    id: REACTION_TYPE.SEARCH,
    name: 'Tìm kiếm',
  },
  {
    id: REACTION_TYPE.SHARE,
    name: 'Chia sẻ',
  },
  {
    id: REACTION_TYPE.VIEW,
    name: 'Xem',
  },
  {
    id: REACTION_TYPE.WINNER,
    name: 'Nhận thưởng',
  },
];

export const GROUP_TARGET_TYPE_I = [
  REACTION_TYPE.LIKE,
  REACTION_TYPE.COMMENT,
  REACTION_TYPE.SHARE,
  REACTION_TYPE.VIEW,
  REACTION_TYPE.BOOKMARK,
  REACTION_TYPE.WINNER,
];

export const GROUP_TARGET_TYPE_II = [REACTION_TYPE.FOLLOW, REACTION_TYPE.SEARCH];
