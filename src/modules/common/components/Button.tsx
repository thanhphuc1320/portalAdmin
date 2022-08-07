// Button Commom Express

import React from 'react';
import { Button } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import { ReactComponent as IconButtonEditBorder } from 'svg/icon_button_edit_border.svg';
import { ReactComponent as IconButtonDeleteBorder } from 'svg/icon_button_delete_border.svg';
import { ReactComponent as IconButtonEyeBorder } from 'svg/icon_button_eye_border.svg';
import { ReactComponent as IconButtonConvertBorder } from 'svg/icon_button_conver_border.svg';
import { ReactComponent as IconButtonPhoneBorder } from 'svg/icon_button_phone_border.svg';
import { ReactComponent as IconButtonBanUser } from 'svg/icon_button_ban.svg';
import { ReactComponent as IconButtonDetailUser } from 'svg/icon_detail_user.svg';

export const ButtonEdit: React.FC<ButtonProps> = props => {
  const { ...rest } = props;
  return (
    <Button {...rest}>
      <IconButtonEditBorder />
    </Button>
  );
};

export const ButtonDelete: React.FC<ButtonProps> = props => {
  const { ...rest } = props;
  return (
    <Button {...rest}>
      <IconButtonDeleteBorder />
    </Button>
  );
};

export const ButtonEye: React.FC<ButtonProps> = props => {
  const { ...rest } = props;
  return (
    <Button {...rest}>
      <IconButtonEyeBorder />
    </Button>
  );
};

export const ButtonConvert: React.FC<ButtonProps> = props => {
  const { ...rest } = props;
  return (
    <Button {...rest}>
      <IconButtonConvertBorder />
    </Button>
  );
};

export const ButtonPhoneBorder: React.FC<ButtonProps> = props => {
  const { ...rest } = props;
  return (
    <Button {...rest}>
      <IconButtonPhoneBorder />
    </Button>
  );
};

export const ButtonBanUser: React.FC<ButtonProps> = props => {
  const { ...rest } = props;
  return (
    <Button {...rest}>
      <IconButtonBanUser />
    </Button>
  );
};

export const ButtonDetailUser: React.FC<ButtonProps> = props => {
  const { ...rest } = props;
  return (
    <Button {...rest}>
      <IconButtonDetailUser />
    </Button>
  );
};
