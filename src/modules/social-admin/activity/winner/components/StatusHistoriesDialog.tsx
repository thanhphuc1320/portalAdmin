import React, { useCallback } from 'react';
import { Grid, Dialog, DialogTitle, IconButton, Typography } from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';
import moment from 'moment';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';
import LoadingButton from 'modules/common/components/LoadingButton';
import { Row } from 'modules/common/components/elements';
import { GRAY_DARK, BLUE_300 } from 'configs/colors';
import { STATUS_WINNER } from '../constants';
import { some } from 'configs/utils';
import { ReactComponent as ArrowRight } from 'svg/arrowRight.svg';

const cssClass = 'winner-status-histories-dialog';

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  onClose: () => void;
  statusHistories: some[];
  loading: boolean;
}

const StatusHistoriesDialog: React.FC<Props> = props => {
  const { setOpen, open, statusHistories, loading, onClose } = props;

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const columns: Columns[] = [
    {
      title: 'status',
      styleHeader: { textAlign: 'left', paddingLeft: 15 },
      style: { textAlign: 'left' },
      render: (record: some) => {
        const statusObject = STATUS_WINNER.find(item => item.id === record?.fromStatus?.id);
        return (
          <Typography
            variant="body1"
            style={{
              padding: '2px 6px',
              marginLeft: 20,
              display: 'inline-block',
              minWidth: 88,
              textAlign: 'center',
              borderRadius: 4,
              color: statusObject?.color,
              backgroundColor: statusObject?.background,
            }}
          >
            {statusObject?.name}
          </Typography>
        );
      },
    },
    {
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: () => {
        return <ArrowRight />;
      },
    },
    {
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => {
        return (
          <Typography variant="body2" style={{ color: GRAY_DARK }}>
            {record?.toStatus?.name}
          </Typography>
        );
      },
    },
    {
      title: 'peopleChange',
      styleHeader: { textAlign: 'right' },
      style: { textAlign: 'right' },
      render: (record: some) => (
        <Typography variant="body2" style={{ color: BLUE_300 }}>
          {record.createdByName}
        </Typography>
      ),
    },
    {
      title: 'time',
      styleHeader: { textAlign: 'right', paddingRight: 35 },
      style: { textAlign: 'right', paddingRight: 40 },
      render: (record: some) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {moment(record?.createdAt).format('DD/MM/YYYY - HH:mm')}
        </Typography>
      ),
    },
  ];

  return (
    <Dialog maxWidth="lg" open={open} onClose={handleClose} className={`${cssClass}`}>
      <DialogTitle style={{ paddingBottom: 0 }}>
        <IconButton
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            padding: 0,
          }}
          onClick={handleClose}
        >
          <IconClose />
        </IconButton>
      </DialogTitle>
      <Grid container>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            style={{ marginTop: 25, marginBottom: 25, fontWeight: 'bold', textAlign: 'center' }}
          >
            Lịch sử trạng thái
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <div className={`${cssClass}-list`}>
            <TableCustom
              dataSource={statusHistories}
              loading={loading}
              columns={columns}
              noColumnIndex
              header={null}
              isHidePagination
              paginationProps={{
                count: statusHistories?.length || 0,
                page: 0,
                rowsPerPage: 100000,
                onPageChange: () => {},
                onChangeRowsPerPage: () => {},
              }}
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          <Row style={{ marginTop: 24, marginBottom: 24, justifyContent: 'flex-end' }}>
            <LoadingButton
              variant="contained"
              size="large"
              style={{ minWidth: 200, marginRight: 20 }}
              color="primary"
              disableElevation
              loading={false}
              onClick={onClose}
            >
              Đồng ý
            </LoadingButton>
          </Row>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default React.memo(StatusHistoriesDialog);
