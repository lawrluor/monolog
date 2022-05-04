import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { SafeAreaTop, SafeAreaBottom } from '../components/SafeAreaContainer';
import WordChart from '../components/WordChart';
import MoodChart from '../components/MoodChart';

import VideosContext from '../context/VideosContext';

import { getCurrentWeekFromTodayMMDD } from '../utils/dates';

import { dimensions, spacings, icons, colors, text, sizes, debug } from '../styles';
import NewUserMessage from '../components/NewUserMessage';

const VIDEOS_THRESHOLD = 0;

const Vistas = ({ navigation }: any):  JSX.Element => {
  const { videosCount } = React.useContext(VideosContext);

  return (
    <>
      <SafeAreaTop />

      <SafeAreaBottom>
        <LinearGradient
          colors={[colors.HIGHLIGHT, colors.HIGHLIGHT2]}
          style={styles.container}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Vistas Summary</Text>
            <Text style={styles.subtitle}>{getCurrentWeekFromTodayMMDD()}</Text>
          </View>

          <ScrollView 
            style={styles.bodyContainer} 
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          > 
            {
              videosCount <= VIDEOS_THRESHOLD
              ?
              <NewUserMessage navigateCallback={() => navigation.navigate('Recording')} />
              :
              <>
                <View style={styles.featureContainer}>
                  <WordChart numOfWords={10} showMoreButton={true} />
                </View>
              
                <View style={styles.featureContainer}>
                  <MoodChart />
                </View>
              </>
            }
          </ScrollView>
        </LinearGradient>
      </SafeAreaBottom>
    </>
  )
}

const styles = StyleSheet.create({
  // Doesn't use the default container, as that adds a bottom block
  container: {
    flex: 1,
  },
  // This container size is dependent on the size of the brandImage below
  // This ensures that the image does not overflow the container
  // A padding on the brandHeader ensures adequate vertical spacing no matter the image size
  headerContainer: {
    flexDirection: 'row',
    paddingVertical: spacings.HUGE,
    paddingHorizontal: spacings.HUGE,
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  bodyContainer: {
    paddingHorizontal: spacings.HUGE
  },
  scrollContentContainer: {
    paddingBottom: spacings.HUGE
  },
  videoListContainer: {
    ...debug,
    flex: 1,
    paddingHorizontal: spacings.TINY,
    zIndex: 100
  },
  // This container is absolute positioned off the bottom of the parent container
  recordContainer: {
    position: 'absolute',
    width: "100%",
    alignItems: 'center',
    bottom: dimensions.height / 10,
    zIndex: 100,
  },
  headerRightIconContainer: {
    ...debug,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  // A white, circular background the same size of the Icon, to serve as a background for it
  // hides overflow
  recordIconBackground: {
    backgroundColor: colors.BACKGROUND,
    width: icons.LARGE.fontSize,
    aspectRatio: 1,
    borderRadius: icons.LARGE.fontSize / 2,
    overflow: 'hidden'
  },
  title: {
    ...text.h2
  },
  subtitle: {
    ...text.h3
  },
  profileTitle: {
    ...text.h2,
    fontFamily: 'Coconat-Regular',
  },
  searchIconContainer: {
    ...debug,
  },
  recordIcon: {
    ...icons.LARGE,
    zIndex: 100
  },
  searchIcon: {
    ...icons.MEDIUM,
    fontSize: (sizes.SCREEN_WIDTH_66 / 7), // Approx. Same height as searchEntry in TextEntry
    color: colors.BACKGROUND,
  },
  plusIcon: {
    ...icons.MEDIUM,
    color: colors.BACKGROUND,
    marginTop: spacings.TINY,
    marginRight: spacings.MEDIUM
  },
  profileIcon: {
    ...icons.MEDIUM,
    color: colors.BACKGROUND,
  },
  noResultsText: {
    color: colors.PRIMARY
  },
  noResultsContainer: {
    alignItems: 'center',
    marginTop: spacings.MASSIVE
  },
  featureContainer: {
    backgroundColor: colors.BACKGROUND,
    borderRadius: 20,
    width: "100%",
    marginBottom: spacings.HUGE,
    padding: spacings.HUGE,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
  },
});

export default Vistas;
