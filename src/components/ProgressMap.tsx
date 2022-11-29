import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Alert } from 'react-native';
import { dimensions, text, spacings, icons, colors, debug } from '../styles';
import CustomIcon from './CustomIcon';

const ProgressMap = ({ currentProgress, total }: any): JSX.Element => {
  let completedArray = [];
  let uncompletedArray = [];
  for(let i = 0; i < total; i++){
    if (i < currentProgress) {
      completedArray.push(<CustomIcon style={styles.mapDot} name='checked_box' />)
    } else {
      uncompletedArray.push(<CustomIcon style={styles.mapDot} name='unchecked_box'/>)
    }
  }
  return(
    <ScrollView style={styles.progressMap} horizontal={true} showsHorizontalScrollIndicator={false}>
      {completedArray}
      {uncompletedArray}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  progressMap: {
    margin: spacings.HUGE,
  },
  mapDot: {
    ...icons.SMALL,
    color: colors.HIGHLIGHT,
    margin: spacings.HUGE,
  },
})

export default ProgressMap
