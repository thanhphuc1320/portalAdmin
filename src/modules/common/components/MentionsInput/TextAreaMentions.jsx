import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Mention, MentionsInput } from 'react-mentions';
import { fetchThunk } from 'modules/common/redux/thunk';
import { API_PATHS } from 'configs/API';
import { isEmpty } from 'configs/utils';
import { getInputMentionUsersPost, removeTagUserName } from 'modules/social-admin/constants';
import classNames from './example.module.scss';

const TextAreaMentions = props => {
  const { value, onChange, mentionUsers, className } = props;
  const dispatch = useDispatch();

  const getDataSuggestUsers = async (search, callback) => {
    if (!search) {
      return;
    }
    const apiSuggestUsers = `${API_PATHS.suggestUsers}?search=${search.trimLeft()}&size=10&page=1`;
    const json = await dispatch(fetchThunk(apiSuggestUsers, 'post'));
    let list = json?.data?.content || [];
    list = list.map(user => ({ id: user?.id, display: user?.name }));
    callback(list);
  };

  const getDataMentionUser = useCallback(() => {
    const dataMentionUser = [];
    if (!isEmpty(mentionUsers)) {
      for (const [key, val] of Object.entries(mentionUsers)) {
        dataMentionUser.push({ id: parseInt(key, 10), name: val });
      }
    }
    return dataMentionUser;
  }, [mentionUsers]);

  const handleChange = val => {
    val = removeTagUserName(val);
    onChange(val);
  };

  return (
    <div className={`multiple-triggers mentions-wrap-textarea`} style={{ textAlign: 'initial' }}>
      <MentionsInput
        value={getInputMentionUsersPost(value || '', getDataMentionUser())}
        onChange={(e, val) => handleChange(val)}
        className={`mentions mentions-wrap-in-textarea ${className}`}
        classNames={classNames}
        a11ySuggestionsListLabel={'Suggested mentions'}
      >
        <Mention
          type="user"
          markup="<@__id__>#{__display__}"
          trigger="@"
          data={getDataSuggestUsers}
          renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
            <div className={`user ${focused ? 'focused' : ''}`}>{highlightedDisplay}</div>
          )}
          className={classNames.mentions__mention}
        />
      </MentionsInput>
    </div>
  );
};

export default TextAreaMentions;
