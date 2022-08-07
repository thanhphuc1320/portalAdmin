import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { some } from '../../../../constants';
import DndPhotosCore from './DndPhotosCore';
import { GridProvider } from './GridContext';

type fileType = 'media' | 'image' | 'video';

interface Props {
  listMedias: some[];
  isChecked: number[];
  setTempListPhoto(list?: any): void;
  setListMedias(value: some[]): void;
  handleRemoveItem(mediaItem: any): void;
  cardID: number;
  maxNumberFile?: number;
  fileType?: fileType;
  checkPostTypeVideo?: boolean;
  label?: string;
  isNoCDN?: boolean;
  setNumberMediaBefore(value: number): void | undefined;
}

const DndPhotos: React.FC<Props> = (props: Props) => {
  const {
    listMedias,
    setListMedias,
    isChecked,
    handleRemoveItem,
    setTempListPhoto,
    cardID,
    fileType,
    maxNumberFile,
    checkPostTypeVideo,
    label,
    isNoCDN,
    setNumberMediaBefore,
  } = props;
  const tempUrl = listMedias?.sort((a, b) => {
    return b.order - a.order;
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <GridProvider listUrl={tempUrl} setTempListPhoto={setTempListPhoto}>
        <DndPhotosCore
          cardID={cardID}
          key="DndPhotosCore"
          label={label}
          listMedias={listMedias}
          isChecked={isChecked}
          handleRemoveItem={handleRemoveItem}
          setListMedias={setListMedias}
          setNumberMediaBefore={setNumberMediaBefore}
          fileType={fileType}
          maxNumberFile={maxNumberFile}
          checkPostTypeVideo={checkPostTypeVideo}
          isNoCDN={isNoCDN}
        />
      </GridProvider>
    </DndProvider>
  );
};

export default DndPhotos;
