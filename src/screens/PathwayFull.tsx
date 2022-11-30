import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Alert } from 'react-native';
import { dimensions, text, spacings, icons, colors, debug } from '../styles';
import SignInButton from '../components/SignInButton';
import GoBack from '../components/GoBack';
import { pathwaysMap } from '../utils/pathwaysData'
import { SafeAreaBottom, SafeAreaTop } from '../components/SafeAreaContainer';
import { updateCurrentPathway } from '../utils/updatePathwaysUser';
import ProgressMap from '../components/ProgressMap';
import UserContext from '../context/UserContext';

const PathwayFull = ({ route, navigation }: any): JSX.Element => {
  const { pathwayName } = route.params;
  const { user, setUser } = React.useContext(UserContext);
  const MAX_LEVELS = 10
  const userCurrentLevel = user['pathways'][pathwayName]? user['pathways'][pathwayName]['currentLevel'] : 1
  const currentPathway = pathwaysMap.get(pathwayName);

  const getImageURI = (img) => {
    return Image.resolveAssetSource(img).uri
  }
  const navigateToPrompt = (pathwayName: string) => {
    updateCurrentPathway(pathwayName);
    const level = pathwaysMap.get(pathwayName).progress[1] //TODO: Replace with user functions
    navigation.push('PathwaysPrompt', { pathway:pathwayName, level: level});
  }
  const BodyText = () => {
    const text = currentPathway.long_desc
    let textArray = text.split("<b>")

    return (
      <View style={styles.description}>
        {
          textArray.map((item, index) => {
            const bold = index % 2;
            return (
              <Text style={bold ? styles.bodyHeader : styles.bodyText}>
                { item }
              </Text>
            )
          })
        }
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <GoBack />
      <SafeAreaTop/>
      <SafeAreaBottom transparent>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <Image style={styles.imageHeader} source={{uri:getImageURI(currentPathway.image)}}/>
          <Text style={styles.title}>
            {pathwayName} --- {currentPathway.progress[0]} stars
          </Text>
          <BodyText></BodyText>
          <ProgressMap currentProgress={userCurrentLevel} total={MAX_LEVELS}/>  
        </ScrollView>
        <View style={styles.recordButton}>
          <SignInButton background={colors.HIGHLIGHT}
            onPress={() => { navigateToPrompt(pathwayName)}}
            >
            <Text style={text.h4}> Record next pathway </Text>
          </SignInButton>
        </View>
      </SafeAreaBottom>
    </View>
  );
}

const styles = StyleSheet.create({
  // Doesn't use the default container, as that adds a bottom block
  container: {
    flex: 1,
  },
  featureDescription: {
    marginBottom: spacings.SMALL,
    marginLeft: spacings.SMALL,
  },
  headerContainer: {
    flexDirection: 'row',
    paddingVertical: spacings.HUGE,
    paddingHorizontal: spacings.HUGE,
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
    imageHeader: {
    // width: "100%",
    height: undefined,
    aspectRatio: 1.68,
    flex: 1,
    resizeMode: 'contain'
  },
  // This container size is dependent on the size of the brandImage below
  // This ensures that the image does not overflow the container
  // A padding on the brandHeader ensures adequate vertical spacing no matter the image size
  bodyHeader: {
    ...text.h3,
    color: 'black',
    marginTop: 10,
    marginBottom: 10,
  },
  bodyText: {
    ...text.h5,
    color: 'black',
  },
  headerRightIconContainer: {
    ...debug,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    ...text.h3,
    margin: spacings.HUGE,
    marginBottom: spacings.SMALL,
    color: 'black',
  },
  description: {
    margin: spacings.HUGE,
  },
  recordButton: {
    position: 'absolute',
    bottom: spacings.HUGE,
    left: '10%',
    backgroundColor: 'transparent',
    // paddingTop: '5%',
    // paddingBottom: '5%',
    // paddingLeft: '16%',
    // paddingRight: '16%',
    margin:spacings.HUGE,
  }
});

export default PathwayFull;
