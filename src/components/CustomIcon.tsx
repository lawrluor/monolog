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

  // style is a JS object that represents the style, same format as any other style.
  // Normally core/built-in components in React-Native automatically handle this
  // Because this is our own custom component that will receive a style prop, we must handle it ourselves
  style?: StyleProp<TextStyle>
}

const CustomIcon = ({ style, name, size, color }: CustomIconProps) => {
  return (
    <Icon style={style} name={name} size={size} color={color} />
  );
}

export default CustomIcon;