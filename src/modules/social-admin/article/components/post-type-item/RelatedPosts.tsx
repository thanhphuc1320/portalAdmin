import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Paper, Typography, Divider, Checkbox } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { isArray } from 'lodash';
import qs from 'query-string';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { API_PATHS } from 'configs/API';
import { fetchThunk } from 'modules/common/redux/thunk';
import { setNotistackMessage } from 'modules/common/redux/reducer';
import { useFormikContext } from 'formik';
import { GRAY_DARK, GREY_400, PRIMARY, GRAY, GREY_300, RED } from 'configs/colors';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';
import { formatDateTimeHourText } from 'models/moment';
import TableCustom, { Columns } from 'modules/common/components/TableCustom';
import { Col, Row } from 'modules/common/components/elements';
import { ReactComponent as IconFeedPhoto } from 'svg/feed_photo.svg';
import { getTagUserPost, POST_TYPE_OPTIONS } from 'modules/social-admin/constants';
import { some } from 'configs/utils';

const PAGINATION = {
  PAGE_SIZE: 4,
  PAGE_FIRST: 0,
};

const MAX_CHECKED = 3;

interface Props {
  postIds: number[];
}

const ArticleItemFeaturedReview: React.FC<Props> = (props: Props) => {
  const { postIds } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { values, setFieldValue, errors, submitCount } = useFormikContext();
  const [data, setData] = useState<some>();
  const [checkBoxList, setCheckBoxList] = useState<number[]>([]);
  const [selectedList, setSelectedList] = useState<some[]>([]);
  const [postIdsSearch, setPostIdsSearch] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>({
    page: PAGINATION.PAGE_FIRST,
    size: PAGINATION.PAGE_SIZE,
  });
  const valuesPost = (values as any) || {};
  const errorsPost = (errors as any) || {};
  const caId = valuesPost?.caId;

  const getPostsByIds = useCallback(
    async (ids: number[], filterData: any) => {
      setLoading(true);
      const filterCaId = caId ? { caId } : {};
      const params = {
        ids: ids?.toString(),
        status: 'APPROVED',
        isActive: true,
        sort: 'createdAt,desc',
        page: filterData?.page || PAGINATION.PAGE_FIRST,
        size: PAGINATION.PAGE_SIZE,
        ...filterCaId,
      };
      const json = await dispatch(
        fetchThunk(`${API_PATHS.adminPost}?${qs.stringify(params)}`, 'get'),
      );
      if (json?.data) {
        setData(json.data);
        setLoading(false);
        setSelectedList(json?.data.content || []);
      } else {
        json?.message && setNotistackMessage(json?.message, 'error');
        setLoading(false);
      }
    },
    [dispatch, caId],
  );

  const getPostsByFilter = useCallback(
    async (ids: number[], filterData: any) => {
      setLoading(true);
      const filterCaId = caId ? { caId } : {};
      const params = {
        ids: ids?.toString(),
        status: 'APPROVED',
        isActive: true,
        sort: 'createdAt,desc',
        page: filterData?.page || PAGINATION.PAGE_FIRST,
        size: PAGINATION.PAGE_SIZE,
        ...filterCaId,
      };
      const json = await dispatch(
        fetchThunk(`${API_PATHS.adminPost}?${qs.stringify(params)}`, 'get'),
      );
      if (json?.data) {
        setData(json.data);
        setLoading(false);
      } else {
        json?.message && setNotistackMessage(json?.message, 'error');
        setLoading(false);
      }
    },
    [dispatch, setData, caId],
  );

  const fetchAdminPostSearch = useCallback(
    async (str: string) => {
      const filterCaId = caId ? { caId } : {};
      const params = {
        keyword: str.trimLeft(),
        status: 'APPROVED',
        isActive: true,
        sort: 'createdAt,desc',
        page: PAGINATION.PAGE_FIRST,
        size: 10,
        ...filterCaId,
      };
      const json = await dispatch(
        fetchThunk(`${API_PATHS.adminPostSearch}?${qs.stringify(params)}`, 'get'),
      );
      return json?.data?.content || [];
    },
    [caId, dispatch],
  );

  useEffect(() => {
    if (postIds?.length > 0) {
      getPostsByIds(postIds, { page: PAGINATION.PAGE_FIRST });
      setCheckBoxList(postIds || []);
    }
  }, [postIds, getPostsByIds]);

  useEffect(() => {
    if (caId > 0) {
      getPostsByFilter([], { page: PAGINATION.PAGE_FIRST });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caId]);

  const dataConvertMentionUser: some = [];
  const mentionUsers = data?.metadata?.mentionUsers;

  if (mentionUsers) {
    for (const [key, value] of Object.entries(mentionUsers)) {
      dataConvertMentionUser.push({ id: parseInt(key, 10), name: value });
    }
  }

  const columns: Columns[] = [
    {
      style: { textAlign: 'center' },
      render: (record: some) => {
        return (
          <Checkbox
            color="primary"
            checked={checkBoxList?.includes(record?.id)}
            onChange={() => {
              if (!checkBoxList?.includes(record?.id)) {
                setCheckBoxList([...checkBoxList, record.id]);
                setFieldValue('hotelPostIds', [...checkBoxList, record.id], true);
                setSelectedList([...selectedList, record]);
              } else {
                const indexCheckBox = checkBoxList.indexOf(record?.id);
                if (indexCheckBox > -1) {
                  checkBoxList.splice(indexCheckBox, 1);
                  setCheckBoxList([...checkBoxList]);
                  setFieldValue('hotelPostIds', [...checkBoxList], true);
                  selectedList.filter((el: any) => el?.id !== record?.id);
                  setSelectedList([...selectedList]);
                }
              }
            }}
          />
        );
      },
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
      render: (record: some) => {
        return (
          <Row style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            {record?.thumbnail ? (
              <img
                src={record?.thumbnail}
                alt={record?.id}
                style={{ width: '48px', height: '48px', objectFit: 'cover' }}
              />
            ) : (
              <IconFeedPhoto />
            )}
            <Col style={{ marginLeft: 8, justifyContent: 'flex-start' }}>
              <Typography variant="subtitle2" style={{}}>
                <FormattedMessage id={record?.serviceType} />
              </Typography>
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
                <div
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html:
                      dataConvertMentionUser &&
                      getTagUserPost(record?.content, dataConvertMentionUser),
                  }}
                />
              </Typography>
            </Col>
          </Row>
        );
      },
    },
    {
      title: 'POST_TYPE',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography variant="body2">
          {POST_TYPE_OPTIONS?.find(element => element?.id === record?.type)?.name}
        </Typography>
      ),
    },
    {
      title: 'MADE_BY',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <>
          <Typography variant="body2" style={{ color: GRAY_DARK }}>
            {record.createdByName}
          </Typography>
          <Typography variant="caption" style={{ color: GRAY }}>
            {record?.createdBy}
          </Typography>
        </>
      ),
    },
    {
      title: 'createdAt',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
      render: (record: some) => (
        <Typography variant="caption" style={{ color: GRAY }}>
          {formatDateTimeHourText(record?.createdAt)}
        </Typography>
      ),
    },
    {
      title: 'Click',
      dataIndex: 'numOfClick',
      variant: 'subtitle2',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
    },
    {
      title: 'Comment',
      dataIndex: 'numOfComment',
      variant: 'subtitle2',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
    },
    {
      title: 'Like',
      dataIndex: 'numOfLike',
      variant: 'subtitle2',
      styleHeader: { textAlign: 'center' },
      style: { textAlign: 'center' },
    },
  ];

  const getDataTable = useCallback(() => {
    const postList = data?.content || [];
    let dataTableTemp = postList;
    if (postIdsSearch.length > 0) {
      dataTableTemp = [...selectedList, ...postList];
      if (dataTableTemp.length > 1) {
        return dataTableTemp.filter(
          (t: any, i: number, a: any) => a.findIndex((t2: any) => t2.id === t.id) === i,
        );
      }
    }
    return dataTableTemp;
  }, [data, postIdsSearch, selectedList]);

  const dataTable: some[] = getDataTable();

  return (
    <Paper className="pager-section-form">
      <Grid container style={{ paddingTop: 20 }}>
        <Grid item xs={7}>
          <Row>
            <Typography variant="subtitle1">Thêm bài viết liên quan nổi bật</Typography>
            <Typography variant="body2" style={{ color: GREY_400, marginLeft: 4 }}>
              (Tối đa 3 bài viết nổi bật)
            </Typography>
            {!caId && (
              <Typography variant="body2" style={{ color: RED, marginLeft: 10 }}>
                Bạn cần lựa chọn kênh chia sẻ trước khi tiếp tục!
              </Typography>
            )}
          </Row>
        </Grid>
        <Grid item xs={5}>
          <Row style={{ justifyContent: 'flex-end' }}>
            {caId && (
              <FormControlAutoComplete
                multiple
                id="postIds"
                placeholder="Tìm theo Post ID"
                options={[]}
                loadOptions={fetchAdminPostSearch}
                onChange={(e: any, value: some[] | null) => {
                  const ids = isArray(value) ? value?.map(item => item?.id) : [];
                  setPostIdsSearch(ids);
                  getPostsByFilter(ids, { page: PAGINATION.PAGE_FIRST });
                  setFilter({
                    size: PAGINATION.PAGE_SIZE,
                    page: PAGINATION.PAGE_FIRST,
                  });
                }}
                getOptionSelected={(option: some, value: some) => {
                  return option?.id === value;
                }}
                getOptionLabel={(v: some) => v?.id}
                filterOptions={options => options}
                getOptionDisabled={(option: some) => {
                  return (
                    postIdsSearch?.length >= MAX_CHECKED ||
                    postIds?.includes(option?.id) ||
                    postIdsSearch?.includes(option?.id)
                  );
                }}
                optional
                formControlStyle={{ width: 450, marginRight: 0, minWidth: 'unset' }}
                disabled={checkBoxList?.length >= MAX_CHECKED || !caId}
              />
            )}
          </Row>
        </Grid>
      </Grid>
      <Divider
        style={{
          borderTop: `1px dashed ${GREY_300}`,
          marginBottom: 0,
          backgroundColor: 'unset',
        }}
      />
      <Row>
        <TableCustom
          dataSource={dataTable}
          loading={loading}
          style={{ marginTop: 24, width: '100%' }}
          columns={columns}
          noColumnIndex
          rowsPerPageOptions={[4]}
          isHidePagination={postIdsSearch.length > 0}
          paginationProps={{
            count: data?.totalElements || 0,
            page: filter.page ? Number(filter?.page - 1) : 0,
            rowsPerPage: filter?.size || PAGINATION.PAGE_SIZE,
            onPageChange: (event: unknown, newPage: number) => {
              const pagination1 = { ...filter, page: newPage + 1, newPage };
              getPostsByFilter([], pagination1);
              setFilter(pagination1);
            },
            onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => {
              const pagination2 = {
                ...filter,
                size: event?.target?.value,
                page: PAGINATION.PAGE_FIRST,
              };
              setFilter(pagination2);
            },
          }}
        />
      </Row>
      {checkBoxList?.length > 0 && checkBoxList?.length <= MAX_CHECKED && (
        <Row>
          <Typography variant="body2" style={{ fontWeight: 'bold', marginTop: 15 }}>
            Đã chọn {checkBoxList?.length}/{MAX_CHECKED}
          </Typography>
        </Row>
      )}
      {submitCount > 0 && errorsPost.hotelPostIds && (
        <Row>
          <Typography variant="body2" style={{ color: RED, marginTop: 15 }}>
            {errorsPost.hotelPostIds}
          </Typography>
        </Row>
      )}
    </Paper>
  );
};

export default ArticleItemFeaturedReview;
