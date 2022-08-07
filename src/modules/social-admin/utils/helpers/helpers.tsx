const has = Object.prototype.hasOwnProperty;

export const isEmpty = (prop: any) => {
  return (
    prop === null ||
    prop === undefined ||
    (has.call(prop, 'length') && prop.length === 0) ||
    (prop.constructor === Object && Object.keys(prop).length === 0)
  );
};

export const getSendMessage = (
  contentMessage: string,
  typeMessage: string,
  chatGroupId: string,
  ticketId: string,
) => {
  return JSON.stringify({
    headers: {
      command: 'sendCSGroupMessage',
    },
    body: {
      transactionId: `${new Date().getTime()}`,
      envelop: {
        content: contentMessage,
        contentType: typeMessage,
        receiver: chatGroupId,
        receiverType: 'GROUP',
        extraInfos: { ticketId },
      },
    },
  });
};
export const formatBytes = (a: number, b = 2) => {
  if (a === 0) return '0 Bytes';
  const c = b < 0 ? 0 : b;
  const d = Math.floor(Math.log(a) / Math.log(1024));
  // eslint-disable-next-line no-restricted-properties
  return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${
    ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]
  }`;
};

export const replaceURLWithHTMLLinks = (text: string) => {
  const arrayHash: any[] = [];
  const tempArrayString = text.split('\n');

  tempArrayString.forEach((ele: any) => {
    if (ele.charAt(0) === '#') {
      arrayHash.push(`<span style='color: #CC0066'> ${ele} </span>`);
    } else if (ele.search('@') !== -1) {
      arrayHash.push(ele);
    } else {
      ele.split(' ').forEach((el: any) => {
        if (el.charAt(0) === '#') {
          arrayHash.push(`<span style='color: #CC0066'> ${el} </span>`);
        } else {
          arrayHash.push(el);
        }
      });
    }
  });
  const arrayString2 = arrayHash.join(' ');
  const exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
  return arrayString2.replace(exp, "<a style='color: #CC0066' target='_blank'  href='$1'>$1</a>");
};
