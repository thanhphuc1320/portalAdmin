interface AvatarOption {
  id?: number;
  name?: string;
  color?: string;
  backgroundColor?: string;
  size?: number;
  length?: number;
  fontSize?: number;
  fontWeight?: string;
  rounded?: number;
  capitalize?: boolean;
  lowercase?: boolean;
}

export const getOptionGenerateAvatar = (options: AvatarOption) => {
  const id = options?.id;
  const SIZE_AVATAR_DEFAULT = 144;
  const FONTWEIGHT_DEFAULT = '500';

  const name = options?.name?.trim();
  let color = options?.color;
  let backgroundColor = options?.backgroundColor;
  let size = options?.size;
  let length = options?.length;
  let fontSize = options?.fontSize;
  let fontWeight = options?.fontWeight;
  let rounded = options?.rounded;
  let capitalize = options?.capitalize;
  let lowercase = options?.lowercase;

  size = size ? Number(size) : SIZE_AVATAR_DEFAULT;

  const colorIndex = Number(id) > 0 ? Number(id) % 8 : -1;
  const colors = ['FF3366', '18A43B', 'FF6A39', '8F2626', '3D3F40', '995608', '35415B', '389CFF'];

  let backgroundDefault = 'FF3366';
  if (colorIndex >= 0 && colorIndex < colors.length && colors[colorIndex]) {
    backgroundDefault = colors[colorIndex];
  }

  backgroundColor = `#${backgroundColor || backgroundDefault}`;
  color = `#${color || 'ffffff'}`;
  length = length || 2;
  fontSize = fontSize || size / 2.2;
  fontWeight = fontWeight || FONTWEIGHT_DEFAULT;
  rounded = rounded || 1000;
  capitalize = capitalize || true;
  lowercase = lowercase || false;

  const words: any[] = name?.split(' ') || [];
  let letters = words[0] ? words[0]?.charAt(0) : 'A';

  if (words.length > 1) {
    letters = `${words[words.length - 1]?.charAt(0)}${letters}`;
  }

  if (length && Number(length) === 1 && words.length > 0) {
    letters = words[0]?.charAt(0);
  }

  if (capitalize) {
    letters = letters.toUpperCase();
  } else if (lowercase) {
    letters = letters.toLowerCase();
  }

  const avatarOptions = {
    letters,
    backgroundColor,
    color,
    size,
    fontSize,
    fontWeight,
    rounded,
  };

  return avatarOptions;
};
