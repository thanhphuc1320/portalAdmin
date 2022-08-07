import moment, { Moment } from 'moment';
import TimeAgo from 'javascript-time-ago';
import { isEmpty } from 'configs/utils';

export const TIME_FORMAT = 'HH:mm:ss';
export const HOUR_MINUTE = 'HH:mm';
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_FORMAT_BACK_END = 'DD-MM-YYYY';
export const C_DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_TIME_FORMAT = `${DATE_FORMAT_BACK_END} ${TIME_FORMAT}`;
export const DATE_TIME_FORMAT_BREAK = `${DATE_FORMAT}[\n]${TIME_FORMAT}`;
export const DATE_FORMAT_ALL = `${DATE_FORMAT} ${TIME_FORMAT}`;
export const DATE_TIME_ISOLATE_FORMAT = `${DATE_FORMAT_BACK_END}, ${TIME_FORMAT}`;
export const DATE_FORMAT_ALL_ISOLATE = `${DATE_FORMAT}, ${TIME_FORMAT}`;
export const TIME_FORMAT_DATE = `${DATE_FORMAT_BACK_END} ${TIME_FORMAT}`;
export const DATE_FORMAT_FILTER_FROM = `${C_DATE_FORMAT}T00:00:00.000Z`;
export const DATE_FORMAT_FILTER_TO = `${C_DATE_FORMAT}T23:59:00.000Z`;
export const DATE_FORMAT_TIMEZONE = `${C_DATE_FORMAT}THH:mm:ss.000Z`;
export const DATE_FORMAT_SHOW = `${HOUR_MINUTE} - ${DATE_FORMAT}`;
export const DATE_FORMAT_SHOW_TIME = `${DATE_FORMAT} • ${HOUR_MINUTE}`;
export const DATE_TIME_HOUR_FORMAT = `${DATE_FORMAT_BACK_END} ${HOUR_MINUTE}`;
export const DATE_FORMAT_C_DATE_HOUR = `${C_DATE_FORMAT}T${HOUR_MINUTE}Z`;
export const DATE_TIME_HOUR_FORMAT_PICKER = `DD/MM/YYYY HH:mm`;
export const DATE_TIME_HOUR_FORMAT_DB = `${C_DATE_FORMAT}THH:mm:00.000Z`;

const vi = require('javascript-time-ago/locale/vi');

TimeAgo.addLocale(vi);
const timeAgo = new TimeAgo('vi-VN');

export const getTimeAgo = (strIso: string) => {
  if (isEmpty(strIso)) return '';
  const time = moment(strIso).format('YYYY-MM-DD HH:mm:ss');
  const timeUnix = moment(time).format('x');
  return timeAgo.format(parseInt(timeUnix, 0));
};

export function formatDateText(strIso: Moment) {
  if (isEmpty(strIso)) return '';
  return moment(strIso).format('DD/MM/YYYY');
}

export function formatDateTimeHourText(strIso: Moment) {
  if (isEmpty(strIso)) return '';
  return moment(strIso).format('DD/MM/YYYY • HH:mm');
}

export function formatDateTimeHourSecondText(strIso: Moment) {
  if (isEmpty(strIso)) return '';
  return moment(strIso).format('DD/MM/YYYY • HH:mm:ss');
}

export function getCreatedAtBackEnd() {
  return moment().format(`YYYY-MM-DDTHH:mm:ss.SSSSSSZ`);
}
