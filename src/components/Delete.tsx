import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { deleteDataAlert } from '../utils/customAlerts';
import { icons, colors, spacings } from '../styles';

// THIS METHOD IS FOR TESTING PURPOSES ONLY: deletes all videos from the database
const DeleteAll = () => {
  return (
    <Pressable onPress={() => deleteDataAlert()} hitSlop={spacings.hitSlopLarge} style={({ pressed }) => [{ opacity: pressed ? 0.3 : 1 }]}>
      <Ionicons name={'trash'} style={[icons.MEDIUM, { zIndex: 100, color: colors.ERROR }]} />
    </Pressable>
  )
}

export const DeleteVideoLog = ({ callback }: { callback: () => void }) => {
  return (
    <Pressable onPress={callback} hitSlop={spacings.hitSlopLarge} style={({ pressed }) => [{ opacity: pressed ? 0.3 : 1 }]}>
      <Ionicons name={'trash'} style={[icons.SMALL, { zIndex: 100, color: colors.BACKGROUND }]} />
    </Pressable>
  )
}

export default DeleteAll;