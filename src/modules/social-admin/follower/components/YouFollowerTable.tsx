import { Button, Checkbox, Typography } from '@material-ui/core';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';
import moment from 'moment';
import React, { useState } from 'react';
import { PINK } from '../../../../configs/colors';
import { some } from '../../../../constants';
import ConfirmDialog from '../../../common/components/ConfirmDialog';
import { DATE_FORMAT_TIME } from '../constants';
import '../style.css';

interface Props {
  datas?: some[];
  loading: boolean;
  totalElements?: number;
  filter?: some;
  hadleFilter: (value: some) => void;
  unfollow: (id: some | number) => void;
}
const YouFollowerTable: React.FC<Props> = ({
  datas,
  loading,
  totalElements,
  filter,
  hadleFilter,
  unfollow,
}) => {
  const [checkBoxList, setCheckBoxList] = useState<any>([]);
  const [poup, setPoup] = useState<boolean>(false);
  const [poupAll, setPoupAll] = useState<boolean>(false);
  const [unfollowId, setUnfollowId] = useState<number>();
  const columns: Columns[] = [
    {
      element: (
        <Checkbox
          checked={checkBoxList.length === datas?.length}
          color="primary"
          indeterminate={checkBoxList.length === datas?.length ? undefined : !!checkBoxList.length}
          onChange={() => {
            if (checkBoxList.length === datas?.length) {
              setCheckBoxList([]);
            } else {
              const tempListId = datas?.map((element: any) => element?.id);
              setCheckBoxList(tempListId);
            }
          }}
          inputProps={{ 'aria-label': 'indeterminate checkbox' }}
        />
      ),
      styleHeader: { textAlign: 'left' },
      render: (record: some) => {
        return (
          <Checkbox
            color="primary"
            checked={!!checkBoxList.find(element => element === record?.id)}
            onChange={() => {
              if (!checkBoxList.find(element => element === record?.id)) {
                setCheckBoxList([...checkBoxList, record.id]);
              } else {
              }
              const indexCheckBox = checkBoxList.indexOf(record?.id);
              if (indexCheckBox > -1) {
                checkBoxList.splice(indexCheckBox, 1);
                setCheckBoxList([...checkBoxList]);
              }
            }}
          />
        );
      },
    },
    {
      title: 'Tài khoản nội bộ',
      styleHeader: { textAlign: 'left', padding: 20 },
      render: (record: some) => {
        return (
          <Typography style={{ padding: '0px 20px' }} variant="body2">
            {record?.userName}
          </Typography>
        );
      },
    },
    {
      title: 'User ID',
      styleHeader: { textAlign: 'left', padding: 20 },
      render: (record: some) => {
        return (
          <Typography style={{ padding: '0px 20px' }} variant="body2">
            {record?.userId}
          </Typography>
        );
      },
    },
    {
      title: 'Tên người dùng',
      styleHeader: { textAlign: 'left', padding: 20 },
      render: (record: some) => {
        return (
          <Typography style={{ padding: '0px 20px' }} variant="body2">
            {record?.following}
          </Typography>
        );
      },
    },
    {
      title: 'Thời gian theo dõi',
      styleHeader: { textAlign: 'left', padding: 20 },
      render: (record: some) => {
        return (
          <Typography style={{ padding: '0px 20px' }} variant="body2">
            {moment(record?.followedAt).format(DATE_FORMAT_TIME)}
          </Typography>
        );
      },
    },
    {
      title: 'Thao tác',
      styleHeader: { textAlign: 'right', padding: 20 },
      render: (record: some) => {
        return (
          <div style={{ textAlign: 'right', padding: '0px 20px' }}>
            <Button
              style={{
                border: '1px solid rgb(204 0 102)',
                padding: 8,
                minHeight: 40,
                minWidth: 50,
                background: 'transparent',
              }}
              variant="outlined"
              color="secondary"
              onClick={() => {
                setPoup(true);
                setUnfollowId(record?.id);
              }}
            >
              <Typography variant="button" style={{ color: PINK }}>
                Bỏ theo dõi
              </Typography>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <TableCustom
        dataSource={datas}
        loading={loading}
        style={{ marginTop: 24, border: 4 }}
        columns={columns}
        noColumnIndex
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography style={{ padding: '20px 16px' }} variant="subtitle1">
              Danh sách người Bạn theo dõi ({datas?.length})
            </Typography>

            <select
              required
              id="option-select-css"
              disabled={!(checkBoxList.length > 0)}
              onChange={value => {
                if (value?.target?.value === 'unfollow') {
                  setPoupAll(true);
                }
              }}
            >
              <option value="" disabled selected hidden>
                Thao tác
              </option>
              <option value="">None</option>
              <option value="unfollow">Bỏ theo dõi</option>
            </select>
          </div>
        }
        paginationProps={{
          count: totalElements || 0,
          page: filter?.page - 1 || 0,
          rowsPerPage: filter?.size || 0,
          onPageChange: (event: unknown, newPage: number) => {
            const pagination = { ...filter, page: newPage + 1 };
            hadleFilter(pagination);
            setCheckBoxList([]);
          },
          onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => {
            hadleFilter({ ...filter, size: event?.target?.value });
            setCheckBoxList([]);
          },
        }}
      />
      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={poup}
        onAccept={() => {
          if (unfollowId) {
            unfollow(unfollowId);
            setPoup(false);
          }
        }}
        titleLabel={
          <Typography variant="body1">Bạn có chắc chắn muốn bỏ theo dõi người dùng này</Typography>
        }
        onClose={() => {
          setPoup(false);
        }}
        onReject={() => {
          setPoup(false);
        }}
      />
      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={poupAll}
        onAccept={() => {
          if (checkBoxList) {
            unfollow(checkBoxList);
          }
          setPoupAll(false);
        }}
        titleLabel={<Typography variant="body1">Bạn có chắc chắn muốn bỏ theo dõi</Typography>}
        onClose={() => {
          setPoupAll(false);
        }}
        onReject={() => {
          setPoupAll(false);
        }}
      />
    </>
  );
};

export default YouFollowerTable;
