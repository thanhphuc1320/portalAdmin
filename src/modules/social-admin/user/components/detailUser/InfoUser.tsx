import React, { useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { API_PATHS } from 'configs/API';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { fetchThunk } from 'modules/common/redux/thunk';
import { getOptionGenerateAvatar } from 'helpers/avatar';
import moment from 'moment';

import { setNotistackMessage } from 'modules/common/redux/reducer';
import { Avatar, Button, Paper, Typography } from '@material-ui/core';
import { Col, Row } from 'modules/common/components/elements';
import { DATE_FORMAT_SHOW_TIME } from 'models/moment';

import { BLACK, BLACK_500, GRAY } from 'configs/colors';
import { some } from 'configs/utils';

import { ReactComponent as IconButtonDetailUser } from 'svg/icon_detail_user.svg';

import '../../style.scss';

const cssClass = 'user-list-page-detailUser';
const textOverlow = 'user-list-page-text-overflow';
interface Props {
  userId: number;
}

const InfoUser: React.FC<Props> = props => {
  const { userId } = props;
  const history = useHistory();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [data, setData] = useState<some>([]);

  const handleFormatCreatedAt = createdAt => {
    if (!createdAt) return '-';
    return moment(createdAt).format(DATE_FORMAT_SHOW_TIME);
  };

  const dataShow = [
    {
      name: 'likeCount',
      showName: 'Lượt thích',
      value: data?.statistic?.numOfLike,
    },
    {
      name: 'following',
      showName: 'Đang theo dõi',
      value: data?.statistic?.numOfFollow,
    },
    {
      name: 'numOfFollowed',
      showName: 'Người theo dõi',
      value: data?.statistic?.numOfFollowYou,
    },
    {
      name: 'PostNums',
      showName: 'Số lượng bài viết',
      value: data?.statistic?.numOfPost,
    },
    {
      name: 'createAt',
      showName: 'Thời gian tạo',
      value: handleFormatCreatedAt(data?.createdAt),
    },
  ];

  const optionsAvatar = getOptionGenerateAvatar({
    id: data?.id,
    name: data?.name,
    size: 40,
  });

  const formatNumber = (number, digits) => {
    const lookup = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'G' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup
      .slice()
      .reverse()
      // eslint-disable-next-line func-names
      .find(function(ele) {
        return number >= ele.value;
      });

    return item ? (number / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
  };

  const getDataDetailUser = useCallback(async () => {
    const result = await dispatch(
      fetchThunk(`${API_PATHS.getApiAdminUser}?userId=${userId}`, 'get'),
    );
    if (result?.code === 200) {
      setData(result?.data.content[0]);
    } else {
      result?.message && dispatch(setNotistackMessage(result?.message, 'error'));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    userId && getDataDetailUser();
  }, [getDataDetailUser, userId]);

  return (
    <div>
      <Row className={cssClass}>
        <Paper className={`${cssClass}-LeftPaper`}>
          <Row className={`${cssClass}-ContentLeft`}>
            {data?.profilePhoto ? (
              <div style={{ width: 80, height: 80 }}>
                <Avatar
                  variant="circular"
                  src={data?.profilePhoto}
                  alt=""
                  style={{ objectFit: 'cover', width: 80, height: 80 }}
                />
              </div>
            ) : (
              <div style={{ width: 80, height: 80 }}>
                <Avatar
                  style={{
                    width: 80,
                    height: 80,
                    fontSize: 32,
                    backgroundColor: optionsAvatar.backgroundColor,
                  }}
                >
                  {optionsAvatar.letters}
                </Avatar>
              </div>
            )}
            <Col>
              <Typography
                className={textOverlow}
                variant="h6"
                style={{ color: BLACK_500, fontWeight: 'bold', width: 150 }}
              >
                {data?.name}
              </Typography>
              {/* <Row style={{ marginTop: 5, marginBottom: 5 }}>
                <Typography variant="body1" style={{ color: GRAY, marginRight: 10 }}>
                  Level <span> {data?.level}</span>
                </Typography>
                <Typography variant="body1" style={{ color: GRAY, marginLeft: 10 }}>
                  Class <span> {data?.rank}</span>
                </Typography>
              </Row> */}
              <Row>
                <Typography variant="body1" style={{ color: GRAY }}>
                  User ID <span> {data?.id}</span>
                </Typography>
              </Row>
            </Col>
          </Row>
        </Paper>
        <Paper className={`${cssClass}-RightPaper`}>
          <Row className="ContentLeft">
            {dataShow.map(item => {
              return (
                <Col className="LeftContent">
                  <Typography variant="body2" style={{ color: GRAY, marginBottom: 5 }}>
                    {item.showName}
                  </Typography>
                  <Typography variant="body2" style={{ color: BLACK, fontWeight: 'bold' }}>
                    {item.name !== 'createAt' ? formatNumber(item.value, 1) : item.value}
                  </Typography>
                </Col>
              );
            })}
          </Row>
          <Row style={{ alignItems: 'flex-end', height: '90%' }}>
            <Button
              style={{ width: 32, height: 32, margin: '0px 10px', padding: 'unset' }}
              onClick={() => {
                history?.push({
                  pathname: '/',
                  search: `userId=${data?.id}&userName=${data?.name}`,
                });
              }}
            >
              <IconButtonDetailUser />
            </Button>
          </Row>
        </Paper>
      </Row>
    </div>
  );
};

export default InfoUser;
