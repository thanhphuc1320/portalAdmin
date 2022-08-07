import { Dialog, Typography } from '@material-ui/core';
import { BLACK_500, RED } from 'configs/colors';
import { Col, Row } from 'modules/common/components/elements';
import LoadingButton from 'modules/common/components/LoadingButton';
import React, { useCallback } from 'react';
import '../pages/style.scss';

const cssClass = 'filter-content-import-dialog';

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  data: any;
}

const DialogUpload: React.FC<Props> = props => {
  const { setOpen, open, data } = props;
  const [successWord, setSuccessWord] = React.useState<any>([]);
  const [wordExiting, setWordExiting] = React.useState<any>([]);
  const [count, setCount] = React.useState<any>({ createdCount: 0, existingCount: 0 });

  const handleData = dataAdd => {
    const { created, existing } = dataAdd;
    const createdTemp: any = [];
    const existingTemp: any = [];
    setCount({ createdCount: created?.length || 0, existingCount: existing?.length || 0 });
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 3; i++) {
      if (created[i]) {
        createdTemp.push(created[i]);
      }
    }

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 3; i++) {
      if (existing[i]) {
        existingTemp.push(existing[i]);
      }
    }
    setWordExiting(existingTemp);
    setSuccessWord(createdTemp);
  };
  React.useEffect(() => {
    if (data?.created?.length > 0 || data?.existing?.length > 0) {
      handleData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleClose = useCallback(() => {
    setOpen(false);
    // setMessage('');
  }, [setOpen]);
  return (
    <Dialog maxWidth="sm" open={open} onClose={handleClose} className={`${cssClass}`}>
      <Col style={{ height: '100%', justifyContent: 'space-evenly', maxWidth: '90%' }}>
        <Row style={{ margin: 10, justifyContent: 'center' }}>
          <Typography variant="h6" style={{ fontWeight: 'bold', textAlign: 'center' }}>
            Thêm dữ liệu
          </Typography>
        </Row>
        {count.createdCount > 0 && (
          <Row>
            <Typography
              variant="body2"
              style={{ fontWeight: 400, textAlign: 'center', color: BLACK_500 }}
            >
              {`Đã thêm thành công ${count.createdCount} từ: "${
                count.createdCount > 3 ? `${successWord.join(',')}...` : `${successWord.join(',')}`
              }" vào hệ thống `}
            </Typography>
          </Row>
        )}
        {count.existingCount > 0 && (
          <Row>
            <Typography
              variant="body2"
              style={{ fontWeight: 400, textAlign: 'center', color: BLACK_500 }}
            >
              Trong đó có {count.existingCount} từ
              <span style={{ color: RED, marginLeft: 5 }}>
                {count.existingCount > 3
                  ? `"${wordExiting.join(',')}..."`
                  : `"${wordExiting.join(',')}"`}
              </span>
              &nbsp; đã tồn tại trong hệ thống
            </Typography>
          </Row>
        )}
        <LoadingButton
          variant="contained"
          size="large"
          style={{ minWidth: 185, marginLeft: 0 }}
          color="primary"
          disableElevation
          loading={false}
          onClick={() => setOpen(false)}
        >
          Xác nhận
        </LoadingButton>
      </Col>
    </Dialog>
  );
};

export default React.memo(DialogUpload);
