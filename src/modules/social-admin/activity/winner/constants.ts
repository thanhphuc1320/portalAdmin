export const STATUS_WINNER_CODES = {
  APPROVED: 'APPROVED',
  WAITING: 'WAITING',
  REWARDED: 'REWARDED',
  USER_OPENED: 'USER_OPENED',
  DENIED: 'DENIED',
};

export const STATUS_WINNER = [
  {
    id: STATUS_WINNER_CODES.APPROVED,
    name: 'Đã duyệt',
    color: 'white',
    background: '#4FBF72',
  },
  {
    id: STATUS_WINNER_CODES.WAITING,
    name: 'Chờ duyệt',
    color: 'black',
    background: '#FFE9CF',
  },
  {
    id: STATUS_WINNER_CODES.REWARDED,
    name: 'Đã trao giải',
    color: 'white',
    background: '#FE0557',
  },
  {
    id: STATUS_WINNER_CODES.USER_OPENED,
    name: 'Đã trao giải',
    color: 'white',
    background: '#FE0557',
  },
  {
    id: STATUS_WINNER_CODES.DENIED,
    name: 'Từ chối',
    color: '#FE0557',
    background: '#FCD9D9',
  },
];

export const STATUS_WINNER_SELECT = [
  {
    id: STATUS_WINNER_CODES.APPROVED,
    name: 'Duyệt',
  },
  {
    id: STATUS_WINNER_CODES.WAITING,
    name: 'Chờ duyệt',
  },
  {
    id: STATUS_WINNER_CODES.REWARDED,
    name: 'Đã trao giải',
  },
  {
    id: STATUS_WINNER_CODES.DENIED,
    name: 'Từ chối',
  },
];
