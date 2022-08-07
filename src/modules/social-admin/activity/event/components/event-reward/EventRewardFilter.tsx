import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/reducers';
import { Form, Formik } from 'formik';
import { some } from 'configs/utils';
import { FieldSelectContent } from 'modules/common/components/FieldContent';
import FormControlAutoComplete from 'modules/common/components/FormControlAutoComplete';

const ACTIONS = {
  MULTI_DELETE: 'MULTI_DELETE',
};
interface Props {
  eventRewardList?: some[];
  rewardList?: some[];
  typeList?: some[];
  checkBoxList?: number[];
  loading?: boolean;
  disabledReward: boolean;
  filter?: any;
  setFilter?(values: some): void;
}

const Filter: React.FC<Props> = props => {
  const { eventRewardList, rewardList, typeList, disabledReward, filter, setFilter } = props;
  const eventRewardListState = useSelector((state: AppState) => state.event?.eventRewardList);

  const onChangeFilter = (values: some) => {
    setFilter && setFilter(values);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...filter,
        name: filter?.name ? String(filter?.name) : undefined,
        rewardId: filter?.rewardId ? Number(filter?.rewardId) : undefined,
        type: filter?.type ? String(filter?.type) : undefined,
      }}
      onSubmit={() => {}}
    >
      {({ values, setFieldValue }) => {
        const eventRewardSelected =
          eventRewardList?.find((er: some) => er.name === values?.name) || {};

        const rewardId = eventRewardSelected?.reward?.id || values?.rewardId;
        const rewardSelected = rewardList?.find((r: some) => r?.id === rewardId) || {};

        const typeId = rewardSelected?.type || values?.type;
        const typeSelected = typeList?.find((t: some) => t.id === typeId) || null;

        return (
          <Form style={{ display: 'flex', alignItems: 'center', marginTop: 22 }}>
            <FormControlAutoComplete
              id="name"
              placeholder="Loại"
              label={null}
              value={eventRewardSelected}
              onChange={(e: any, valueItem: some | null) => {
                setFieldValue('name', valueItem?.name);
                onChangeFilter({
                  name: valueItem?.name,
                  rewardId: undefined,
                  type: undefined,
                });
              }}
              options={eventRewardListState as some[]}
              getOptionLabel={(one: some) => one.name}
              getOptionSelected={(option: some, value: some) => {
                return option?.name === value?.name;
              }}
              optional
              formControlStyle={{ width: 150, minWidth: 'unset', marginRight: 10 }}
            />

            <FormControlAutoComplete
              id="rewardId"
              placeholder="Reward Code"
              label={null}
              value={rewardSelected}
              onChange={(e: any, valueItem: some | null) => {
                setFieldValue('rewardId', valueItem?.id);
                setFieldValue('name', undefined);
                onChangeFilter({
                  rewardId: valueItem?.id,
                  name: undefined,
                  type: undefined,
                });
              }}
              options={rewardList as some[]}
              getOptionLabel={(one: some) => one.code}
              getOptionSelected={(option: some, value: some) => {
                return option?.id === value?.id;
              }}
              optional
              formControlStyle={{ width: 150, minWidth: 'unset', marginRight: 10 }}
            />

            <FormControlAutoComplete
              id="rewardId"
              placeholder="Reward Name"
              label={null}
              value={rewardSelected}
              onChange={(e: any, valueItem: some | null) => {
                setFieldValue('rewardId', valueItem?.id);
                setFieldValue('name', undefined);
                onChangeFilter({
                  rewardId: valueItem?.id,
                  name: undefined,
                  type: undefined,
                });
              }}
              options={rewardList as some[]}
              getOptionLabel={(one: some) => one.name}
              getOptionSelected={(option: some, value: some) => {
                return option?.id === value?.id;
              }}
              optional
              formControlStyle={{ width: 150, minWidth: 'unset', marginRight: 10 }}
            />

            <FormControlAutoComplete
              id="type"
              placeholder="Loại giải thưởng"
              label={null}
              value={typeSelected}
              onChange={(e: any, valueItem: some | null) => {
                setFieldValue('type', valueItem?.id);
                setFieldValue('rewardId', undefined);
                setFieldValue('name', undefined);
                onChangeFilter({
                  type: valueItem?.id,
                  name: undefined,
                  rewardId: undefined,
                });
              }}
              options={typeList as some[]}
              getOptionLabel={(one: some) => one.name}
              getOptionSelected={(option: some, value: some) => {
                return option?.id === value?.id;
              }}
              optional
              formControlStyle={{ width: 150, minWidth: 'unset', marginRight: 10 }}
            />

            <FieldSelectContent
              name="action"
              placeholder="Thao tác"
              formControlStyle={{ width: 150, minWidth: 'unset', marginRight: 10 }}
              style={{ width: 150 }}
              label={null}
              options={[{ id: ACTIONS.MULTI_DELETE, name: 'Xóa' }]}
              optional
              onSelectOption={() => {}}
              disabled={disabledReward}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default Filter;
