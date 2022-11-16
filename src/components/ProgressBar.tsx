import React from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { dimensions, text, spacings, icons, colors, debug } from '../styles';
import SignInButton from '../components/SignInButton';
import GoBack from '../components/GoBack';
import { LinearGradient } from 'expo-linear-gradient';
import { pathwaysData, pathwaysMap } from '../utils/pathwaysData'
import { SafeAreaBottom, SafeAreaTop } from '../components/SafeAreaContainer';

const ProgressBar = ({ currentProgress, total }: any): JSX.Element => { 
  const progress = currentProgress / total * 100;
  
  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[StyleSheet.absoluteFill, styles.progressBarFill, { width: `${progress}%` }]}/>
      </View>
    </View>
  )

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column", //column direction
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '10%',
    backgroundColor: 'transparent',
    padding: 8,
  },
  progressBar: {
    height: 5,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'lightgrey',
    borderColor: '#000',
  },
  progressBarFill: {
    backgroundColor: '#8BED4F',
  }
})

export default ProgressBar
