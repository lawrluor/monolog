import React from 'react';
import { ScrollView, StyleSheet, View, Text, Pressable } from 'react-native';

import VideosContext from '../context/VideosContext';
import UserContext from '../context/UserContext';

import CustomIcon from '../components/CustomIcon';
import VideoList from '../components/VideoList';
import { SearchEntry } from '../components/TextEntry';
import { SafeAreaTop, SafeAreaBottom } from '../components/SafeAreaContainer';

import { deleteDataAlert } from '../utils/customAlerts';
import { INITIAL_USER_DATA } from '../utils/localStorageUtils';

import { dimensions, text, spacings, icons, colors, debug } from '../styles';

const Gallery = ({ navigation }: any):  JSX.Element => {
  const { setUser } = React.useContext(UserContext);
  const { videosData, isLoading, toggleVideosRefresh, submitQuery } = React.useContext(VideosContext);
  const [ modalShown, setModalShown ] = React.useState(false);
  const [ searchQuery, setSearchQuery ] = React.useState(false);

  const navigateToRecording = () => {
    navigation.navigate('Recording');
  }

  // TODO: logic for searching and returning videos after the text is inputted.
  const makeSearchQuery = (query: string) => {
    // TODO: differentiate between someone cancelling an INITIAL search from initial gallery
      // in which we should show the initial gallery state
    // Or deleting a search AFTER already searching
      // in which we should either show the initial Gallery state or requery the full list of videos
    // We may want to store an initialVideoData in the videosContext to help us optimize.
    // We could also use a flag hasQueried in Gallery to help us manage this
    // This will help us optimize, because right now we fetch all videos whenever the query state changes

    // if (query !=="") {
      // comingSoonAlert(() => {
      //   console.log("Searching for videos...")
      // });

      // calls function in VideoContext that ultimately changes video state and triggers Gallery reload
      setSearchQuery(query);
      submitQuery(query);
    // }
  }

  const navigateToProfile = async () => {
    // When user confirms they want to delete account,
    // we delete the data in userContext, then go back to AuthLoading
    // which handles auth state for us and should display Landing page.
    deleteDataAlert(() => {
      setUser(INITIAL_USER_DATA);  // Refresh UserContext
      toggleVideosRefresh(false);  // Refresh VideosContext
      navigation.navigate('AuthLoading');
    });
  }

  // Calls setModalShown, then focuses the textInput that opens
  const setModal = () => {
    setModalShown(!modalShown);
  }

  const renderModal = () => {
    return (
      modalShown
      ?
      <SearchEntry editable isTextBox onFinish={makeSearchQuery} modalShown={modalShown} setModal={setModal}>
        <CustomIcon name='search_circle' style={styles.searchIcon} />
      </SearchEntry>
      :
      <CustomIcon name='search_circle' style={styles.searchIcon} />
    )
  }

  // TODO: To blur the focused search text entry, we must tap to focus on a different element
  // Clicking inside a ScrollView (or List that implements ScrollView) changes the focus automatically
  // Whereas clicking inside a regular View does NOT automatically change focus
  // Hacky solution: put "No Results" text, which doesn't include the SectionList VideoList component,
    // into a ScrollView so that when no videos are found, users can still focus and exit out of search entry

  // TODO (better solution):
  // Proposed solution: Add a fullscreen modal or modal underneath header (and search)
  // This modal pops up WITH the search modal, but is invisible
  // Any click on this invisible modal, can indirectly or directly blur the textInput


  // If videos exist and have been returned in the data, display it in a VideoList
  // Else if no videos because user has no videos at all, display "record your first video" message
  // Else if user has entered a query which returned no results, display "no results" message
  const renderVideoData = () => {
    return (
      (videosData.length <= 0 || !videosData)
      ?
      <ScrollView contentContainerStyle={styles.videoListContainer}>
        <View style={styles.noResultsContainer}>
          {
            searchQuery
            ?
            <>
              <Text style={[text.h2, styles.noResultsText]}>Hmm...no results</Text>
              <Text style={[text.h4, styles.noResultsText]}>Try a different keyword?</Text>
            </>
            :
            <>
              <Text style={[text.h2, styles.noResultsText]}>No logs yet.</Text>
              <Pressable onPress={navigateToRecording} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
                <Text style={[text.h4, styles.noResultsText]}>Record your first video log!</Text>
              </Pressable>
            </>
          }
        </View>
      </ScrollView>
      :
      <View style={styles.videoListContainer}>
        <VideoList navigation={navigation} videoData={videosData} />
      </View>
    )
  }

  // TODO: Debug on Android
  // Used to be the Loading spinner, but too flashy/jittery for search function
  return (
    isLoading
    ?
    <></>
    :
    <View style={styles.container}>
      <SafeAreaTop />

      <SafeAreaBottom transparent>
        {/* TODO: Try to make linear gradient header - will have to be done in SafeAreaTop */}
        <View style={styles.headerContainer}>
          <View style={styles.searchIconContainer}>
            <Pressable onPress={() => setModalShown(!modalShown)} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
              {renderModal()}
            </Pressable>
          </View>

          <View style={styles.headerRightIconContainer}>
            <Pressable onPress={navigateToRecording} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
              <CustomIcon name='add_entry' style={styles.plusIcon} />
            </Pressable>

            <Pressable onPress={navigateToProfile} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
              <CustomIcon name='avatar' style={styles.profileIcon} />
            </Pressable>
          </View>
        </View>

        {renderVideoData()}

      </SafeAreaBottom>
    </View>
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
    paddingHorizontal: spacings.HUGE,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
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
    ...icons.SMALL,
    // fontSize: (sizes.SCREEN_WIDTH_66 / 7), // Approx. Same height as searchEntry in TextEntry
    color: colors.BACKGROUND,
  },
  plusIcon: {
    ...icons.SMALL,
    color: colors.BACKGROUND,
    marginTop: spacings.TINY,
    marginRight: spacings.MEDIUM
  },
  profileIcon: {
    ...icons.SMALL,
    color: colors.BACKGROUND,
    marginLeft: spacings.SMALL
  },
  noResultsText: {
    color: colors.SECONDARY
  },
  noResultsContainer: {
    alignItems: 'center',
    marginTop: spacings.MASSIVE
  }
});

export default Gallery;
