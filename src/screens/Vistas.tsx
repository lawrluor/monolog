import React from 'react';
import { ScrollView, StyleSheet, View, Text, Pressable } from 'react-native';

import { Ionicons, FontAwesome } from '@expo/vector-icons';

import { SafeAreaTop, SafeAreaBottom } from '../components/SafeAreaContainer';
import WordChart from '../components/WordChart';
import MoodChart from '../components/MoodChart';

import { dimensions, spacings, icons, colors, sizes, debug } from '../styles';

const Vistas = ({ navigation }):  JSX.Element => {
  const [ modalShown, setModalShown ] = React.useState(false);

  // Calls setModalShown, then focuses the textInput that opens
  const setModal = () => {
    setModalShown(!modalShown);
  }

  const renderModal = () => {
    return (
      modalShown
      ?
      <>
        <SearchEntry modalShown editable isTextBox onFinish={makeSearchQuery} setModal={setModal}><Ionicons name='search' style={styles.searchIcon} /></SearchEntry>
        {/* <FullModal /> */}
      </>
      :
      <Ionicons name='ios-search-circle-sharp' style={styles.searchIcon} />
    )
  }

  const navigateToRecord = () => {
    navigation.navigate('Recording');
  }

  // TODO: add profile page and navigation
  const navigateToProfile = () => {
    comingSoonAlert(() => {
      console.log("uploading picture...");
    });
  }

  // Calls setModalShown, then focuses the textInput that opens

  // TODO: To blur the focused search text entry, we must tap to focus on a different element
  // Clicking inside a ScrollView (or List that implements ScrollView) changes the focus automatically
  // Whereas clicking inside a regular View does NOT automatically change focus
  // Hacky solution: put "No Results" text, which doesn't include the SectionList VideoList component,
    // into a ScrollView so that when no videos are found, users can still focus and exit out of search entry

  // TODO: Debug on Android
  return (
    <ScrollView>
      <View style={styles.container}>
        <SafeAreaTop />
        <SafeAreaBottom transparent>
          <View style={styles.headerContainer}>
            <View style={styles.searchIconContainer}>
              <Pressable onPress={() => setModalShown(!modalShown)} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
                {renderModal()}
              </Pressable>
            </View>
            <View style={styles.headerRightIconContainer}>
              <Pressable onPress={navigateToRecord} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
                <FontAwesome name='plus-square-o' style={styles.plusIcon} />
              </Pressable>

              <Pressable onPress={navigateToProfile} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
                <Ionicons name='person-circle' style={styles.profileIcon} />
              </Pressable>
            </View>
          </View>

          <View style={styles.bodyContainer}>
            <View style={styles.featureContainer}>
              <WordChart numOfWords={10} showMoreButton={true} />
            </View>

            <View style={styles.featureContainer}>
              <MoodChart />
            </View>
          </View>
        </SafeAreaBottom>
      </View>
    </ScrollView>
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
    ...debug,
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.HIGHLIGHT,
    paddingBottom: spacings.LARGE,
    paddingHorizontal: spacings.MEDIUM,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  bodyContainer: {
    marginHorizontal: spacings.LARGE
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
    marginVertical: spacings.LARGE,
    padding: spacings.HUGE,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
  },
});

export default Vistas;
