import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBar = ({ currentProgress, total }: any): JSX.Element => { 
  const progress = Math.floor(currentProgress / total * 100);
  // Max number of prompts a pathway may contain
  const MAX_LEVELS = 10
  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View style={[styles.progressBar]}>
          <View style={[StyleSheet.absoluteFill, styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
      </View>
      <Text style={styles.percent}>{currentProgress}/{ MAX_LEVELS }</Text>
    </View>
  )

}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  barContainer: {
    flex: 1,
    flexDirection: "column", //column direction
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '10%',
    backgroundColor: 'transparent',
    padding: 8,
    alignContent: 'center',
  },
  progressBar: {
    height: 5,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'lightgrey',
    borderColor: '#000',
  },
  percent: {
    // display: 'flex',
    // flexDirection: 'column',
    position: 'relative',
    top: 13,
    color: '#BEBEBE'
  },
  progressBarFill: {
    backgroundColor: '#8BED4F',
  }
})

export default ProgressBar
