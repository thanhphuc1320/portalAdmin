import React, { useCallback, useEffect, useState } from 'react';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { API_PATHS } from 'configs/API';
import { fetchThunk } from 'modules/common/redux/thunk';
import { setNotistackMessage } from 'modules/common/redux/reducer';
import { fetchCaIDListPost } from 'modules/common/redux/actions';
import LoadingButton from 'modules/common/components/LoadingButton';

import { some } from 'configs/utils';
import Filter from '../components/Filter';
import PinTable from '../components/PinTable';
import CreateUpdatePinItem from '../components/CreateUpdatePinItemDialog/index';
import './style.scss';
import { Typography } from '@material-ui/core';

const cssClass = 'pin-list-page';

interface Props {}

const PinPage: React.FC<Props> = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const caIDListPost = useSelector((state: AppState) => state.common.caIDListPost);
  const [isHideFilter, setIsHideFilter] = useState(false);
  const [sectionList, setSectionList] = useState<some[]>();
  const [open, setOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>((queryString.parse(location.search) as unknown) as any);
  const [dataTable, setDataTable] = useState<any>([]);
  const [choosePinItem, setChoosePinItem] = useState<any>([]);
  const [fetchItemTable, setFetchItemTable] = useState<boolean>(false);

  const onUpdateFilter = (values: any) => {
    setFilter(values);
    history.replace({ search: queryString.stringify(values) });
  };

  const fetchSectionList = useCallback(async () => {
    const json = await dispatch(fetchThunk(API_PATHS.getAdminPinSectionList, 'get'));
    if (json?.code === 200) {
      setSectionList(json?.data?.content || []);
    } else {
      json?.message && dispatch(setNotistackMessage(json?.message, 'error'));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCaIDListPost());
    fetchSectionList();
  }, [dispatch, fetchSectionList]);

  const onToggleFilter = useCallback(() => {
    setIsHideFilter(!isHideFilter);
  }, [isHideFilter]);

  const handleDataTable = data => {
    setDataTable(data);
  };

  const handleEditItem = data => {
    setChoosePinItem([data]);
    setOpen(true);
  };

  const handleCloseModal = value => {
    if (value) {
      setChoosePinItem([]);
      setOpen(false);
    }
  };

  const handleFetchData = () => {
    setFetchItemTable(!fetchItemTable);
  };

  const widthSideBar = isHideFilter ? 0 : 234;
  return (
    <div className={`${cssClass}`}>
      <LoadingButton
        variant="contained"
        size="large"
        style={{
          minWidth: 135,
          marginLeft: 20,
          height: 32,
          position: 'absolute',
          right: 5,
          top: -48,
          zIndex: 10,
        }}
        color="primary"
        disableElevation
        loading={false}
        onClick={() => setOpen(true)}
      >
        <Typography style={{ color: 'white' }}>Thêm bài ghim</Typography>
      </LoadingButton>
      <CreateUpdatePinItem
        open={open}
        setOpen={setOpen}
        caIdList={caIDListPost}
        sectionList={sectionList || []}
        dataTable={dataTable}
        choosePinItem={choosePinItem}
        closeEdit={handleCloseModal}
        fetchDataTable={handleFetchData}
      />
      <div
        className={`${cssClass}-left`}
        style={{ width: `calc(100% - 26px - ${widthSideBar}px)` }}
      >
        <PinTable
          caIdList={caIDListPost}
          filter={filter}
          setFilter={setFilter}
          onUpdateFilter={onUpdateFilter}
          onToggleFilter={onToggleFilter}
          onData={handleDataTable}
          onEditItem={handleEditItem}
          fetchItemTable={fetchItemTable}
        />
      </div>
      <div
        className={`${cssClass}-right ${isHideFilter && 'hide'}`}
        style={{ width: widthSideBar }}
      >
        <Filter
          caIdList={caIDListPost || []}
          sectionList={sectionList || []}
          filter={filter}
          onUpdateFilter={(values: any) => onUpdateFilter({ ...values, page: 0, size: 10 })}
          onToggleFilter={onToggleFilter}
        />
      </div>
    </div>
  );
};

export default PinPage;
