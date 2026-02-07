// See Expo Docs on custom icons: https://docs.expo.dev/guides/icons/#createiconsetfromicomoon

import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';

const Icon = createIconSetFromIcoMoon(
  require('../../assets/icomoon/selection.json'),
  'IcoMoon',
  'icomoon.ttf'
);

type CustomIconProps = {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>
}

const CustomIcon = ({ style, name, size, color }: CustomIconProps) => {
  return (
    <Icon style={style} name={name} size={size} color={color} />
  );
}

export default CustomIcon;