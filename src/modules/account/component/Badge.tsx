import React from 'react';
import LanguageSelect from '../../intl/components/LanguageSelect';
import UserInfoDropdown from './UserInfoDropdown';

interface Props {}

const Badge: React.FunctionComponent<Props> = () => {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'flex-end',
        flexShrink: 0,
        flexGrow: 1,
        position: 'relative',
      }}
    >
      <LanguageSelect />
      <UserInfoDropdown />
    </div>
  );
};

export default Badge;
