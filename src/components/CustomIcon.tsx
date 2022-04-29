// See Expo Docs on custom icons: https://docs.expo.dev/guides/icons/#createiconsetfromicomoon

import React from 'react';

import { createIconSetFromIcoMoon } from '@expo/vector-icons';

const Icon = createIconSetFromIcoMoon(
  require('../../assets/icomoon/selection.json'),
  'IcoMoon',
  'icomoon.ttf'
);

type CustomIconProps = {
  name: string,
  size?: number,
  color?: string 

  // style is a JS object that represents the style, same format as any other style.
  // Normally core/built-in components in React-Native automatically handle this
  // Because this is our own custom component that will receive a style prop, we must handle it ourselves
  style?: any  
}

const CustomIcon = ({ style, name, size, color }: CustomIconProps) => {
  // EXAMPLE USAGE: Load the icon font before using it
  // Theoretically, the icons font should already be loaded in App
  // Therefore, we shouldn't have to load them again here.
  // In fact, it might be a performance reducer to load fonts for each icon individually when rendering

  // const [fontsLoaded] = useFonts({ IcoMoon: require('./assets/icomoon/icomoon.ttf') });
  //
  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }

  return (
    <Icon style={style} name={name} size={size} color={color} />
  );
}

export default CustomIcon;