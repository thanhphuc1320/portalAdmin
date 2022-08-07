import { Checkbox, Typography } from '@material-ui/core';
import React, { useEffect, useState, useCallback } from 'react';
import queryString from 'query-string';
import { isArray } from 'lodash';
import { useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { API_PATHS } from 'configs/API';
import { fetchThunk } from 'modules/common/redux/thunk';
import { setNotistackMessage } from 'modules/common/redux/reducer';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';
import { Row } from 'modules/common/components/elements';
import ConfirmDialog from 'modules/common/components/ConfirmDialog';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import { ButtonConvert, ButtonPhoneBorder, ButtonDelete } from 'modules/common/components/Button';
import { formatDateText } from 'models/moment';
import { GRAY_DARK, PRIMARY } from 'configs/colors';
import { PAGINATION } from 'configs/configs';
import { some, isEmpty, toTitle } from 'configs/utils';
import { CA_ID_INFO } from 'modules/auth/constants';
import { ReactComponent as IconToggleFilter } from 'svg/icon_adjustment_grey.svg';
import PostCrawlerPreview from './PostCrawlerPreview';
import ConvertToPostDialog from './ConvertToPostDialog';
import './style.scss';

const ACTIONS = {
  MULTI_CONVERT: 'MULTI_CONVERT',
  MULTI_DELETE: 'MULTI_DELETE',
};

const ACTIONS_OPTION = [
  { id: ACTIONS.MULTI_CONVERT, name: 'Chuyển đổi' },
  { id: ACTIONS.MULTI_DELETE, name: 'Xóa' },
];

interface dataMessageProps {
  title: string;
  message: string;
  labelButton?: string;
}
interface Props {
  filter: any;
  setFilter(value: any): void;
  onUpdateFilter(filter: some): void;
  onToggleFilter?(): void;
}

const PostCrawlerList: React.FC<Props> = props => {
  const { filter, setFilter, onUpdateFilter, onToggleFilter } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const location = useLocation();
  const [data, setData] = useState<some>({ content: [], totalElements: 0 });
  const [loading, setLoading] = useState(false);
  const [checkBoxList, setCheckBoxList] = useState<number[]>([]);
  const [codeListSelected, setCodeListSelected] = useState<string[]>([]);
  const [itemSelected, setItemSelected] = useState<any>();
  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);
  const [isConfirmDeleteList, setIsConfirmDeleteList] = useState<boolean>(false);
  const [isPopupInfo, setIsPopupInfo] = useState<boolean>(false);
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [openConvert, setOpenConvert] = useState<boolean>(false);
  const [dataMessage, setDataMessage] = useState<dataMessageProps>();

  const crawlerList = data?.content || [];
  const countSelected = checkBoxList?.length || 0;

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    const filterParams = (queryString.parse(location.search) as unknown) as any;
    filterParams.sort = filterParams.sort ? filterParams.sort : 'createdAt,desc';
    filterParams.size = filterParams?.size ? filterParams?.size : PAGINATION.PAGE_SIZE;
    setFilter({
      ...filterParams,
    });
    filterParams.page = filterParams?.page ? Number(filterParams?.page) + 1 : 1;
    const json = await dispatch(
      fetchThunk(`${API_PATHS.getAdminCrawlers}?${queryString.stringify(filterParams)}`, 'get'),
    );
    if (json?.code === 200) {
      setData(json.data);
      setLoading(false);
    } else {
      json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
      setLoading(false);
    }
  }, [setLoading, location.search, setFilter, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onDeleteBulk = useCallback(
    async (ids: number[]) => {
      const json = await dispatch(
        fetchThunk(`${API_PATHS.deleteAdminCrawlers}?ids=${ids}`, 'delete'),
      );
      if (json?.code === 200) {
        fetchData();
        json?.message && dispatch(setNotistackMessage(json?.message, 'success'));
      } else {
        json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
      }
    },
    [dispatch, fetchData],
  );

  const onSelectAction = useCallback(
    async (actionType: string) => {
      if (isEmpty(checkBoxList) || isEmpty(codeListSelected)) {
        setDataMessage({
          title: 'Thông báo',
          message: 'Bạn chưa chọn crawler nào!',
          labelButton: 'close',
        });
        setIsPopupInfo(true);
        return;
      }
      if (actionType === ACTIONS.MULTI_CONVERT) {
        setOpenConvert(true);
      }
      if (actionType === ACTIONS.MULTI_DELETE) {
        setIsConfirmDeleteList(true);
      }
    },
    [checkBoxList, codeListSelected],
  );

  const getAdminCrawlersSearch = useCallback(
    async (str: string) => {
      const json = await dispatch(
        fetchThunk(`${API_PATHS.getAdminCrawlersSearch}?keyword=${str.trimLeft()}`, 'get'),
      );
      return json?.data || [];
    },
    [dispatch],
  );

  const resetCheckBoxs = () => {
    setCheckBoxList([]);
    setCodeListSelected([]);
  };

  const columns: Columns[] = [
    {
      element: (
        <Checkbox
          checked={checkBoxList.length === crawlerList?.length && crawlerList?.length > 0}
          color="primary"
          indeterminate={
            checkBoxList.length === crawlerList?.length ? undefined : !!checkBoxList.length
          }
          onChange={() => {
            if (checkBoxList.length === crawlerList?.length) {
              resetCheckBoxs();
            } else {
              const tempListId = crawlerList?.map((c: any) => c?.id);
              setCheckBoxList(tempListId);
              const tempListCode = crawlerList?.map((c: any) => c?.code);
              setCodeListSelected(tempListCode);
            }
          }}
          inputProps={{ 'aria-label': 'indeterminate checkbox' }}
        />
      ),
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: any) => {
        return (
          <Checkbox
            color="primary"
            checked={!!checkBoxList.find(element => element === record?.id)}
            onChange={() => {
              if (!checkBoxList.find(element => element === record?.id)) {
                setCheckBoxList([...checkBoxList, record.id]);
                setCodeListSelected([...codeListSelected, record.code]);
              } else {
                const indexCheckBox = checkBoxList.indexOf(record?.id);
                if (indexCheckBox > -1) {
                  checkBoxList.splice(indexCheckBox, 1);
                  setCheckBoxList([...checkBoxList]);

                  codeListSelected.splice(indexCheckBox, 1);
                  setCodeListSelected([...codeListSelected]);
                }
              }
            }}
          />
        );
      },
    },
    {
      title: 'crawlerID',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: any) => (
        <Typography variant="subtitle2" style={{ color: PRIMARY }}>
          {record?.code}
        </Typography>
      ),
    },
    {
      title: 'fanpageName',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: any) => (
        <Typography
          variant="body2"
          className="limit-text-2"
          style={{ color: GRAY_DARK, maxWidth: 150 }}
        >
          {record?.name}
        </Typography>
      ),
    },
    {
      title: 'source',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: any) => (
        <Typography variant="body2" style={{ color: GRAY_DARK, fontWeight: 'bold' }}>
          {toTitle(record?.provider)}
        </Typography>
      ),
    },
    {
      title: 'postType',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: any) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {toTitle(record?.postType)}
        </Typography>
      ),
    },
    {
      title: 'createdAt',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: any) => (
        <Typography variant="body2" style={{ color: GRAY_DARK }}>
          {formatDateText(record?.createdAt)}
        </Typography>
      ),
    },
    {
      title: 'caidDisplay',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: () => {
        return (
          <div>
            <Typography variant="body2" style={{ color: GRAY_DARK, marginBottom: 7 }}>
              Tripi
            </Typography>
            <Typography variant="body2" style={{ color: GRAY_DARK, marginBottom: 7 }}>
              MyTour
            </Typography>
            <Typography variant="body2" style={{ color: GRAY_DARK, marginBottom: 7 }}>
              Dinogo
            </Typography>
          </div>
        );
      },
    },
    {
      title: 'postid',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: any) => {
        const postIdTripi =
          isArray(record?.posts) &&
          record?.posts?.find(t => t.caId === CA_ID_INFO.TRIPI_PARTNER)?.id;
        const postIdMyTour =
          isArray(record?.posts) && record?.posts?.find(t => t.caId === CA_ID_INFO.MYTOUR)?.id;
        const postIdDinogo =
          isArray(record?.posts) && record?.posts?.find(t => t.caId === CA_ID_INFO.DINOGO)?.id;
        return (
          <div>
            <Typography
              variant="body2"
              style={{
                color: postIdTripi ? PRIMARY : GRAY_DARK,
                fontWeight: 'bold',
                marginBottom: 7,
              }}
            >
              {postIdTripi || '-'}
            </Typography>

            <Typography
              variant="body2"
              style={{
                color: postIdMyTour ? PRIMARY : GRAY_DARK,
                fontWeight: 'bold',
                marginBottom: 7,
              }}
            >
              {postIdMyTour || '-'}
            </Typography>

            <Typography
              variant="body2"
              style={{
                color: postIdDinogo ? PRIMARY : GRAY_DARK,
                fontWeight: 'bold',
                marginBottom: 7,
              }}
            >
              {postIdDinogo || '-'}
            </Typography>
          </div>
        );
      },
    },
    {
      title: 'action',
      disableAction: true,
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: any) => {
        return (
          <Row style={{ justifyContent: 'center' }}>
            <ButtonConvert
              onClick={() => {
                record?.code && setCodeListSelected([record?.code]);
                setOpenConvert(true);
              }}
            />
            <ButtonPhoneBorder
              onClick={() => {
                setItemSelected(record);
                setOpenPreview(true);
              }}
            />
            <ButtonDelete
              onClick={() => {
                setItemSelected(record);
                setIsConfirmDelete(true);
              }}
            />
          </Row>
        );
      },
    },
  ];

  return (
    <>
      <TableCustom
        dataSource={data?.content}
        loading={loading}
        style={{ marginTop: 24, border: 4 }}
        columns={columns}
        noColumnIndex
        header={
          <div className="page-list-table-header-top">
            <Typography variant="subtitle1">
              Danh sách bài viết ({data?.totalElements || 0})
            </Typography>
            <Row>
              <FormControlAutoComplete
                id="search"
                placeholder="Tìm kiếm"
                onChange={(e: any, valueItem: some | null) => {
                  const filterSearch: any = {};
                  if (valueItem?.type === 'crawlerCode') {
                    filterSearch.codes = valueItem.name;
                  }
                  if (valueItem?.type === 'sourceName') {
                    filterSearch.name = valueItem.name;
                  }
                  if (valueItem?.type === 'postId') {
                    filterSearch.postIds = valueItem.name;
                  }
                  onUpdateFilter({
                    ...filterSearch,
                    page: PAGINATION.PAGE_FIRST,
                    size: PAGINATION.PAGE_SIZE,
                  });
                }}
                loadOptions={getAdminCrawlersSearch}
                options={[]}
                groupBy={option => option.label}
                getOptionLabel={(one: some) => one.name}
                getOptionSelected={(option: some, value: some) => {
                  return option?.name === value?.name;
                }}
                optional
                formControlStyle={{
                  width: 250,
                  minWidth: 'unset',
                  marginRight: 20,
                  marginBottom: -20,
                }}
              />
              <FormControlAutoComplete<some>
                placeholder="Thao tác"
                value={null}
                onChange={(e: any, valueItem: some | null) => {
                  onSelectAction(valueItem?.id);
                }}
                options={ACTIONS_OPTION}
                getOptionLabel={(one: some) => one.name}
                getOptionSelected={(option: some, value: some) => {
                  return option?.id === value?.id;
                }}
                optional
                formControlStyle={{
                  width: 150,
                  minWidth: 'unset',
                  marginRight: 20,
                  marginBottom: -20,
                }}
              />
              <IconToggleFilter onClick={onToggleFilter} style={{ cursor: 'pointer' }} />
            </Row>
          </div>
        }
        paginationProps={{
          count: data?.totalElements || 0,
          page: filter.page ? Number(filter.page) : PAGINATION.PAGE_FIRST,
          rowsPerPage: filter.size ? Number(filter.size) : PAGINATION.PAGE_SIZE,
          onPageChange: (event: unknown, newPage: number) => {
            onUpdateFilter({
              ...((queryString.parse(location.search) as unknown) as any),
              page: newPage,
            });
            resetCheckBoxs();
          },
          onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => {
            onUpdateFilter({
              ...((queryString.parse(location.search) as unknown) as any),
              size: parseInt(event.target.value, PAGINATION.PAGE_SIZE),
              page: PAGINATION.PAGE_FIRST,
            });
            resetCheckBoxs();
          },
        }}
      />

      <PostCrawlerPreview
        open={openPreview}
        setOpen={setOpenPreview}
        postData={itemSelected}
        mediaLink={itemSelected?.mediaLink}
        postType={itemSelected?.postType}
      />

      <ConvertToPostDialog
        open={openConvert}
        handleClose={() => {
          setOpenConvert(false);
          resetCheckBoxs();
        }}
        codeList={codeListSelected}
        onRefresh={() => {
          fetchData();
          resetCheckBoxs();
        }}
      />

      {/* isPopupInfo */}
      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={isPopupInfo}
        acceptLabel={dataMessage?.labelButton || 'close'}
        onAccept={() => {
          setIsPopupInfo(false);
        }}
        titleHead={
          <Typography style={{ marginBottom: 16 }} variant="subtitle1">
            {dataMessage?.title || ''}
          </Typography>
        }
        titleLabel={<Typography variant="body1">{dataMessage?.message || ''}</Typography>}
        onClose={() => setIsPopupInfo(false)}
      />

      {/* isConfirmDelete */}
      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={isConfirmDelete}
        acceptLabel="delete"
        rejectLabel="cancel"
        onAccept={() => {
          onDeleteBulk && onDeleteBulk(itemSelected?.id);
          setItemSelected(undefined);
          setIsConfirmDelete(false);
          resetCheckBoxs();
        }}
        titleHead={
          <Typography style={{ marginBottom: 16 }} variant="subtitle1">
            Xác nhận xóa
          </Typography>
        }
        titleLabel={<Typography variant="body1">Bạn có chắc muốn xóa crawler?</Typography>}
        onClose={() => setIsConfirmDelete(false)}
        onReject={() => setIsConfirmDelete(false)}
      />

      {/* isConfirmDeleteList */}
      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={isConfirmDeleteList}
        acceptLabel="delete"
        rejectLabel="cancel"
        onAccept={() => {
          onDeleteBulk && onDeleteBulk(checkBoxList);
          setIsConfirmDeleteList(false);
          resetCheckBoxs();
        }}
        titleHead={
          <Typography style={{ marginBottom: 16 }} variant="subtitle1">
            Xác nhận xóa
          </Typography>
        }
        titleLabel={
          <Typography variant="body1">
            Bạn có chắc muốn xóa {countSelected} crawler đã chọn?
          </Typography>
        }
        onClose={() => setIsConfirmDeleteList(false)}
        onReject={() => setIsConfirmDeleteList(false)}
      />
    </>
  );
};

export default PostCrawlerList;
