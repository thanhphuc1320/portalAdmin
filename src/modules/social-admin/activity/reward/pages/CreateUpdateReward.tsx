import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { API_PATHS } from 'configs/API';
import { fetchThunk } from 'modules/common/redux/thunk';
import { setNotistackMessage } from 'modules/common/redux/reducer';
import { fetchCaIDListPost } from 'modules/common/redux/actions';
import { some } from 'configs/utils';
import FormReward from '../components/FormReward';

interface Props {}

const CreateUpdateReward: React.FC<Props> = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const caIDListPost = useSelector((state: AppState) => state.common.caIDListPost);
  const [typeList, setTypeList] = useState<some[]>();
  const [valueTypeList, setValueTypeList] = useState<some[]>();

  const fetchTypeList = useCallback(async () => {
    const json = await dispatch(fetchThunk(API_PATHS.getAdminRewardTypeList, 'get'));
    if (json?.data) {
      setTypeList(json.data);
    } else {
      json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
    }
  }, [dispatch]);

  const fetchValueTypeList = useCallback(
    async (rewardTypeId: string) => {
      const json = await dispatch(
        fetchThunk(`${API_PATHS.getAdminRewardValueTypeList}?rewardTypeId=${rewardTypeId}`, 'get'),
      );
      if (json?.data) {
        setValueTypeList(json.data);
      } else {
        json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(fetchCaIDListPost());
    fetchTypeList();
  }, [dispatch, fetchTypeList]);

  return (
    <div style={{ maxWidth: 1400, margin: 'auto' }}>
      <FormReward
        caIdList={caIDListPost}
        typeList={typeList}
        valueTypeList={valueTypeList}
        onFetchValueTypeList={fetchValueTypeList}
      />
    </div>
  );
};
export default React.memo(CreateUpdateReward);
