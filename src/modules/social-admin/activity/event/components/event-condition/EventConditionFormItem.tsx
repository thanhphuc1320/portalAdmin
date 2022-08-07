import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Button } from '@material-ui/core';
import { GRAY, PRIMARY } from 'configs/colors';
import { some } from 'configs/utils';
import { FieldSelectContent, FieldTextContent } from 'modules/common/components/FieldContent';
import { NumberFormatCustomNonDecimal } from 'modules/common/components/Form';
import { ReactComponent as IconBtnRemove } from 'svg/btn-icon-remove-primary.svg';
import { EQUALS } from 'modules/social-admin/activity/event/constants';

interface Props {
  index: number;
  targets: some[];
  metaConditions: some[];
  dataRow: any;
  setDataRow(item): void;
  onRemove(): void;
  isDisabled: boolean;
  isEdit: boolean;
}

const getTargetTypes = (targets: some[], targetKey: string) => {
  const selectedTargetObject = targets?.find(item => item.id === targetKey);
  const typeList = selectedTargetObject?.types || [];
  const typesNotNull = typeList.filter(item => item.name !== '');
  return typesNotNull || [];
};

const Filter: React.FC<Props> = props => {
  const {
    index,
    dataRow,
    setDataRow,
    onRemove,
    targets,
    metaConditions,
    isDisabled,
    isEdit,
  } = props;
  const [targetTypes, setTargetTypes] = useState<some[]>();
  const [objectCode, setObjectCode] = useState<string>();

  useEffect(() => {
    const targetItem = targets?.find(target =>
      target.types?.find(type => type.id === dataRow?.target),
    );
    const targetTypesList = targetItem?.id && getTargetTypes(targets, targetItem?.id);
    targetTypesList && setTargetTypes(targetTypesList);
    !objectCode && setObjectCode(targetItem?.id);
  }, [objectCode, targets, dataRow]);

  const onChangeTargetObject = useCallback(
    value => {
      const selectedTargetObject = targets?.find(item => item.id === value);
      const typesDetail = selectedTargetObject?.types || [];
      const typesNotNull = typesDetail.filter(item => item.name !== '');
      setTargetTypes(typesNotNull || []);
      setObjectCode(value);
      setDataRow({ ...dataRow, ...{ target: '', targetName: selectedTargetObject?.name } });
    },
    [targets, dataRow, setDataRow],
  );

  const onChangeTargetDetail = useCallback(
    value => {
      const targetTypeDetail = targetTypes?.find(type => type?.id === value);
      setDataRow({
        ...dataRow,
        ...{
          target: value,
          targetDetailName: targetTypeDetail?.name,
          conditionDescription: targetTypeDetail?.description,
          condition: EQUALS,
        },
      });
    },
    [dataRow, targetTypes, setDataRow],
  );

  const onChangeCondition = useCallback(
    value => {
      setDataRow({ ...dataRow, ...{ condition: value } });
    },
    [dataRow, setDataRow],
  );

  const onChangeQuantity = useCallback(
    e => {
      setDataRow({ ...dataRow, ...{ value: Math.abs(Number(e?.target?.value)) } });
    },
    [dataRow, setDataRow],
  );

  const getDescription = useCallback(() => {
    if (dataRow?.target && dataRow?.conditionDescription) {
      const compare = dataRow?.condition === EQUALS ? '=' : dataRow?.condition;
      return `${dataRow?.conditionDescription} ${compare || ''} ${dataRow?.value}`;
    }
    return '';
  }, [dataRow]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <FieldSelectContent
        name="targetObject"
        value={objectCode}
        onSelectOption={onChangeTargetObject}
        options={targets || []}
        label={
          index === 0 && (
            <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
              Đối tượng
            </Typography>
          )
        }
        placeholder="Chọn"
        formControlStyle={{ width: 170, minWidth: 'unset', marginRight: 10 }}
        style={{ width: 170 }}
        optional
        disabled={isDisabled}
      />
      <FieldSelectContent
        name="target"
        value={dataRow?.target}
        onSelectOption={onChangeTargetDetail}
        options={targetTypes || []}
        placeholder="Chọn"
        formControlStyle={{ width: 290, minWidth: 'unset', marginRight: 10 }}
        style={{ width: 290 }}
        label={
          index === 0 && (
            <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
              Chi tiết
            </Typography>
          )
        }
        optional
        disabled={isDisabled}
      />

      <FieldSelectContent
        name="condition"
        value={dataRow?.condition}
        placeholder="Chọn"
        formControlStyle={{ width: 150, minWidth: 'unset', marginRight: 10 }}
        style={{ width: 150 }}
        label={
          index === 0 && (
            <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
              Điều kiện
            </Typography>
          )
        }
        options={metaConditions || []}
        optional
        disabled={isDisabled}
        onSelectOption={onChangeCondition}
      />

      <FieldTextContent
        name="value"
        value={dataRow?.value}
        onChange={onChangeQuantity}
        label={
          index === 0 && (
            <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
              Số lượng
            </Typography>
          )
        }
        formControlStyle={{ width: 150, minWidth: 'unset', marginRight: 10 }}
        style={{ width: 150 }}
        placeholder="Nhập số"
        inputProps={{ maxLength: 10000, autoComplete: 'off' }}
        inputComponent={NumberFormatCustomNonDecimal as any}
        optional
        disabled={isDisabled}
      />

      <FieldTextContent
        label={
          index === 0 && (
            <Typography style={{ color: GRAY, fontWeight: 'bold' }} variant="caption">
              Mô tả
            </Typography>
          )
        }
        name="conditionDescription"
        value={getDescription()}
        placeholder=""
        inputProps={{ maxLength: 10000, autoComplete: 'off' }}
        formControlStyle={{ width: '100%', minWidth: 'unset', marginRight: 10 }}
        style={{ width: '100%' }}
        optional
        disabled
      />

      {!isEdit && (
        <Button onClick={onRemove}>
          <IconBtnRemove style={{ color: PRIMARY }} />
        </Button>
      )}
    </div>
  );
};

export default Filter;
