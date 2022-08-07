import { Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { setFlightList } from 'modules/social-admin/article/redux/articleReducer';
import { GRAY } from 'configs/colors';
import ConfirmDialog from 'modules/common/components/ConfirmDialog';
import LoadingButton from 'modules/common/components/LoadingButton';
import SearchFlightDialog from './search-flight-dialog';
import DndFlightSeviceList from './flight-dnd';
import { ReactComponent as IconEmptyFlightServices } from 'svg/img_no_flight_attachment.svg';
import { isEmpty, some } from 'configs/utils';
import './style.scss';

const cssClass = 'article-flight-service';

interface Props {
  caId: number;
  serviceNumber: number;
  onChangePrice?(record: any): void;
  sortedList?(list: some[]): void;
}

const FlightServices: React.FC<Props> = (props: Props) => {
  const { caId, serviceNumber, sortedList, onChangePrice } = props;
  const flightList = useSelector((state: AppState) => state.article.flightList);
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [open, setOpen] = useState<boolean>(false);
  const [isConfirmRemoveAll, setIsConfirmRemoveAll] = useState<boolean>(false);

  return (
    <div className={`${cssClass}-wrapper`}>
      {!isEmpty(flightList) ? (
        <div className={`${cssClass}-box-list-added`}>
          <DndFlightSeviceList
            data={flightList}
            sortedList={sortedList}
            onChangePrice={onChangePrice}
          />
        </div>
      ) : (
        <div className={`${cssClass}-box-empty`}>
          <IconEmptyFlightServices />
          <Typography style={{ color: GRAY, marginTop: 15 }} variant="caption">
            Bạn chưa đính kèm dịch vụ máy bay nào
          </Typography>
        </div>
      )}

      <div className={`${cssClass}-bottom`}>
        <div className={`${cssClass}-bottom-left`}>
          <Typography variant="body2">Nhấn giữ chuột và kéo thả để sắp xếp vị trí</Typography>
        </div>
        <div className={`${cssClass}-bottom-right`}>
          <LoadingButton
            variant="outlined"
            color="primary"
            size="large"
            style={{ minWidth: 140 }}
            disableElevation
            loading={false}
            onClick={() => setIsConfirmRemoveAll(true)}
            disabled={flightList.length === 0}
          >
            <Typography style={{ fontWeight: 'bold' }}>Xóa tất cả</Typography>
          </LoadingButton>
          <LoadingButton
            variant="contained"
            size="large"
            style={{ minWidth: 140, marginLeft: 20 }}
            color="primary"
            disableElevation
            loading={false}
            onClick={() => setOpen(true)}
            disabled={flightList.length >= serviceNumber}
          >
            <Typography style={{ color: 'white' }}>Thêm dịch vụ máy bay</Typography>
          </LoadingButton>
        </div>
      </div>
      <SearchFlightDialog open={open} setOpen={setOpen} caId={caId} serviceNumber={serviceNumber} />
      {/* isConfirm */}
      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={isConfirmRemoveAll}
        acceptLabel="delete"
        rejectLabel="cancel"
        onAccept={() => {
          dispatch(setFlightList([]));
          setIsConfirmRemoveAll(false);
        }}
        titleHead={
          <Typography style={{ marginBottom: 16 }} variant="subtitle1">
            Xác nhận xóa tất cả
          </Typography>
        }
        titleLabel={
          <Typography variant="body1">Bạn có chắc muốn xóa tất cả dịch vụ máy bay?</Typography>
        }
        onClose={() => setIsConfirmRemoveAll(false)}
        onReject={() => setIsConfirmRemoveAll(false)}
      />
    </div>
  );
};

export default FlightServices;
