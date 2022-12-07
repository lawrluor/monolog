import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBar = ({ currentProgress, total }: any): JSX.Element => { 
  const progress = currentProgress / total * 100;
  
  return (
    <View style={styles.parent}>
      <View style={styles.container}>
        <View style={[styles.progressBar]}>
          <View style={[StyleSheet.absoluteFill, styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
      </View>
      <Text style={styles.percent}>{progress}%</Text>
    </View>
  )

}
const styles = StyleSheet.create({
  parent: {
    flexDirection: 'row',
  },
  container: {
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
  },
  progressBarFill: {
    backgroundColor: '#8BED4F',
  }
})

export default ProgressBar
