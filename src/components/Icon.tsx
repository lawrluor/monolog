import React from 'react';
import { Pressable } from 'react-native';
import { AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, icons } from '../styles';

type IconProps = {
  family: 'AntDesign' | 'FontAwesome' | 'MaterialCommunityIcons';
  name: string;
  size: string;
  colorUnpressed?: string;
  colorPressed?: string;
  onPress: () => void;
}

const getIconSize = (size: string) => {
  switch (size) {
    case "TINY":
      return icons.TINY;
    case "SMALL":
      return icons.SMALL;
    case "MEDIUM":
      return icons.MEDIUM;
    case "LARGE":
      return icons.LARGE;
    case "HUGE":
      return icons.HUGE;
  }
}

// Returns an Icon with pressable props
const renderIconFamily = (pressed: boolean, props: IconProps) => {
  switch (props.family) {
    case "AntDesign":
      return <AntDesign name={props.name as keyof typeof AntDesign.glyphMap} style={[getIconSize(props.size), { color: pressed ? colors.BACKGROUND : colors.HIGHLIGHT }]} />
    case "FontAwesome":
      return <FontAwesome name={props.name as keyof typeof FontAwesome.glyphMap} style={[getIconSize(props.size), { color: pressed ? colors.BACKGROUND : colors.HIGHLIGHT }]} />
    case "MaterialCommunityIcons":
      return <MaterialCommunityIcons name={props.name as keyof typeof MaterialCommunityIcons.glyphMap} style={[getIconSize(props.size), { color: pressed ? colors.BACKGROUND : colors.HIGHLIGHT }]} />
    default:
      return null;
  }
}

// Default icon: Colors are set
const Icon = (props: IconProps) => {
  return (
    <Pressable onPress={props.onPress}>
      {({ pressed }) => {
        renderIconFamily(pressed, props);
      }}
    </Pressable>
  )
}

export default Icon;