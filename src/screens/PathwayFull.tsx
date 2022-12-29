import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Alert } from 'react-native';
import { dimensions, text, spacings, icons, colors, debug } from '../styles';
import SignInButton from '../components/SignInButton';
import GoBack from '../components/GoBack';
import { pathwaysMap } from '../utils/pathwaysData'
import { SafeAreaBottom, SafeAreaTop } from '../components/SafeAreaContainer';
import ProgressMap from '../components/ProgressMap';
import UserContext from '../context/UserContext';
import CustomIcon from '../components/CustomIcon';

const PathwayFull = ({ route, navigation }: any): JSX.Element => {
  const { pathwayName } = route.params;
  const { user, setUser } = React.useContext(UserContext);
  const MAX_LEVELS = 10 // Maximum number of prompts a pathway may have
  //If the user has already started the pathway, set their level, otherwise set their level to 1
  const currentLevel = (pathwayName in user['pathways']) ? user['pathways'][pathwayName]['currentLevel'] : 1
  const timesCompleted = (pathwayName in user['pathways']) ? user['pathways'][pathwayName]['timesCompleted'] : 0
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
  // gemstone_unfilled
  const renderGems = () => {
    let gemArray = []
    for (let gemI = 1; gemI <= 5; gemI++) {
      if (gemI <= timesCompleted) {
        gemArray.push(<CustomIcon name={'gemstone_unfilled'} style={styles.gemFilled}></CustomIcon>)
      } else {
        gemArray.push(<CustomIcon name={'gemstone_unfilled'} style={styles.gemUnfilled}></CustomIcon>)
      }
    }
    return <Text style={styles.gemContainer}>{gemArray}</Text>
  }

  // Set button text to Begin/Continue pathway based on user's progress
  const beginOrContinue = (pathwayName: string) => {
    if (currentLevel > 1) {
      return "Continue Pathway"
    } else {
      return "Begin Pathway"
    }
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
            {pathwayName}
          </Text>
          {renderGems()}
          <BodyText />
          <ProgressMap currentProgress={currentLevel-1} total={MAX_LEVELS}/>  
        </ScrollView>
        <View style={styles.recordButton}>
          <SignInButton background={colors.HIGHLIGHT}
            onPress={() => { navigateToPrompt(pathwayName)}}
            >
            <Text style={text.h4}> {beginOrContinue(pathwayName)} </Text>
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
    margin:spacings.HUGE,
  },
  gemFilled: {
    ...icons.TINY,
    color: colors.HIGHLIGHT,
    margin: spacings.HUGE,
  },
  gemUnfilled: {
    ...icons.TINY,
    color: colors.SECONDARY,
  },
  gemContainer: {
    flexDirection: 'row',
    position: 'relative',
    bottom: '7%',
    left: '30%',
  }
});

export default PathwayFull;
