import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Alert } from 'react-native';
import { dimensions, text, spacings, icons, colors, debug } from '../styles';
import SignInButton from '../components/SignInButton';
import GoBack from '../components/GoBack';
import { pathwaysMap } from '../utils/pathwaysData'
import { SafeAreaBottom, SafeAreaTop } from '../components/SafeAreaContainer';
import ProgressMap from '../components/ProgressMap';
import UserContext from '../context/UserContext';

const PathwayFull = ({ route, navigation }: any): JSX.Element => {
  const { pathwayName } = route.params;
  const { user, setUser } = React.useContext(UserContext);
  // Max number of prompts a pathway may contain
  const MAX_LEVELS = 10
  const currentLevel = (pathwayName in user['pathways']) ? user['pathways'][pathwayName]['currentLevel'] : 1
  const currentPathway = pathwaysMap.get(pathwayName);

  const getImageURI = (img) => {
    return Image.resolveAssetSource(img).uri
  }

  const navigateToPrompt = async (pathwayName: string) => {
    let updatedUser = { ...user, ...{ currentPathway: pathwayName } }
    setUser(updatedUser)
    // const currentLevel = (pathwayName in user['pathways']) ? user['pathways'][pathwayName] : 1
    navigation.push('PathwaysPrompt', { pathway:pathwayName, level: currentLevel});
  }
  // Given the long description for a pathway it parses the description
  // to add headers where '<b>' tag is found in the text
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
            {pathwayName} --- {user['pathways'][pathwayName]['timesCompleted']} stars
          </Text>
          <BodyText></BodyText>
          <ProgressMap currentProgress={currentLevel} total={MAX_LEVELS}/>  
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
