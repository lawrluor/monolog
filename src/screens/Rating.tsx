import React from 'react';
import { Alert, Image, StyleSheet, View, Text, Pressable } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { generateRatingUri } from '../utils/localStorageUtils';
import { createRatingFromMetadata } from '../utils/rating';

import VideosContext from '../context/VideosContext';

import GoBack from '../components/GoBack';
import SignInButton from '../components/SignInButton';
import TutorialImageModal from '../components/TutorialImageModal';

import { containers, text, dimensions, spacings, colors, icons } from '../styles';

const Rating = ({ route, navigation }): JSX.Element => {
  const { moodData, videosCount } = React.useContext(VideosContext);

  const emojis = ['😥','😐','🙂','😃','😍'];
  const [selectedEmojiIndex, setSelectedEmojiIndex] = React.useState<number>(-1);
  const [tutorialShown, setTutorialShown] = React.useState<boolean>(videosCount < 1);

  const { fileBaseName, finalResult, isCameraOn } = route.params;

  const updateMoodMap = async (emojiValue: number) => {
    // Global Data Structure is sorted by date
    let today = new Date();
    let lastWeekSec = today.getTime() / 1000 - 604800;
    let moodDataList = moodData.week.days;

    // Remove expired dates on video upload.
    while (moodDataList.length > 0 &&
        (moodDataList[moodDataList.length - 1].date.getTime() / 1000 <
        lastWeekSec)) {
      moodData.week.days.pop();
    }
    if (moodData.week.days.length === 0 || moodData.week.days[0].date.toLocaleDateString() !=
        today.toLocaleDateString()) {
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

      // See utils/rating.ts for how Ratings are created and written.
      createRatingFromMetadata(
          emojis[selectedEmojiIndex], selectedEmojiIndex, isCameraOn)
        .writeRatingToFile(generateRatingUri(fileBaseName));

      navigateToTranscript(emojis[selectedEmojiIndex]);
    } else {
      Alert.alert(
        "Not so fast...",
        "Please select an emoji to continue.",
        [
          { text: "OK" }
        ]
      );
    }
  }

  const navigateToTranscript = (selection: string) => {
    navigation.navigate('Transcript',
        { selection, fileBaseName, finalResult, isCameraOn });
  }

  const setSelectedEmojiWrapper = (emojiIndex: number) => {
    setSelectedEmojiIndex(emojiIndex);
  }

  return (
    <TutorialImageModal shown={tutorialShown} setShown={setTutorialShown} imageUri={require('../../assets/img/tutorials/rating.jpg')}>
      <LinearGradient
          // Background Linear Gradient
          colors={[colors.HIGHLIGHT, colors.HIGHLIGHT2]}
          style={styles.container}
      >
        <GoBack />

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
              >
                <View style={elem===emojis[selectedEmojiIndex] ? styles.emojiSelectedBackground : styles.emojiBackground}>
                  <Text style={styles.emojiText}>{elem}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.nextContainer}>
          <Pressable onPress={submitRating} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
            <View>
              <SignInButton text={"Next"} onPress={submitRating} background={colors.BACKGROUND} />
            </View>
          </Pressable>
        </View>
      </LinearGradient>
    </TutorialImageModal>
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
  },
  forwardIcon: {
    ...icons.LARGE,
    color: colors.BACKGROUND,
  },
  tutorialImage: {
    width: dimensions.width,
    height: dimensions.height,
    position: 'absolute',
  }
})

export default Rating;
