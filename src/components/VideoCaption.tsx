import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { text, spacings } from '../styles';

const VideoCaption = ({ text }: any) => {
  // TODO: to account for correcting too many words, store last 3 results. 
  // If all 3 last results over threshold, means still over 5 words even with revision.

  // every time words go over 8, only keep the last 3 words.
  // let displayText = result.split('|')
  // return displayText.slice(-5)

  // currently very expensive operation to show just last 5 words. 
  // For some reason, splitting seems difficult. Also, just printing the array does not have spaces.
  const displayCaption = () => {
    return text;   // .split(' ').slice(-5).join(' ');
  }

  return (
    <View style={styles.captionContainer}>
      <Text style={styles.captionText}>{displayCaption()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  captionText: {
    ...text.h2,
    fontFamily: 'CircularStd-Black',
    zIndex: 10,
  },
  captionContainer: {
    position: 'relative',
    backgroundColor: '#00000044',
    borderRadius: 10,
    padding: spacings.MEDIUM,
    alignItems: 'center'
  }
});

export default VideoCaption;