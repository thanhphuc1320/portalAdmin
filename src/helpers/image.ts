import { some, isEmpty } from 'configs/utils';

export const getImageDuration = file =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const { naturalWidth: width, naturalHeight: height } = img;
      resolve({ width, height });
    };
    img.onerror = () => {
      reject(new Error('There was some problem with the image.'));
    };
    img.src = file?.location || file?.url;
    // URL.createObjectURL(file);
  });

export const updateMediaDimension = async (array: some[] = []) => {
  if (isEmpty(array)) {
    return [];
  }

  return await Promise.all(
    array.map(async (item: any = {}) => {
      if (item?.type === 'image' && (isEmpty(item.width) || isEmpty(item.height))) {
        const dimensions: any = await getImageDuration(item);
        item.width = dimensions?.width || 0;
        item.height = dimensions?.height || 0;
      }
      return item;
    }),
  );
};
