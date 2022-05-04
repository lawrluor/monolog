import React from 'react';
import { Pressable } from 'react-native';

import { AntDesign } from '@expo/vector-icons';

import { deleteAllData } from '../utils/localStorageUtils';

import { icons, colors } from '../styles';

const DeleteAll = () => {
  // FOR TESTING PURPOSES ONLY: Calls method that deletes videos from the database
  return (
  <Pressable onPress={deleteAllData} style={({pressed}) => [{opacity: pressed ? 0.3 : 1}]}>
    <AntDesign name={'delete'} style={[icons.MEDIUM, { zIndex: 100, color: colors.ERROR }]} />
  </Pressable> 
  )
}

export default DeleteAll;