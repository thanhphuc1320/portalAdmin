/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback, useRef, useState } from 'react';
import {
  Card,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Box,
  Chip,
} from '@material-ui/core';
import { Form, Formik } from 'formik';
import { GRAY, BLACK_500, RED, BLUE } from 'configs/colors';
import moment, { Moment } from 'moment';
import { DATE_TIME_HOUR_FORMAT_DB, DATE_TIME_HOUR_FORMAT_PICKER } from 'models/moment';
import DatetimePickerField from 'modules/common/components/DatetimePickerField';

import AddBoxIcon from '@material-ui/icons/AddBox';
import '../style.scss';
import { useHistory } from 'react-router';

const cssClass = 'pin-card';
interface Props {
  filter?: any;
  onUpdateFilter(dataToUpdate: any): void;
  listRightItem: any;
  editItem?: boolean;
  isError?: boolean;
  idConflict?: any;
  setOpen: () => void;
}
const RightFilter: React.FC<Props> = props => {
  const history = useHistory();
  const { filter, onUpdateFilter, listRightItem, editItem, idConflict, setOpen } = props;
  const dateChooseDefault = { beginAt: '', endAt: '' };
  const inputRefChip = useRef<any>();
  const [chipData, setChipData] = useState<any>([]);
  const [chipDataTemp, setChipDataTemp] = useState<any>();
  const [dateChoose, setDateChoose] = useState(dateChooseDefault);
  const [isErrorEndAt, setIsErrorEndAt] = useState(false);
  const itemSelected = listRightItem[listRightItem?.length - 1];

  React.useEffect(() => {
    setChipData(itemSelected?.offsets || []);
    setDateChoose({ beginAt: itemSelected?.beginAt, endAt: itemSelected?.endAt });
    setChipDataTemp('');
    inputRefChip.current.value = '';
    // eslint-disable-next-line
  }, [listRightItem]);

  React.useEffect(() => {
    // onUpdateFilter()
    const dataToSubmit = {
      ...itemSelected,
      offsets: chipData,
      beginAt: dateChoose.beginAt,
      endAt: dateChoose.endAt,
    };
    onUpdateFilter(dataToSubmit);
    // eslint-disable-next-line
  }, [chipData, dateChoose]);

  const handleDeleteChip = chipToDelete => {
    // eslint-disable-next-line
    setChipData(chipData => chipData.filter(chip => chip !== chipToDelete));
  };
  const handleAddChip = () => {
    const isExitChip = chipData.includes(+chipDataTemp);
    // eslint-disable-next-line no-restricted-globals
    if (!isExitChip && chipDataTemp !== '' && !isNaN(chipDataTemp)) {
      if (editItem) {
        setChipData([+chipDataTemp]);
      } else {
        setChipData([...chipData, +chipDataTemp]);
      }
      inputRefChip.current.value = '';
    }
  };

  const handleChangeDate = useCallback(
    (value, field, setFieldValue) => {
      const convertTime = moment(value).format(DATE_TIME_HOUR_FORMAT_DB);
      if (field === 'beginAt') {
        setDateChoose({ beginAt: convertTime, endAt: '' });
        setFieldValue('beginAt', value ? convertTime : '');
        setFieldValue('endAt', '');
      } else if (moment(dateChoose.beginAt) < moment(convertTime)) {
        setFieldValue('endAt', value ? convertTime : null);
        setDateChoose({ ...dateChoose, [field]: convertTime });
        setIsErrorEndAt(false);
      } else {
        setIsErrorEndAt(true);
      }
    },
    [dateChoose],
  );

  const handleClickPinID = () => {
    history.replace(`/pin?id=${idConflict}`);
    setOpen();
  };

  return (
    <Card className={`${cssClass}`} style={{ backgroundColor: '#F7F7F7' }}>
      <Formik
        enableReinitialize
        initialValues={{
          ...filter,
          caId: filter?.caId ? Number(filter?.caId) : undefined,
        }}
        onSubmit={async () => {
          // onUpdateFilter && onUpdateFilter(values);
        }}
      >
        {({ values, setFieldValue }) => {
          return (
            <Form>
              <Grid container>
                <Grid item xs={12} style={{ position: 'relative' }}>
                  <Typography style={{ marginBottom: 10 }} variant="subtitle2">
                    Thông số Pin
                  </Typography>
                </Grid>
                {itemSelected?.categoryType === 'SECTION' ? (
                  <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                      Section ID
                    </Typography>
                    <Typography style={{ color: BLACK_500, fontWeight: 'bold' }} variant="caption">
                      {itemSelected?.id}
                    </Typography>
                  </Grid>
                ) : (
                  <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                      Post ID
                    </Typography>
                    <Typography style={{ color: BLACK_500, fontWeight: 'bold' }} variant="caption">
                      {itemSelected?.id}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={11} style={{ position: 'relative', marginTop: '10px' }}>
                  <Typography style={{ position: 'absolute' }}>Vị trí xuất hiện</Typography>
                  <FormControl
                    variant="outlined"
                    aria-label="Vị trí xuất hiện"
                    style={{ marginTop: '10px' }}
                  >
                    <InputLabel htmlFor="outlined-adornment-location" style={{ top: 14 }}>
                      {' '}
                      Nhập vị trí
                    </InputLabel>
                    <OutlinedInput
                      inputRef={inputRefChip}
                      id="outlined-adornment-location"
                      type="text"
                      value={values.chip}
                      onChange={event => setChipDataTemp(event.target.value)}
                      endAdornment={
                        <InputAdornment
                          style={{ paddingTop: '10px', paddingBottom: '10px' }}
                          position="end"
                        >
                          <AddBoxIcon
                            style={{ cursor: 'pointer' }}
                            color="primary"
                            onClick={handleAddChip}
                          />
                        </InputAdornment>
                      }
                      labelWidth={70}
                    />
                  </FormControl>
                  <Box
                    style={{
                      maxHeight: '80px',
                      overflowY: 'auto',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      flexWrap: 'wrap',
                    }}
                  >
                    {chipData?.map(data => {
                      return (
                        <div style={{ marginLeft: '5px', marginTop: '5px' }}>
                          <Chip label={data} onDelete={() => handleDeleteChip(data)} />
                        </div>
                      );
                    })}
                  </Box>
                  {/* {isError && !chipData.length && (
                    <Typography variant="body2" style={{ width: '100%', color: RED }}>
                      Vui lòng không để trống
                    </Typography>
                  )} */}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  style={{ marginTop: '10px', width: '100%', maxWidth: '100%' }}
                >
                  <DatetimePickerField
                    id="beginAt"
                    label={
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Thời gian
                      </Typography>
                    }
                    placeholder="Từ ngày"
                    inputStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    optional
                    date={dateChoose?.beginAt ? moment(dateChoose?.beginAt) : undefined}
                    minDate={moment(new Date()).add(2, 'hours')}
                    onChange={(beginAt: Moment | null) => {
                      handleChangeDate(beginAt, 'beginAt', setFieldValue);
                    }}
                    disablePast
                  />
                  {/* {isError && !dateChoose.beginAt && (
                    <Typography variant="body2" style={{ width: '100%', color: RED }}>
                      Vui lòng không để trống
                    </Typography>
                  )} */}

                  <DatetimePickerField
                    id="endAt"
                    placeholder="Đến ngày"
                    inputStyle={{ width: 200, marginRight: 0, minWidth: 'unset' }}
                    optional
                    date={dateChoose?.endAt ? moment(dateChoose?.endAt) : undefined}
                    minDate={moment(dateChoose?.beginAt)}
                    onChange={(endAt: Moment | null) => {
                      handleChangeDate(endAt, 'endAt', setFieldValue);
                    }}
                    disablePast
                  />
                  {isErrorEndAt && (
                    <Typography variant="body2" style={{ width: '100%', color: RED }}>
                      Đến Ngày Phải Lớn Hơn Từ Ngày
                    </Typography>
                  )}
                </Grid>
                {idConflict && (
                  <Grid
                    item
                    xs={12}
                    style={{
                      marginTop: '10px',
                      width: '100%',
                      maxWidth: '100%',
                      display: 'inline-block',
                    }}
                  >
                    <Typography variant="body2" style={{ width: '100%', color: RED }}>
                      Vị trí và thời gian bạn nhập trùng với
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ width: '100%', color: BLUE, cursor: 'pointer' }}
                      onClick={handleClickPinID}
                    >
                      PinID {idConflict}
                    </Typography>
                  </Grid>
                )}

                {editItem && (
                  <>
                    <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Ngày tạo
                      </Typography>
                      <Typography
                        style={{ color: BLACK_500, fontWeight: 'bold' }}
                        variant="caption"
                      >
                        {listRightItem?.length > 0 &&
                          moment(itemSelected?.createdAt).format(DATE_TIME_HOUR_FORMAT_PICKER)}
                      </Typography>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}
                    >
                      <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
                        Người tạo
                      </Typography>
                      <Typography
                        style={{ color: BLACK_500, fontWeight: 'bold' }}
                        variant="caption"
                      >
                        {listRightItem?.length && itemSelected?.createdByName}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </Card>
  );
};

export default React.memo(RightFilter);
