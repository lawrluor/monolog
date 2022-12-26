import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Alert } from 'react-native';
import { dimensions, text, spacings, icons, colors, debug } from '../styles';
import CustomIcon from './CustomIcon';
import {
  locked_final,
  locked_prompt,
  unlocked_completed,
  unlocked_current,
  unlocked_final,
  unlocked_final_current,
} from '../../assets/img/pathway-map'

const ProgressMap = ({ currentProgress, total }: any): JSX.Element => {
  
  const getImageURI = (img) => {
    return Image.resolveAssetSource(img).uri
  }

  let completedArray = [];
  let uncompletedArray = [];
  for(let mapI= 0; mapI < total-1; mapI++){
    if(mapI=== currentProgress){ 
      completedArray.push(<Image style={styles.currentPoint} key={mapI} source={{uri:getImageURI(unlocked_current)}}/>)
    } else if (mapI< currentProgress) {
      completedArray.push(<Image style={styles.mapPoint} key={mapI} source={{uri:getImageURI(unlocked_completed)}}/>)
    } else {
      uncompletedArray.push(<Image style={styles.mapPoint} key={mapI} source={{uri:getImageURI(locked_prompt)}}/>)
    }
  }
  if(currentProgress === total-1) {
    completedArray.push(<Image style={styles.completedFinal} source={{uri:getImageURI(unlocked_final_current)}}/>)
  } else {
    uncompletedArray.push(<Image style={styles.uncompletedFinal} source={{uri:getImageURI(locked_final)}}/>)
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
    margin: spacings.MASSIVE,
    padding: spacings.HUGE,
  },
  mapPoint: {
    aspectRatio: 1.25,
    width: 80,
    resizeMode: 'contain',
  },
  uncompletedFinal: {
    aspectRatio: .75,
    width: 50,
    resizeMode: 'contain',
    marginRight: spacings.HUGE,
  },
  completedFinal: {
    aspectRatio: 1.8,
    width: 90,
    bottom: 7,
    right: 20,
    resizeMode: 'contain'
  },
  currentPoint: {
    aspectRatio: 1.55,
    width: 90,
    bottom: 12,
    resizeMode: 'contain'
  },
})

export default ProgressMap
