import React from 'react';
import { some } from '../../constants';
import { GREEN_300, GREY_500, RED } from 'configs/colors';

export const getStatus = (status: number) => {
  let statusOption = { color: '', id: '' };
  if (status === 1) {
    statusOption = { color: GREEN_300, id: 'active' };
  } else if (status === 0) {
    statusOption = { color: GREY_500, id: 'inactive' };
  } else statusOption = { color: RED, id: 'deleted' };

  return statusOption;
};

export const STAR_LIST = [
  { name: '1 Sao', id: 1, isSelected: false },
  { name: '2 Sao', id: 2, isSelected: false },
  { name: '3 Sao', id: 3, isSelected: false },
  { name: '4 Sao', id: 4, isSelected: false },
  { name: '5 Sao', id: 5, isSelected: false },
];

export const TIME_DEFAULT = '00:00';

export const byTimeOptions = [
  {
    id: 0,
    name: 'Ngày tạo',
  },
  {
    id: 1,
    name: 'Ngày cập nhật',
  },
];

export const byServiceOptions = [
  {
    id: 'FLIGHT',
    name: 'Vé máy bay',
  },
  {
    id: 'HOTEL',
    name: 'Khách sạn',
  },
  {
    id: 'TRAIN',
    name: 'Vé tàu',
  },
  {
    id: 'TRAVELLING',
    name: 'Hoạt động du lịch',
  },
];

export const statusOption1 = [
  {
    id: 'ACTIVE',
    name: 'Cho phép tìm kiếm',
  },
  {
    id: 'INACTIVE',
    name: 'Không cho phép tìm kiếm',
  },
];

export const statusOption2 = [
  {
    id: 'ACTIVE',
    name: 'Đang áp dụng',
  },
  {
    id: 'INACTIVE',
    name: 'Ngừng áp dụng',
  },
];

export const statusOption = [
  {
    id: -1,
    name: 'deleted',
  },
  {
    id: 0,
    name: 'inactive',
  },
  {
    id: 1,
    name: 'active',
  },
];
export const typeOption = [
  {
    id: -1,
    name: 'SPECIFIC_IP',
  },
  {
    id: 0,
    name: 'BASE_IP',
  },
  {
    id: 1,
    name: 'SPECIFIC_USER',
  },
  {
    id: 2,
    name: 'BASE_USER',
  },
];

export const STATUS_OPTIONS = [
  {
    id: 'APPROVED',
    name: 'Đã duyệt',
    color: 'white',
    background: '#4FBF72',
  },
  {
    id: 'WAITING',
    name: 'Chờ duyệt',
    color: 'black',
    background: '#F7F7F7',
  },
  {
    id: 'DENIED',
    name: 'Bị chặn',
    color: '#FE0557',
    background: '#FCD9D9',
  },
];

export const STATUS_TITLE_TABLE = [
  {
    id: 'APPROVED',
    name: 'đã duyệt',
  },
  {
    id: 'WAITING',
    name: 'chờ duyệt',
  },
  {
    id: 'DENIED',
    name: 'bị chặn',
  },
];

export const STATUS_LIST = [
  {
    id: '',
    name: 'Tất cả',
    color: '#4fbf72',
  },
  {
    id: 'APPROVED',
    name: 'Đã duyệt',
    color: '#4fbf72',
  },
  {
    id: 'WAITING',
    name: 'Chờ duyệt',
    color: '#ffe9cf',
  },
  {
    id: 'DENIED',
    name: 'Bị chặn',
    color: '#fcd9d9',
  },
  // {
  //   id: 'DRAFT',
  //   name: 'Đang nháp',
  // },
];

export const SERVICE_TYPE = {
  ARTICLE: 'ARTICLE',
  HOTEL: 'HOTEL',
  FLIGHT: 'FLIGHT',
  TRAIN: 'TRAIN',
  TRAVELLING: 'TRAVELLING',
};

export const SERVICE_TYPE_OPTIONS = [
  {
    id: SERVICE_TYPE.ARTICLE,
    name: 'Bài viết',
  },
  {
    id: SERVICE_TYPE.HOTEL,
    name: 'Khách sạn',
  },
  {
    id: SERVICE_TYPE.FLIGHT,
    name: 'Vé máy bay',
  },
  {
    id: SERVICE_TYPE.TRAIN,
    name: 'Vé tàu',
  },
  {
    id: SERVICE_TYPE.TRAVELLING,
    name: 'Hoạt động',
  },
];

export const POST_TYPE = {
  DEFAULT: 'DEFAULT',
  VIDEO: 'VIDEO',
  ITEM: 'ITEM',
};

export const POST_TYPE_OPTIONS = [
  {
    id: POST_TYPE.DEFAULT,
    name: 'Mặc định',
  },
  {
    id: POST_TYPE.VIDEO,
    name: 'Video',
  },
  {
    id: POST_TYPE.ITEM,
    name: 'Item',
  },
];

export const MEDIA_LAYOUT = {
  GRID_TWO_A: 'GRID_TWO_A',
  GRID_TWO_B: 'GRID_TWO_B',
  GRID_TWO_C: 'GRID_TWO_C',
  GRID_THREE_A: 'GRID_THREE_A',
  GRID_THREE_B: 'GRID_THREE_B',
  GRID_FOUR_A: 'GRID_FOUR_A',
  GRID_FOUR_B: 'GRID_FOUR_B',
  GRID_FOUR_C: 'GRID_FOUR_C',
  GRID_FIVE_A: 'GRID_FIVE_A',
  GRID_FIVE_B: 'GRID_FIVE_B',
  SLIDE_LEGACY: 'SLIDE_LEGACY',
};

export const MEDIA_TYPE = {
  IMAGE: 'image',
  VIDEO: 'video',
};

export const HOTEL_MEDIA_TYPE = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
};

export const TICKET_CLASS_CODES = [
  {
    id: 'economy',
    name: 'Phổ Thông',
  },
  {
    id: 'premium_economy',
    name: 'Phổ Thông Đặc biệt',
  },
  {
    id: 'business',
    name: 'Thương Gia',
  },
  {
    id: 'first',
    name: 'Hạng Nhất',
  },
];

export const AIRLINES_CODES = [
  {
    id: 'VN',
    name: 'Vietnam Airlines',
  },
  {
    id: 'QH',
    name: 'Bamboo Airways',
  },
  {
    id: 'BL',
    name: 'Parcific Airlines',
  },
  {
    id: 'VJ',
    name: 'Vietjet Air',
  },
  {
    id: 'VU',
    name: 'Vietravel Airlines',
  },
];

export const NUMBER_OF_STOPS_DB = {
  DIRECT_FLIGHT: 0,
  ONE_STOP: 1,
};

export const NUMBER_OF_STOPS_KEYS = [NUMBER_OF_STOPS_DB.DIRECT_FLIGHT, NUMBER_OF_STOPS_DB.ONE_STOP];

export const NUMBER_OF_STOPS = [
  {
    id: NUMBER_OF_STOPS_DB.DIRECT_FLIGHT,
    name: 'Bay thẳng',
  },
  {
    id: NUMBER_OF_STOPS_DB.ONE_STOP,
    name: '1 điểm dừng',
  },
];

export const STATUS_REWARD = [
  {
    id: 'true',
    name: 'Hiển thị',
  },
  {
    id: 'false',
    name: 'Không hiển thị',
  },
];

export const MARGIN_RIGHT = 250;

export const SIZENUMBEROFCOMMENT = 10;

export const getMatches = (string: string, regex) => {
  let reGex;
  const arrayRegex: some = [];
  // eslint-disable-next-line no-cond-assign
  while ((reGex = regex.exec(string))) {
    arrayRegex.push(reGex[1]);
  }
  return arrayRegex;
};

export const getTagUserContent = (content: string, userData) => {
  const regex = /<@([0-9]*)*?>/g;
  const idReply = getMatches(content, regex);

  if (idReply) {
    const arrayReply: some = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < idReply?.length; i++) {
      const dataIDReply = Object.fromEntries(
        Object.entries(userData).filter(([key, val]) => (key === idReply[i] ? val : false)),
      );

      arrayReply?.push(dataIDReply);
    }

    if (arrayReply) {
      let string = content;
      const contentConvert = content;
      let str;
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < arrayReply.length; index++) {
        const convertString = `<span style="color: #ca0266;">@${arrayReply[index] &&
          Object.values(arrayReply[index])} </span>`;
        if (index === 0) {
          string = contentConvert?.replace(
            arrayReply[index] && `<@${Object.keys(arrayReply[index])}>`,
            convertString,
          );
          str = string;
        } else {
          string = str?.replace(
            arrayReply[index] && `<@${Object.keys(arrayReply[index])}>`,
            convertString,
          );
        }
      }

      // eslint-disable-next-line react/no-danger
      return <div dangerouslySetInnerHTML={{ __html: string }} />;
    }
  }
  return content;
};

export const getTagUserPost = (content: string, userData, classNameColor?: string) => {
  const regex = /<@([0-9]*)*?>/g;
  const idReply = getMatches(content, regex);

  if (idReply) {
    const arrayReply: some = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < idReply?.length; i++) {
      const dataIDReply = userData?.filter(el => {
        return el?.id === parseInt(idReply[i], 10);
      });
      arrayReply?.push(dataIDReply[0]);
    }

    if (arrayReply) {
      let string = content;
      const contentConvert = content;
      let str;
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < arrayReply.length; index++) {
        const convertString = `<span class="${classNameColor || 'text-primary'}">@${arrayReply[
          index
        ]?.name && arrayReply[index]?.name} </span>`;

        if (index === 0) {
          string = contentConvert?.replace(
            arrayReply[index]?.id && `<@${arrayReply[index]?.id}>`,
            convertString,
          );
          str = string;
        } else {
          string = str?.replace(
            arrayReply[index]?.id && `<@${arrayReply[index]?.id}>`,
            convertString,
          );
          str = string;
        }
      }
      // eslint-disable-next-line react/no-danger

      return string;
    }
  }
  return content;
};

export const getInputMentionUsersPost = (content: string, userData) => {
  const regex = /<@([0-9]*)*?>/g;
  const idReply = getMatches(content, regex);

  if (idReply) {
    const arrayReply: some = [];
    for (let i = 0; i < idReply?.length; i += 1) {
      const dataIDReply = userData?.filter(el => {
        return el?.id === parseInt(idReply[i], 10);
      });
      arrayReply?.push(dataIDReply[0]);
    }

    if (arrayReply) {
      let string = content;
      const contentConvert = content;
      let str;
      for (let index = 0; index < arrayReply.length; index += 1) {
        const convertString = `<@${arrayReply[index]?.id}>#{${arrayReply[index]?.name}}`;

        if (index === 0) {
          string = contentConvert?.replace(
            arrayReply[index]?.id && `<@${arrayReply[index]?.id}>`,
            convertString,
          );
          str = string;
        } else {
          string = str?.replace(
            arrayReply[index]?.id && `<@${arrayReply[index]?.id}>`,
            convertString,
          );
          str = string;
        }
      }
      return string;
    }
  }
  return content;
};

export const removeTagUserName = (content: string) => {
  const regex = /#{([^}]+)}/g;
  const idReply = getMatches(content, regex);
  if (idReply) {
    let string = content;
    let str;
    const contentConvert = content;
    for (let index = 0; index < idReply.length; index += 1) {
      if (index === 0) {
        string = contentConvert?.replace(idReply[index] && `#{${idReply[index]}}`, '');
        str = string;
      } else {
        string = str?.replace(idReply[index] && `#{${idReply[index]}}`, '');
        str = string;
      }
    }
    return string;
  }

  return content;
};

export const regexVi = /#[a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*/g;
