export type some = { [key: string]: any };
export const EVN =
  // eslint-disable-next-line no-nested-ternary
  process.env.NODE_ENV === 'development' ||
  process.env.BUILD_MODE === 'development' ||
  window.location.hostname.includes('dev.')
    ? 'dev'
    : window.location.hostname.includes('stage.')
    ? 'stage'
    : 'test';

export const SUCCESS_CODE = 200;

export const TOKEN = 'token';

export const PAGE_SIZE = 10;

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50, 100];

export const BOOKING_ID = 'bookingId';

export const ID = 'id';
export const NAME = 'name';
export const TYPE = 'type';

export const TABLET_WIDTH_NUM = 1024;
export const MIN_TABLET_WIDTH_NUM = 750;
export const MOBILE_WIDTH_NUM = 480;
export const DESKTOP_WIDTH_NUM = 1260;

export const KEY_GOOGLE_MAP = 'AIzaSyCktZ4VE5hoHILLG6N2M7XxCt-Zlq6HsdI';

export const MIN_UPLOAD_FILE_VIDEO = 52428800;

export const RETRY_DELAYS_UPLOAD_VIDEO = [0, 3000, 5000, 10000, 20000];

export const MAX_NUMBER_PHOTOS = 5;
