import React from 'react';
import { Alert, StyleSheet, View, Text, Pressable } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';

import VideosContext from '../context/VideosContext';

import GoBack from '../components/GoBack';
import SignInButton from '../components/SignInButton';

import { containers, text, dimensions, spacings, colors, icons } from '../styles';

const Rating = ({ route, navigation }): JSX.Element => {
  const { moodData, toggleVideosRefresh } = React.useContext(VideosContext);

  const [emojis, setEmojis] = React.useState(['😥','😐','🙂','😃', '😍']);
  const [selectedEmojiIndex, setSelectedEmojiIndex] = React.useState<number>(-1);
  const { videoStorePath } = route.params;
  const { ratingFile } = route.params;
  const { finalResult } = route.params;

  const updateMoodMap = async (emojiValue: number) => {
    // Global Data Structure is sorted by date
    let today = new Date();
    if (moodData.week.days[0].date.toLocaleDateString() !=
        today.toLocaleDateString()) {
      // Remove the last day if we have over 1 week of data and add current day.
      if (moodData.week.days.length >= 7 ) {
        moodData.week.days.pop();
      }
      moodData.week.days.unshift({
        "mood_score": emojiValue,
        "count": 1,
        "date": new Date(today.toDateString())
      });
    } else {
      moodData.week.days[0]["mood_score"] *= moodData.week.days[0].count;
      moodData.week.days[0].count++;
      moodData.week.days[0]["mood_score"] += emojiValue;
      moodData.week.days[0]["mood_score"] /= moodData.week.days[0].count;
    }
  }

  const submitRating = () => {
    if (selectedEmojiIndex >= 0) {
      updateMoodMap(selectedEmojiIndex);

      // to ratings/filename.txt, we write "😍4", and parse this later as needed
      FileSystem.writeAsStringAsync(ratingFile, `${emojis[selectedEmojiIndex]}${selectedEmojiIndex.toString()}`);
      
      // toggleVideosRefresh();  // TODO: move this somewhere better
      navigateToTranscript(emojis[selectedEmojiIndex]);
    } else {
      Alert.alert(
        "Not so fast...",
        "Please select an emoji to continue.",
        [
          { text: "OK", onPress: () => {}}
        ]
      );
    }
  }

  const navigateToTranscript = (selection: string) => {
    navigation.navigate('Transcript', {selection, videoStorePath, finalResult });
  }

  const setSelectedEmojiWrapper = (emojiIndex: number) => {
    setSelectedEmojiIndex(emojiIndex);
  }

  return (
    <LinearGradient
        // Background Linear Gradient
        colors={[colors.HIGHLIGHT, colors.HIGHLIGHT2]}
        style={styles.container}
    >
      <GoBack navigation={navigation}/>

      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.subTitle}>...and really quickly,</Text>
          <Text style={styles.title}>how are you feeling?</Text>
        </View>

        <View style={styles.ratingContainer}>
          {emojis.map((elem, index) => (
            <Pressable
              key={elem}
              onPress={() => setSelectedEmojiWrapper(index)}
              // style={ ({pressed}) => [styles.emojiBackground, {opacity: pressed ? 0.3 : 1, borderColor: elem===selectedEmoji ? 'transparent' : 'transparent', borderWidth: elem===selectedEmoji ? 1 : 0, backgroundColor: elem===selectedEmoji ? "#000000" + "22" : 'transparent', borderRadius: 10000}]}
            >
              <View style={elem===emojis[selectedEmojiIndex] ? styles.emojiSelectedBackground : styles.emojiBackground}>
                <Text style={styles.emojiText}>{elem}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.nextContainer}>
        <Pressable onPress={() => submitRating()} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
          <View>
            <SignInButton text={"Next"} onPress={submitRating} background={colors.BACKGROUND} />
          </View>
        </Pressable>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {

    ...containers.DEFAULT,
    backgroundColor: colors.HIGHLIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleContainer: {

    alignItems: 'center',
    padding: spacings.MEDIUM
  },
  ratingContainer: {

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: spacings.SMALL
  },
  title: {
    ...text.h2,
  },
  subTitle: {
    ...text.h4,
  },
  //TODO: make circle border around emojis when selected
  emojiText: {
    fontSize: icons.MEDIUM.fontSize,
    textAlign: 'center'
  },
  emojiSelectedBackground: {
    width: icons.MEDIUM.fontSize + 20,
    borderRadius: (icons.MEDIUM.fontSize + 20) / 2,
    aspectRatio: 1,
    overflow: "visible",
    backgroundColor: "#00000033",
    justifyContent: 'center',
  },
  emojiBackground: {
    width: icons.MEDIUM.fontSize + 20,
    aspectRatio: 1,
    overflow: "visible",
    justifyContent: 'center',
  },
  // A white, circular background the same size of the Icon, to serve as a background for it
  // hides overflow
  nextContainer: {

    position: 'absolute',
    width: "100%",
    alignItems: 'center',
    bottom: dimensions.height / 4,
    zIndex: 100,
  },
  forwardIcon: {
    ...icons.LARGE,
    color: colors.BACKGROUND,
    zIndex: 100
  }
})

export default Rating;
