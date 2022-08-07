import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Button } from '@material-ui/core';
import { isArray } from 'lodash';
import queryString from 'query-string';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { API_PATHS } from 'configs/API';
import { fetchThunk } from 'modules/common/redux/thunk';
import { setNotistackMessage } from 'modules/common/redux/reducer';
import { GRAY_DARK, PRIMARY } from 'configs/colors';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';
import { Row } from 'modules/common/components/elements';
import { some, isEmpty } from 'configs/utils';
import { CA_ID_INFO } from 'modules/auth/constants';
import { PAGINATION_CONVERT } from '../../constants';

interface Props {
  codes: string[];
  isLoading: boolean;
  filter: any;
  setFilter(values: any): void;
  onClose?(): void;
}

const ArticleItemFeaturedReview: React.FC<Props> = (props: Props) => {
  const { codes, isLoading, filter, setFilter, onClose } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [data, setData] = useState<some>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(
    async (codeList: string[], filterData: any) => {
      if (isEmpty(codeList)) {
        setData([]);
        return;
      }
      setLoading(true);
      const params = {
        codes: codeList,
        sort: 'createdAt,desc',
        page: filterData?.page || PAGINATION_CONVERT.PAGE_FIRST,
        size: PAGINATION_CONVERT.PAGE_SIZE,
      };
      const json = await dispatch(
        fetchThunk(`${API_PATHS.getAdminCrawlers}?${queryString.stringify(params)}`, 'get'),
      );
      if (json?.data) {
        setData(json.data);
        setLoading(false);
      } else {
        json?.message && setNotistackMessage(json?.message, 'error');
        setLoading(false);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    fetchData(codes, { page: PAGINATION_CONVERT.PAGE_FIRST });
  }, [fetchData, codes, isLoading]);

  const columns: Columns[] = [
    {
      title: 'stt',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some, index: number) => {
        const currentPage = filter?.page <= 1 ? 1 : filter?.page;
        return (
          <Typography variant="body2" style={{ color: GRAY_DARK }}>
            {PAGINATION_CONVERT.PAGE_SIZE * Number(currentPage) -
              PAGINATION_CONVERT.PAGE_SIZE +
              index +
              1}
          </Typography>
        );
      },
    },
    {
      title: 'crawlerID',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: some) => (
        <Button
          target="_blank"
          component="a"
          href={`/sources/manager-post?codes=${record.code}`}
          onClick={() => {
            onClose && onClose();
          }}
        >
          <Typography variant="subtitle2" style={{ color: PRIMARY }}>
            {record?.code}
          </Typography>
        </Button>
      ),
    },
    {
      title: 'tripiPartner',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: any) => {
        const postIdTripi =
          isArray(record?.posts) &&
          record?.posts?.find(t => t.caId === CA_ID_INFO.TRIPI_PARTNER)?.id;
        return (
          <Button
            target="_blank"
            component="a"
            href={`/?id=${postIdTripi}`}
            onClick={() => {
              onClose && onClose();
            }}
            disabled={!postIdTripi}
          >
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
          </Button>
        );
      },
    },
    {
      title: 'dinogo',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: any) => {
        const postIdDinogo =
          isArray(record?.posts) && record?.posts?.find(t => t.caId === CA_ID_INFO.DINOGO)?.id;
        return (
          <Button
            target="_blank"
            component="a"
            href={`/?id=${postIdDinogo}`}
            onClick={() => {
              onClose && onClose();
            }}
            disabled={!postIdDinogo}
          >
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
          </Button>
        );
      },
    },
    {
      title: 'mytour',
      styleHeader: { textAlign: 'left' },
      style: { textAlign: 'left' },
      render: (record: any) => {
        const postIdMyTour =
          isArray(record?.posts) && record?.posts?.find(t => t.caId === CA_ID_INFO.MYTOUR)?.id;
        return (
          <Button
            target="_blank"
            component="a"
            href={`/?id=${postIdMyTour}`}
            onClick={() => {
              onClose && onClose();
            }}
            disabled={!postIdMyTour}
          >
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
          </Button>
        );
      },
    },
  ];

  return (
    <Row>
      <TableCustom
        dataSource={data?.content || []}
        loading={loading}
        style={{ width: '100%' }}
        columns={columns}
        noColumnIndex
        rowsPerPageOptions={[4]}
        paginationProps={{
          count: data?.totalElements || 0,
          page: filter.page ? Number(filter?.page - 1) : 0,
          rowsPerPage: filter?.size || PAGINATION_CONVERT.PAGE_SIZE,
          onPageChange: (event: unknown, newPage: number) => {
            const pagination1 = { ...filter, page: newPage + 1, newPage };
            fetchData(codes, pagination1);
            setFilter(pagination1);
          },
          onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => {
            const pagination2 = {
              ...filter,
              size: event?.target?.value,
              page: PAGINATION_CONVERT.PAGE_FIRST,
            };
            setFilter(pagination2);
          },
        }}
      />
    </Row>
  );
};

export default ArticleItemFeaturedReview;
