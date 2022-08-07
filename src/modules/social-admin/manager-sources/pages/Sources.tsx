import React, { useCallback, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import queryString from 'query-string';

import { Typography } from '@material-ui/core';
import LoadingButton from 'modules/common/components/LoadingButton';
import ModalAddEdit from '../components/manager-source/ModalAddEdit';
import SourceFilter from '../components/manager-source/SourceFilter';
import ManagerSourcesTable from '../components/manager-source/SourceTable';

import './style.scss';

const cssClass = 'sources-list-page';

interface Props {}

const SourceManager: React.FC<Props> = () => {
  const location = useLocation();
  const history = useHistory();
  const [isHideFilter, setIsHideFilter] = useState(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>((queryString.parse(location.search) as unknown) as any);
  const [open, setOpen] = useState<boolean>(false);
  const [itemEdit, setItemEdit] = useState<any>({});
  const [isFilter, setIsFilter] = useState<boolean>(false);

  const onUpdateFilter = (values: any) => {
    setFilter(values);
    history.replace({ search: queryString.stringify(values) });
  };

  const onToggleFilter = useCallback(() => {
    setIsHideFilter(!isHideFilter);
  }, [isHideFilter]);

  const handleEditItem = item => {
    setItemEdit(item);
    setOpen(true);
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
        onClick={() => {
          setItemEdit({});
          setOpen(true);
        }}
      >
        <Typography style={{ color: 'white' }}>Thêm sources</Typography>
      </LoadingButton>
      <ModalAddEdit
        open={open}
        setOpen={setOpen}
        itemEdit={itemEdit}
        onUpdate={() => setIsUpdate(!isUpdate)}
      />
      <div
        className={`${cssClass}-left`}
        style={{ width: `calc(100% - 26px - ${widthSideBar}px)` }}
      >
        <ManagerSourcesTable
          filter={filter}
          setFilter={setFilter}
          onUpdateFilter={onUpdateFilter}
          onToggleFilter={onToggleFilter}
          isUpdate={isUpdate}
          onEditItem={handleEditItem}
          isFilter={isFilter}
          setIsFilter={value => setIsFilter(value)}
        />
      </div>
      <div
        className={`${cssClass}-right ${isHideFilter && 'hide'}`}
        style={{ width: widthSideBar }}
      >
        <SourceFilter
          filter={filter}
          onUpdateFilter={(values: any) => onUpdateFilter({ ...values, page: 0, size: 10 })}
          onToggleFilter={onToggleFilter}
          setIsFilter={value => setIsFilter(value)}
        />
      </div>
    </div>
  );
};

export default SourceManager;
