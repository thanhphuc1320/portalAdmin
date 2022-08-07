import React, { useState, useCallback } from 'react';
import { Grid, Paper, Typography, Avatar, IconButton } from '@material-ui/core';
import { isArray } from 'lodash';
import { useFormikContext } from 'formik';
import { Row } from 'modules/common/components/elements';
import LoadingButton from 'modules/common/components/LoadingButton';
import ConfirmDialog from 'modules/common/components/ConfirmDialog';
import { FieldTextContent } from 'modules/common/components/FieldContent';
import TagsFormDialog from './TagsFormDialog';
import { some } from 'configs/utils';
import { GRAY } from 'configs/colors';
import { isNumeric } from 'helpers/common';
import { ReactComponent as IconDeleteSmall } from 'svg/icon_delete_small.svg';
import { ReactComponent as IconEditSmall } from 'svg/icon_edit_small.svg';

interface Props {
  tagList: some[];
  onReset(): void;
}

const ArticleItemTags: React.FC<Props> = props => {
  const { tagList, onReset } = props;
  const { setFieldValue } = useFormikContext();

  const [showFormTag, setShowFormTag] = useState<boolean>(false);
  const [isConfirmResetTags, setIsConfirmResetTags] = useState<boolean>(false);
  const [tagSelected, setTagSelected] = useState<any>();

  const onDelete = useCallback(
    (code: string | undefined) => {
      const tagListNew = tagList?.filter(t => t.code !== code);
      setFieldValue('hotelTags', [...tagListNew], true);
    },
    [tagList, setFieldValue],
  );

  const convertTagValue = (value) => {
    if (value && isNumeric(value) && Number(value) > 0) return Number(value).toFixed(0);
    return value;
  };

  return (
    <Paper className="article-type-item-tags pager-section-form">
      <Row style={{ margin: '10px 0px' }}>
        <Typography variant="subtitle2">Tags</Typography>
      </Row>

      <Grid container spacing={2}>
        {isArray(tagList) &&
          tagList?.map((tag: any, index: number) => (
            <Grid key={index} item xs={12} sm={6}>
              <div className="tags-item">
                <div className="tags-item-head">
                  <IconButton
                    aria-label="edit"
                    style={{ marginRight: -10 }}
                    onClick={() => {
                      setTagSelected(tag);
                      setShowFormTag(true);
                    }}
                  >
                    <IconEditSmall />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => tag?.code && onDelete(tag?.code)}>
                    <IconDeleteSmall />
                  </IconButton>
                </div>
                <div className="tags-item-body">
                  <div className="tags-item-box-icon">
                    <Avatar src={tag?.avatar} style={{ width: 60, height: 60 }} />
                  </div>
                  <div className="tags-item-box-label">
                    <Typography variant="subtitle1">{tag?.name}</Typography>
                  </div>
                  <div className="tags-item-box-formcontrol">
                    <FieldTextContent
                      name="value"
                      value={convertTagValue(tag?.value)}
                      label={
                        <Typography style={{ color: GRAY }} variant="caption">
                          {tag?.label}
                        </Typography>
                      }
                      placeholder="Nhập giá trị"
                      onChange={e => {
                        const tempValue = e.target.value || '';
                        if (isNumeric(tempValue)) {
                          const valueNumber =
                            Number.isInteger(Number(tempValue)) && Number(tempValue) > 0
                              ? Number(tempValue).toFixed(0)
                              : undefined;
                          // if (tempValue && isNumeric(tempValue) && Number(value) > 0)
                          //   return Number(value).toFixed(0);
                          tagList[index] = { ...tagList[index], value: valueNumber };
                          setFieldValue('hotelTags', [...tagList], true);
                        } else {
                          tagList[index] = { ...tagList[index], value: tempValue };
                          setFieldValue('hotelTags', [...tagList], true);
                        }
                      }}
                      inputProps={{ maxLength: 50, autoComplete: 'off' }}
                      formControlStyle={{ width: '100%' }}
                      style={{ width: '100%' }}
                      optional
                    />
                  </div>
                </div>
              </div>
            </Grid>
          ))}
      </Grid>
      <Row style={{ margin: '10px 0px', justifyContent: 'flex-end' }}>
        <LoadingButton
          variant="outlined"
          size="small"
          style={{ padding: '7px 15px' }}
          disableElevation
          onClick={() => setIsConfirmResetTags(true)}
        >
          <Typography style={{ fontWeight: 500 }}>Đặt lại</Typography>
        </LoadingButton>
        <LoadingButton
          variant="contained"
          size="small"
          style={{ padding: '7px 15px', marginLeft: 10 }}
          color="primary"
          disableElevation
          onClick={() => {
            setTagSelected(undefined);
            setShowFormTag(true);
          }}
        >
          <Typography style={{ fontWeight: 500 }}>Thêm Tags</Typography>
        </LoadingButton>
      </Row>

      <TagsFormDialog
        open={showFormTag}
        setOpen={setShowFormTag}
        tagList={tagList}
        setTagList={(tags: some[]) => {
          setFieldValue('hotelTags', tags, true);
        }}
        tagSelected={tagSelected}
        setTagSelected={setTagSelected}
      />
      {/* isConfirmResetTags */}
      <ConfirmDialog
        style={{ textAlign: 'center' }}
        open={isConfirmResetTags}
        acceptLabel="reset"
        rejectLabel="cancel"
        onAccept={() => {
          onReset && onReset();
          setIsConfirmResetTags(false);
        }}
        titleHead={
          <Typography style={{ marginBottom: 16 }} variant="subtitle1">
            Xác nhận đặt lại Tags
          </Typography>
        }
        titleLabel={<Typography variant="body1">Bạn có chắc muốn đặt lại Tags?</Typography>}
        onClose={() => setIsConfirmResetTags(false)}
        onReject={() => setIsConfirmResetTags(false)}
      />
    </Paper>
  );
};

export default ArticleItemTags;
