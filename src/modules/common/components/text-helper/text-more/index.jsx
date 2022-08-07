import React, {useState} from 'react';
import {isEmpty} from 'validate.js';
import {trans} from '~/components/translate';
import {textTruncate} from '~/helpers/utils';
const cssClass = 'p-text-more';

export const TextMore = (props) => {
  const [isFull, setIsFull] = useState(false);
  const {text, length, className} = props;
  const lengthString = length || 350;

  const getTextMore = () => {
    if (isEmpty(text)) {
      return text;
    }
    if (text.length <= lengthString) {
      return text;
    }
    if (isFull) {
      return (
        <span>
          {text} <br />
          <a className={`${cssClass}_less`} onClick={() => setIsFull(false)}>
            {trans('Less')}
          </a>
        </span>
      );
    }
    return (
      <span>
        {textTruncate(text, lengthString)}{' '}
        <a onClick={() => setIsFull(true)}>{trans('More')}</a>
      </span>
    );
  };

  return (
    <span className={`${cssClass} ${className || ''}`}>{getTextMore()}</span>
  );
};
