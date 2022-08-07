import { Typography } from '@material-ui/core';
import { GRAY_DARK, PRIMARY } from 'configs/colors';
import { some } from 'configs/utils';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';
import React, { useState } from 'react';
import '../style.scss';

const cssClass = 'create-pin-list-component';
interface Props {
  loading: boolean;
  sectionList: some[];
  typeCate?: string;
  choosePinItem?: any;
  editItem?: any;
  onSelectItemSection?: any;
}

const CreatePinTableSection: React.FC<Props> = props => {
  const { loading, sectionList, typeCate, choosePinItem, editItem, onSelectItemSection } = props;
  const [data, setData] = useState<any>([]);
  const [listChoose, setListChoose] = useState<any[]>([]);
  // const pinItemList = data || [];

  React.useEffect(() => {
    if (editItem) {
      setData([...data, ...choosePinItem]);
    } else {
      setData([]);
    }
    if (typeCate === 'SECTION') {
      setData(sectionList);
    }
    // eslint-disable-next-line
  }, [typeCate, choosePinItem, editItem]);

  React.useEffect(() => {
    onSelectItemSection(listChoose);
    // eslint-disable-next-line
  }, [listChoose]);

  const handleClickRow = e => {
    setListChoose([e]);
  };

  const columns: Columns[] = [
    editItem && {
      title: 'pin_id',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center', height: '50px' },
      render: (record: some) => (
        <Typography variant="subtitle2" style={{ color: PRIMARY }}>
          {record.code}
        </Typography>
      ),
    },
    {
      title: 'section_id',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left', height: '50px' },
      render: (record: some) => (
        <Typography variant="subtitle2" style={{ color: PRIMARY }}>
          {record.id}
        </Typography>
      ),
    },
    {
      title: 'ARTICLE',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left', height: '50px' },
      render: (record: some) => (
        <Typography
          variant="body2"
          className="limit-text-2"
          style={{ color: GRAY_DARK, maxWidth: 200 }}
        >
          {record.name || record.targetName}
        </Typography>
      ),
    },
  ];
  return (
    <>
      <TableCustom
        dataSource={data}
        loading={loading}
        style={{ marginTop: 24, border: 4 }}
        onRowClick={e => handleClickRow(e)}
        columns={columns}
        noColumnIndex
        header={
          <div>
            <div className={`${cssClass}-head-top`}>
              <Typography variant="subtitle1" style={{ marginBottom: 15 }}>
                Danh sách
              </Typography>
            </div>
          </div>
        }
      />
    </>
  );
};

export default CreatePinTableSection;
