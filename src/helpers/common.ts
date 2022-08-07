export const convertTextToSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

export const isNumeric = (str: string) => {
  if (typeof str !== 'string') return false;
  return !Number.isNaN(Number(str));
};

export const truncateText = (str: string, length?: number, ending?: string) => {
  if (!length) {
    length = 100;
  }
  if (!ending) {
    ending = '...';
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  }
  return str;
};

export const truncateWords = (str: string, lengthWord?: number, ending?: string) => {
  if (!lengthWord) {
    lengthWord = 100;
  }
  if (!ending) {
    ending = '...';
  }

  const words = str.split(' ');
  if (lengthWord >= words.length) {
    return str;
  }

  const truncated = words.slice(0, lengthWord);
  return `${truncated.join(' ')}${ending}`;
};

export const countWords = (str: string) => {
  const words = str ? str.split(' ') : '';
  return str ? words.length : 0;
};
