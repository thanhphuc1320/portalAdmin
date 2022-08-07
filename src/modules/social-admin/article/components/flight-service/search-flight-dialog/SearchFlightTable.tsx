import { Typography, Checkbox, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { setFlightList } from 'modules/social-admin/article/redux/articleReducer';
import LoadingButton from 'modules/common/components/LoadingButton';
import FlightTableCel from '../FlightTableCel';
import { PAGINATION_FLIGHT_SERVICE } from '../constants';
import { some } from 'configs/utils';
import TableNoHeadBody, {
  TableCellTH,
  TypographyTH,
} from 'modules/common/components/TableCustom/TableNoHeadBody';
import { ReactComponent as SortIcon } from 'svg/sort_none.svg';
import { ReactComponent as SortUpIcon } from 'svg/sort_up.svg';
import { ReactComponent as SortDownIcon } from 'svg/sort_down.svg';

const cssClass = 'article-search-flight-dialog-table-component';
// const MAX_FLIGHTS = 5;

interface DataSort {
  airlineName: string;
  departureTimestamp: number;
  ticketClassName: string;
  discountPercent: number;
  originPrice: number;
  discountedPrice: number;
}

type Order = 'none' | 'asc' | 'desc';

const SortSwithIcon = (column: keyof DataSort, orderBy: keyof DataSort, order: Order) => {
  if (column === orderBy && order === 'asc') {
    return <SortUpIcon />;
  }
  if (column === orderBy && order === 'desc') {
    return <SortDownIcon />;
  }
  return <SortIcon />;
};

interface Props {
  data?: some[] | undefined;
  filter?: some;
  setFilter?(values: any): void;
  hadleFilter(values: some): void;
  updateSuccess(): void;
  loading: boolean;
  serviceNumber: number;
}

const SearchFlightTable: React.FC<Props> = props => {
  const { serviceNumber, loading, data, filter, hadleFilter, updateSuccess } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const flightList = useSelector((state: AppState) => state.article.flightList);
  const [checkBoxIds, setCheckBoxIds] = useState<some[]>([]);
  const [checkBoxData, setCheckBoxData] = useState<some[]>([]);
  const [addedIds, setAddedIds] = useState<some[]>([]);
  const [dataSearch, setDataSearch] = useState<some[]>([]);
  const [dataNoSort, setDataNoSort] = useState<some[]>([]);
  const [order, setOrder] = React.useState<Order>('none');
  const [orderBy, setOrderBy] = React.useState<keyof DataSort>('airlineName');
  const totalSelected = Number(checkBoxData?.length) + Number(flightList?.length);
  const MAX_FLIGHTS = serviceNumber;

  useEffect(() => {
    setDataSearch(data || []);
    setDataNoSort(data || []);
  }, [data]);

  useEffect(() => {
    const tempIds = flightList?.map((element: any) => element?.ticketOutboundId);
    setAddedIds(tempIds || []);
  }, [flightList]);

  const addSelectedToPost = useCallback(() => {
    if (totalSelected <= MAX_FLIGHTS) {
      const selectedListAdd = flightList?.concat(checkBoxData);
      dispatch(setFlightList(selectedListAdd));
      updateSuccess && updateSuccess();
    }
  }, [totalSelected, checkBoxData, flightList, dispatch, updateSuccess, MAX_FLIGHTS]);

  const onChangeItemPrice = useCallback(
    (itemPrice: any) => {
      const indexSearch: number = dataSearch?.findIndex(
        (item: any) => item?.ticketOutboundId === itemPrice?.ticketOutboundId,
      );
      if (indexSearch > -1 && dataSearch[indexSearch]) {
        dataSearch[indexSearch] = itemPrice;
        setDataSearch(dataSearch);
      }

      const indexCheck: number = checkBoxData?.findIndex(
        (item: any) => item?.ticketOutboundId === itemPrice?.ticketOutboundId,
      );
      if (indexCheck > -1 && checkBoxData[indexCheck]) {
        checkBoxData[indexCheck] = itemPrice;
        setCheckBoxData(checkBoxData);
      }
    },
    [dataSearch, checkBoxData],
  );

  const handleRequestSort = useCallback(
    (property: keyof DataSort) => {
      setOrderBy(property);
      if (orderBy === property && order === 'none') {
        setOrder('asc');
        setDataSearch(_.sortBy(dataSearch, property));
        return;
      }
      if (orderBy === property && order === 'asc') {
        setOrder('desc');
        setDataSearch(_.sortBy(dataSearch, property).reverse());
        return;
      }
      setOrder('none');
      setDataSearch(dataNoSort);
    },
    [dataSearch, dataNoSort, orderBy, order],
  );

  return (
    <div className={`${cssClass}`}>
      <Typography variant="subtitle1">Kết quả tìm kiếm ({filter?.totalElements || 0})</Typography>
      <TableNoHeadBody
        loading={loading}
        style={{ marginTop: 24, width: '100%' }}
        styleContainer={{ maxHeight: 495 }}
        rowsPerPageOptions={[100]}
        paginationProps={{
          count: filter?.totalElements || 0,
          page: filter?.page || PAGINATION_FLIGHT_SERVICE.PAGE_FIRST,
          rowsPerPage: filter?.size || PAGINATION_FLIGHT_SERVICE.PAGE_SIZE,
          onPageChange: (event: unknown, newPage: number) => {
            const pagination1 = { ...filter, page: newPage, newPage };
            hadleFilter(pagination1);
          },
          onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => {
            const pagination2 = {
              ...filter,
              size: event?.target?.value,
              page: PAGINATION_FLIGHT_SERVICE.PAGE_FIRST,
            };
            hadleFilter(pagination2);
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCellTH style={{ width: 40 }}> </TableCellTH>

            <TableCellTH style={{ width: 150 }}>
              <TypographyTH variant="subtitle2">Hãng</TypographyTH>
            </TableCellTH>

            <TableCellTH style={{ width: 170 }}>
              <TypographyTH variant="subtitle2">Từ</TypographyTH>
            </TableCellTH>

            <TableCellTH style={{ width: 140 }}>
              <TypographyTH variant="subtitle2">Ngày bay</TypographyTH>
            </TableCellTH>

            <TableCellTH style={{ width: 170 }}>
              <TypographyTH variant="subtitle2">Đến</TypographyTH>
            </TableCellTH>

            <TableCellTH
              style={{ width: 150 }}
              onClick={() => handleRequestSort('departureTimestamp')}
            >
              <span className={`${cssClass}-sort`}>
                <TypographyTH variant="subtitle2" className={`${cssClass}-sort-text`}>
                  Giờ bay
                </TypographyTH>
                <span className={`${cssClass}-sort-icon`}>
                  {SortSwithIcon('departureTimestamp', orderBy, order)}
                </span>
              </span>
            </TableCellTH>

            <TableCellTH style={{ width: 150 }}>
              <TypographyTH variant="subtitle2">Hạng vé</TypographyTH>
            </TableCellTH>

            <TableCellTH style={{ width: 150 }} onClick={() => handleRequestSort('originPrice')}>
              <span className={`${cssClass}-sort`}>
                <TypographyTH variant="subtitle2" className={`${cssClass}-sort-text`}>
                  Giá
                </TypographyTH>
                <span className={`${cssClass}-sort-icon`}>
                  {SortSwithIcon('originPrice', orderBy, order)}
                </span>
              </span>
            </TableCellTH>

            <TableCellTH
              style={{ width: 120 }}
              onClick={() => handleRequestSort('discountPercent')}
            >
              <span className={`${cssClass}-sort`}>
                <TypographyTH variant="subtitle2" className={`${cssClass}-sort-text`}>
                  % Giảm giá
                </TypographyTH>
                <span className={`${cssClass}-sort-icon`}>
                  {SortSwithIcon('discountPercent', orderBy, order)}
                </span>
              </span>
            </TableCellTH>

            <TableCellTH
              style={{ width: 150 }}
              onClick={() => handleRequestSort('discountedPrice')}
            >
              <span className={`${cssClass}-sort`}>
                <TypographyTH variant="subtitle2" className={`${cssClass}-sort-text`}>
                  Giá sau giảm
                </TypographyTH>
                <span className={`${cssClass}-sort-icon`}>
                  {SortSwithIcon('discountedPrice', orderBy, order)}
                </span>
              </span>
            </TableCellTH>
          </TableRow>
        </TableHead>
        <TableBody className={`${cssClass}-table-body`}>
          {dataSearch?.map((record: any, index: number) => {
            const isHideCheckbox =
              totalSelected >= MAX_FLIGHTS && !checkBoxIds?.includes(record?.ticketOutboundId);
            return (
              <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                <TableCell className="flight-service-cel cel-move" style={{ width: 40 }}>
                  {!isHideCheckbox && (
                    <Checkbox
                      color="primary"
                      disabled={!!addedIds?.includes(record?.ticketOutboundId)}
                      checked={
                        !!addedIds?.includes(record?.ticketOutboundId) ||
                        !!checkBoxIds.find(element => element === record?.ticketOutboundId)
                      }
                      onChange={() => {
                        if (!checkBoxIds.find(element => element === record?.ticketOutboundId)) {
                          setCheckBoxIds([...checkBoxIds, record.ticketOutboundId]);
                          setCheckBoxData([...checkBoxData, record]);
                        }
                        const indexCheckBox = checkBoxIds.indexOf(record?.ticketOutboundId);
                        if (indexCheckBox > -1) {
                          checkBoxIds.splice(indexCheckBox, 1);
                          setCheckBoxIds([...checkBoxIds]);
                          const filterCheckBoxData = checkBoxData?.filter(item =>
                            checkBoxIds?.includes(item?.ticketOutboundId),
                          );
                          setCheckBoxData([...filterCheckBoxData]);
                        }
                      }}
                    />
                  )}
                </TableCell>
                <FlightTableCel
                  record={record}
                  onChangePrice={onChangeItemPrice}
                  isShowColumnTime
                  isDisabled={!!addedIds?.includes(record?.ticketOutboundId)}
                />
              </TableRow>
            );
          })}
        </TableBody>
      </TableNoHeadBody>
      <div className={`${cssClass}-bottom`}>
        <div
          className={`${(totalSelected === 0 || totalSelected > MAX_FLIGHTS) &&
            'error'} ${cssClass}-bottom-box-count`}
        >
          <Typography style={{ fontSize: 14 }} variant="caption">
            Chọn tối đa <b>{MAX_FLIGHTS}</b> dịch vụ
          </Typography>{' '}
          <Typography style={{ fontWeight: 'bold', fontSize: 14 }} variant="caption">
            Đã chọn {totalSelected}/{MAX_FLIGHTS}
          </Typography>
        </div>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          style={{ width: 200, marginBottom: 10 }}
          color="primary"
          disableElevation
          onClick={addSelectedToPost}
          disabled={totalSelected === 0 || totalSelected > MAX_FLIGHTS}
        >
          <Typography>Thêm vào bài viết</Typography>
        </LoadingButton>
      </div>
    </div>
  );
};

export default SearchFlightTable;
