import React, { useCallback, useState } from 'react';
import { Box, Grid, Dialog, DialogTitle, IconButton, Typography } from '@material-ui/core';
import IconClose from '@material-ui/icons/CloseOutlined';
import { API_PATHS } from 'configs/API';
import { snackbarSetting } from 'modules/common/components/elements';
import { fetchThunk } from 'modules/common/redux/thunk';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers';
import { some, isEmpty } from 'configs/utils';
import Filter from './Filter';
import SearchFlightTable from './SearchFlightTable';
import { ReactComponent as IconNoSearch } from 'svg/No_Search_Result.svg';
import LoadingIcon from 'modules/common/components/LoadingIcon';
import { PAGINATION_FLIGHT_SERVICE } from '../constants';
import './style.scss';

const cssClass = 'article-search-flight-dialog';
export interface SimpleDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  caId: number;
  serviceNumber: number;
}

function SearchFlightDialog(props: SimpleDialogProps) {
  const { setOpen, open, caId, serviceNumber } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<any>();
  const [flightsSearch, setFlightsSearch] = useState<some[]>();

  const fetchFlightSearch = useCallback(
    async (values: any) => {
      setLoading(true);
      const json = await dispatch(
        fetchThunk(API_PATHS.searchFlightsServiceAdmin(caId), 'post', JSON.stringify(values)),
      );
      if (json?.data?.content) {
        setLoading(false);
        setFlightsSearch(json.data.content);
        const tempData = json.data;
        delete tempData.content;
        setFilter({ ...values, ...tempData });
      } else {
        setLoading(false);
        json?.message &&
          enqueueSnackbar(
            json?.message,
            snackbarSetting(key => closeSnackbar(key), {
              color: 'error',
            }),
          );
      }
    },
    [caId, closeSnackbar, dispatch, enqueueSnackbar],
  );

  const onUpdateFilter = useCallback(
    (values: any) => {
      if (isEmpty(values)) {
        setFlightsSearch([]);
        return;
      }
      const filterParams = {
        fromAirport: values?.fromAirport,
        toAirport: values?.toAirport,
        departureDate: values?.departureDate,
        numberOfAdults: values?.numberOfAdults || 1,
        numberOfStops: values?.numberOfStops,
        airlines: values?.airlines,
        ticketClassCodes: values?.ticketClassCodes,
        size: values?.size ? Number(values?.size) : PAGINATION_FLIGHT_SERVICE.PAGE_SIZE,
        page: values?.page ? Number(values?.page) : PAGINATION_FLIGHT_SERVICE.PAGE_FIRST,
      };
      fetchFlightSearch(filterParams);
      setFilter(filterParams);
    },
    [fetchFlightSearch],
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    setFlightsSearch([]);
  }, [setOpen]);

  const updateSuccess = useCallback(() => {
    setFlightsSearch([]);
    setOpen(false);
  }, [setFlightsSearch, setOpen]);

  return (
    <Dialog
      fullWidth={true}
      maxWidth={false}
      open={open}
      onClose={handleClose}
      className={`${cssClass}`}
    >
      <DialogTitle style={{ paddingBottom: 0 }}>
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
      <Box className={`${cssClass}-wrapper`}>
        <Box className={`${cssClass}-header`}>
          <Typography variant="h6" style={{ marginBottom: 15, fontWeight: 'bold' }}>
            Dịch vụ máy bay
          </Typography>
        </Box>
        <Box className={`${cssClass}-body`}>
          <Grid container>
            <Grid item xs={2}>
              <Filter filter={filter} onUpdateFilter={onUpdateFilter} loading={loading} />
            </Grid>
            <Grid item xs={10}>
              {!isEmpty(flightsSearch) ? (
                <Box className={`${cssClass}-body-result`}>
                  <SearchFlightTable
                    data={flightsSearch}
                    serviceNumber={serviceNumber}
                    updateSuccess={updateSuccess}
                    loading={loading}
                    filter={filter}
                    hadleFilter={(values: some) => {
                      onUpdateFilter({ ...filter, ...values });
                    }}
                  />
                </Box>
              ) : (
                <Box className={`${cssClass}-body-no-search`}>
                  <IconNoSearch />
                  {loading && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -70,
                        bottom: 0,
                        right: 20,
                        left: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <LoadingIcon />
                    </div>
                  )}
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Dialog>
  );
}

export default SearchFlightDialog;
