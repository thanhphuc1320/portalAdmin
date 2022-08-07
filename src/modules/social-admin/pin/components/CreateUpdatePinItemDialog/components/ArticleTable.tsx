import { Button, Typography } from '@material-ui/core';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import { GRAY, GRAY_DARK, PRIMARY } from 'configs/colors';
import { some } from 'configs/utils';
import { formatDateTimeHourText } from 'models/moment';
import { Col, Row } from 'modules/common/components/elements';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';
import React, { useState } from 'react';
import { ReactComponent as IconFeedPhoto } from 'svg/feed_photo.svg';
import '../style.scss';

const cssClass = 'create-pin-list-component';
interface Props {
  loading: boolean;
  dataTable: any;
  onSelect(items: any[]): void;
  choosePinItem?: any;
  editItem?: any;
  onItemToRemove(value: any): void;
}

const CreatePinTableArticle: React.FC<Props> = props => {
  const { loading, dataTable, onSelect, choosePinItem, editItem, onItemToRemove } = props;
  const [data, setData] = useState<any>([]);
  const [listChoose, setListChoose] = useState<any[]>([]);
  // const pinItemList = data || [];

  React.useEffect(() => {
    onSelect(listChoose);
    // eslint-disable-next-line
  }, [listChoose]);

  React.useEffect(() => {
    if (editItem) {
      setData([...data, ...choosePinItem]);
    } else {
      setData([]);
    }
    if (dataTable) {
      setData(dataTable);
    }
    // eslint-disable-next-line
  }, [dataTable, choosePinItem, editItem]);

  const handleClickRow = e => {
    setListChoose([e]);
  };

  const handleRemoveRecord = item => {
    const findIndexToRemove = data.findIndex(ele => ele.id === item.id);
    if (findIndexToRemove !== -1) {
      onItemToRemove(data[findIndexToRemove].id);
      data.splice(findIndexToRemove, 1);
      setData([...data]);
    }
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
      title: 'POST_ID',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography variant="subtitle2" style={{ color: PRIMARY }}>
          {record?.id}
        </Typography>
      ),
    },
    {
      title: 'ARTICLE',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => {
        return (
          <Row style={{ justifyContent: 'flex-start' }}>
            {record?.thumbnail ? (
              <img
                src={record?.thumbnail}
                style={{ width: 48, height: 48, borderRadius: 4, objectFit: 'cover' }}
                alt="avatar"
              />
            ) : (
              <IconFeedPhoto />
            )}
            <Col
              style={{
                marginLeft: 8,
                display: 'flex',
                justifyContent: 'flex-start',
              }}
            >
              <Typography
                variant="subtitle2"
                style={{
                  color: PRIMARY,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  width: '60px',
                  whiteSpace: 'nowrap',
                }}
              >
                {/* {record?.serviceType || record?.targetName} */}
                {record?.targetCode}
              </Typography>

              <Typography
                variant="body2"
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  width: '60px',
                  whiteSpace: 'nowrap',
                }}
              >
                {record?.targetCode}
              </Typography>
              {record?.contentPost && (
                <Typography
                  variant="caption"
                  style={{
                    color: GRAY,
                    width: 180,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    height: 38,
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {record?.contentPost}
                </Typography>
              )}
            </Col>
          </Row>
        );
      },
    },
    {
      title: 'Được tạo bởi',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => {
        return (
          <Row
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'start',
              alignItems: 'flex-start',
            }}
          >
            <Typography
              variant="subtitle2"
              className="limit-text-2"
              style={{ color: PRIMARY, maxWidth: 200 }}
            >
              {record.createdByName}
            </Typography>
            <Typography
              variant="body2"
              className="limit-text-2"
              style={{ color: GRAY_DARK, maxWidth: 200 }}
            >
              {record.createdBy}
            </Typography>
            <Typography
              variant="body2"
              className="limit-text-2"
              style={{ color: GRAY_DARK, maxWidth: 200 }}
            >
              {formatDateTimeHourText(record?.createdAt)}
            </Typography>
          </Row>
        );
      },
    },
    {
      title: '',
      disableAction: true,
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: any) => {
        return (
          <Button
            variant="outlined"
            style={{ width: 32, height: 32 }}
            onClick={() => {
              handleRemoveRecord(record);
            }}
          >
            <DeleteOutlineRoundedIcon style={{ width: 16, height: 16 }} />
          </Button>
        );
      },
    },
  ];
  return (
    <>
      <TableCustom
        dataSource={data}
        loading={loading}
        style={{
          marginTop: 24,
          border: 4,
          height: 'fit-content',
          overflowY: 'auto',
          maxHeight: 540,
        }}
        columns={columns}
        onRowClick={e => handleClickRow(e)}
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

export default CreatePinTableArticle;
