import { Box, Button, Dialog, DialogTitle, Grid, IconButton, Typography } from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';
import { API_PATHS } from 'configs/API';
import { some } from 'configs/utils';
import { snackbarSetting } from 'modules/common/components/elements';
import { fetchThunk } from 'modules/common/redux/thunk';
import { useSnackbar } from 'notistack';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import LeftFilter from './components/LeftCreateFilter';
import RightFilter from './components/RightCreateFilter';
import CreatePinTableArticle from './components/ArticleTable';
import CreatePinTableSection from './components/SectionTable';
import './style.scss';

const cssClass = 'create-pin-dialog';
interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  caIdList?: some[];
  sectionList: some[];
  dataTable: any;
  choosePinItem: any;
  closeEdit: (value: boolean) => void;
  fetchDataTable: () => void;
}

const CreateUpdatePinItem: React.FC<Props> = props => {
  const { setOpen, open, caIdList, sectionList, choosePinItem, closeEdit, fetchDataTable } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [filter] = useState<any>((queryString.parse(location.search) as unknown) as any);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [dataModelToSubmit, setDataModelToSubmit] = useState<any>([]);
  const [typeCate, setTypeCate] = useState<string>('');
  const [listRightItem, setListRightItem] = useState<any[]>([]);
  const [listArticle, setListArticle] = useState<any>([]);
  const [leftFilter, setLeftFilter] = useState<any>({});
  const [editItem, setEditItem] = useState<boolean>(false);
  const [dataSectionList, setDataSectionList] = useState<any>(sectionList);
  const [listItemSelected, setSetItemSelected] = useState<any>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [idConflict, setIdConflict] = useState<boolean>(false);
  const [itemToRemove, setItemToRemove] = useState<any>();

  const handleUpdateLeftFilter = (values: any, postIds: any) => {
    if (values.categoryLeft === 'ARTICLE') {
      setTypeCate('ARTICLE');
      setListArticle(postIds);
      setListRightItem([]);
      setDataModelToSubmit(postIds);
    } else if (values.categoryLeft === 'SECTION') {
      setDataModelToSubmit(sectionList);
      setTypeCate('SECTION');
      setListRightItem([]);
    } else {
      setListRightItem([]);
      setListArticle([]);
    }
    setIsError(false);
    setLeftFilter(values);
  };

  const handleClose = () => {
    handleDenied();
    setSetItemSelected([]);
  };

  useEffect(() => {
    if (sectionList) setDataSectionList(sectionList);
    //eslint-disable-next-line
  }, [sectionList]);

  useEffect(() => {
    if (choosePinItem.length > 0) {
      setSetItemSelected([...listItemSelected, ...choosePinItem]);
      setEditItem(true);
      setListRightItem([...listRightItem, ...choosePinItem]);
      setDataModelToSubmit([...dataModelToSubmit, ...choosePinItem]);
      setTypeCate(choosePinItem[choosePinItem?.length - 1]?.categoryType);
      setListArticle(choosePinItem);
      setDataSectionList(choosePinItem);
    } else {
      setLeftFilter({});
      setTypeCate('');
      setListRightItem([]);
      setListArticle([]);
      setDataSectionList(sectionList);
    }
    //eslint-disable-next-line
  }, [choosePinItem]);

  const checkValidate = () => {
    for (var key in leftFilter) {
      if (leftFilter[key] === '' || leftFilter[key]?.length === 0) {
        return false;
      }
    }
    return true;
  };

  const handleAccept = async () => {
    setLoading(true);
    const validate = checkValidate();
    if (validate) {
      setIsError(false);
      let configForm = await dataModelToSubmit.reduce((acc, curr) => {
        if (curr.endAt) {
          acc.push(curr);
        }
        return acc;
      }, []);
      const formData = await configForm.map(item => {
        const form = {
          beginAt: item.beginAt,
          caId: item.caId,
          tabType: item.tabType,
          categoryType: item.categoryType,
          modelType: item.categoryType === 'ARTICLE' ? 'Post' : 'Section',
          targetId: !editItem ? item.id : item.targetId,
          offsets: item.offsets,
          endAt: item.endAt,
          isActive: true,
        };
        return form;
      });

      // --------------- new feature ---------------------------------------------------------

      const dataToFinalSubmit: any = [];

      for (let key in formData) {
        console.log(key);
        const itemPush = formData[key].offsets.map(item => {
          const data = {
            ...formData[key],
            offset: item,
          };
          return data;
        });
        dataToFinalSubmit.push(itemPush);
      }

      let dataToFinalSubmit2: any = [];
      for (let key in dataToFinalSubmit) {
        dataToFinalSubmit[key].map(item => {
          console.log(item);
          dataToFinalSubmit2.push(item);

          return item;
        });
      }

      // console.log(dataToFinalSubmit2);
      //-----------------------------------------------------------------------------------------------
      let result: any;

      if (!editItem) {
        result = await dispatch(
          fetchThunk(API_PATHS.createPins, 'post', JSON.stringify(dataToFinalSubmit2)),
        );
      } else {
        result = await dispatch(
          fetchThunk(
            `${API_PATHS.updatePin}?id=${configForm[0]?.id}`,
            'put',
            JSON.stringify(formData[0]),
          ),
        );
      }

      setLoading(false);
      if (result?.code === 200) {
        result?.message &&
          enqueueSnackbar(
            result?.message,
            snackbarSetting(key => closeSnackbar(key), { color: 'success' }),
          );
        handleDenied();
        fetchDataTable();
        configForm = [];
      } else if (result?.code === 406) {
        if (result?.errors?.length > 0) {
          const messageError = result?.errors[0]?.object;
          const firstIndex = messageError.indexOf('[');
          const lastIndex = messageError.lastIndexOf(']');
          const pinError = messageError.slice(firstIndex, lastIndex).split('[');
          setIdConflict(pinError);
          enqueueSnackbar(
            `Vị trí hoặc thời gian bạn chọn trùng với PIN_ID ${pinError[1]}`,
            snackbarSetting(key => closeSnackbar(key), { color: 'error' }),
          );
        } else {
          enqueueSnackbar(
            result?.message,
            snackbarSetting(key => closeSnackbar(key), { color: 'error' }),
          );
        }
      } else {
        result?.message &&
          enqueueSnackbar(
            `Vui lòng kiểm tra lại các trường`,
            snackbarSetting(key => closeSnackbar(key), { color: 'error' }),
          );
      }
    } else {
      setIsError(true);
      setLoading(false);
    }
  };

  const handleDenied = () => {
    setOpen(false);
    setEditItem(false);
    setLeftFilter({});
    setTypeCate('');
    setListRightItem([]);
    setListArticle([]);
    closeEdit(true);
    setIdConflict(false);
    setDataModelToSubmit([]);
    setIsError(false);
  };

  const handleSelectItemSection = data => {
    if (data.length > 0) {
      setListRightItem(data);
    }
  };
  const handleItemsSelected = (listItem: any[]) => {
    if (listItem.length > 0) {
      setListRightItem(listItem);
    }
  };

  const handleUpdateRightFilter = dataToUpdate => {
    delete dataToUpdate.index;
    if (!editItem) {
      const configDataToUpdate = {
        ...dataToUpdate,
        caId: leftFilter?.caIdLeft,
        tabType: leftFilter?.tabLeft,
      };
      const foundIndex = dataModelToSubmit.findIndex(ele => ele.id === configDataToUpdate.id);
      if (foundIndex !== -1) {
        dataModelToSubmit[foundIndex] = configDataToUpdate;
        setIdConflict(false);
        setDataModelToSubmit(dataModelToSubmit);
      }
    } else {
      const foundIndex = dataModelToSubmit.findIndex(ele => ele.id === dataToUpdate.id);
      if (foundIndex !== -1) {
        dataModelToSubmit[foundIndex] = dataToUpdate;
        setIdConflict(false);
        setDataModelToSubmit(dataModelToSubmit);
      }
    }
  };

  return (
    <Dialog fullWidth={true} maxWidth={'lg'} open={open} onClose={handleClose}>
      <DialogTitle style={{ paddingBottom: 0 }}>
        <Typography className={`${cssClass}-title`}>
          {`${editItem ? 'Chỉnh sửa' : 'Thêm'} bài viết / section vào danh sách ghim`}
        </Typography>
        <IconButton
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            padding: 0,
          }}
          onClick={handleClose}
        >
          <IconClose />
        </IconButton>
      </DialogTitle>
      <Box className={`${cssClass}-body`}>
        <Grid container>
          {!editItem && (
            <Grid item xs={3} style={{ display: 'flex', justifyContent: 'center' }}>
              <Box className={`${cssClass}-body-left-result`}>
                <LeftFilter
                  filter={filter}
                  onUpdateLeftFilter={handleUpdateLeftFilter}
                  caIdList={caIdList}
                  isError={isError}
                  itemToRemove={itemToRemove}
                />
              </Box>
            </Grid>
          )}
          <Grid item xs={!editItem ? 6 : 9}>
            {typeCate !== 'ARTICLE' ? (
              <Box
                className={`${cssClass}-body-result`}
                style={editItem ? { maxWidth: 'none' } : {}}
              >
                <CreatePinTableSection
                  loading={loading}
                  sectionList={dataSectionList}
                  typeCate={typeCate}
                  choosePinItem={listItemSelected}
                  editItem={editItem}
                  onSelectItemSection={handleSelectItemSection}
                />
              </Box>
            ) : (
              <Box
                className={`${cssClass}-body-result`}
                style={editItem ? { maxWidth: 'none' } : {}}
              >
                <CreatePinTableArticle
                  loading={loading}
                  dataTable={listArticle}
                  onSelect={handleItemsSelected}
                  choosePinItem={listItemSelected}
                  editItem={editItem}
                  onItemToRemove={value => {
                    setItemToRemove(value);
                    setListRightItem([]);
                  }}
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={3}>
            <Box className={`${cssClass}-body-right-result`}>
              <RightFilter
                filter={filter}
                onUpdateFilter={handleUpdateRightFilter}
                listRightItem={listRightItem}
                editItem={editItem}
                isError={isError}
                idConflict={idConflict}
                setOpen={handleClose}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12} container direction="row" justifyContent="flex-end">
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            style={
              editItem
                ? { minWidth: 95, minHeight: 40, marginRight: 12, marginTop: 20 }
                : { minWidth: 95, minHeight: 40, marginRight: 12 }
            }
            onClick={handleDenied}
            disableElevation
          >
            <FormattedMessage id={'cancel'} />
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            style={
              editItem
                ? { minWidth: 95, minHeight: 40, marginRight: 12, marginTop: 20 }
                : { minWidth: 95, minHeight: 40, marginRight: 12 }
            }
            onClick={handleAccept}
            disableElevation
          >
            {editItem ? <FormattedMessage id={'update'} /> : <FormattedMessage id={'confirm'} />}
          </Button>
        </Grid>
      </Box>
    </Dialog>
  );
};
export default React.memo(CreateUpdatePinItem);
