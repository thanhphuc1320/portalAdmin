import { Button, Typography } from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import { GRAY_DARK } from '../../../../configs/colors';
import { DATE_FORMAT_SHOW } from '../../../../models/moment';
import { ReactComponent as DeleteLight } from '../../../../svg/iconly-light-outline-delete.svg';
import { Col, Row } from '../../../common/components/elements';
// import { DataCommentProps } from '../utils';
import { getTagUserContent } from '../../constants';

interface Props {
  dataComment: any;
  deletePostComment(value: number): void;
  userComments: any;
}
function CommentCard(props: Props) {
  const { dataComment, deletePostComment, userComments } = props;
  return (
    <Row style={{ justifyContent: 'space-between', margin: '16px 16px 0px 16px' }}>
      <Col style={{ width: '100%' }}>
        <Col>
          <Row style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
            <Typography
              variant="subtitle2"
              style={{ color: GRAY_DARK, marginRight: 6, textTransform: 'capitalize' }}
            >
              {dataComment?.user?.name || ''}
            </Typography>
            <Typography variant="caption" style={{ color: '#c1c6c9' }}>
              {moment(dataComment.createdAt).format(DATE_FORMAT_SHOW)}
            </Typography>
          </Row>
          <Typography variant="body2" style={{ color: GRAY_DARK }}>
            {getTagUserContent(dataComment?.content, userComments)}
          </Typography>
        </Col>
        {dataComment?.children &&
          dataComment?.children.map((element: any) => (
            <Col style={{ marginLeft: 32, marginBottom: 6, marginTop: 4 }}>
              <Row style={{ marginLeft: 8, marginBottom: 6 }}>
                <Typography
                  variant="subtitle2"
                  style={{ color: GRAY_DARK, marginRight: 6, textTransform: 'capitalize' }}
                >
                  {element.user?.name || ''}
                </Typography>
                <Typography variant="caption" style={{ color: '#c1c6c9' }}>
                  {moment(element.createdAt).format(DATE_FORMAT_SHOW)}
                </Typography>
              </Row>
              <Typography variant="body2" style={{ marginLeft: 8, color: GRAY_DARK }}>
                {getTagUserContent(element?.content, userComments)}
              </Typography>
            </Col>
          ))}
      </Col>
      <Button onClick={() => deletePostComment(dataComment?.id)}>
        <DeleteLight />
      </Button>
    </Row>
  );
}

export default CommentCard;
