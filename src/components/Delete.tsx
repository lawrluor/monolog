import React from 'react';
import { Pressable } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { deleteAllData } from '../utils/localStorageUtils';

import { icons, colors, spacings } from '../styles';

const DeleteAll = () => {
  // FOR TESTING PURPOSES ONLY: Calls method that deletes videos from the database
  return (
    <Pressable onPress={deleteAllData} hitSlop={spacings.hitSlopLarge} style={({pressed}) => [{opacity: pressed ? 0.3 : 1}]}>
      <Ionicons name={'trash'} style={[icons.MEDIUM, { zIndex: 100, color: colors.ERROR }]} />
    </Pressable> 
  )
}

export const DeleteVideoLog = ({ callback }: any) => {
  return (
    <Pressable onPress={callback} hitSlop={spacings.hitSlopLarge} style={({pressed}) => [{opacity: pressed ? 0.3 : 1}]}>
      <Ionicons name={'trash'} style={[icons.SMALL, { zIndex: 100, color: colors.BACKGROUND }]} />
    </Pressable> 
  )
}

export default DeleteAll;