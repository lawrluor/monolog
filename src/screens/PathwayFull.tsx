import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';

import UserContext from '../context/UserContext';

import SignInButton from '../components/SignInButton';
import GoBack from '../components/GoBack';
import ProgressMap from '../components/ProgressMap';
import CustomIcon from '../components/CustomIcon';

import { pathwaysMap } from '../utils/pathwaysData';

import { text, spacings, icons, colors, debug } from '../styles';

const PathwayFull = ({ route, navigation }: any): JSX.Element => {
  const { pathwayName } = route.params;
  const { user, setUser } = React.useContext(UserContext);
  const MAX_LEVELS = 10;  // Maximum number of prompts a pathway may have

  //If the user has already started the pathway, set their level, otherwise set their level to 1
  const currentLevel = (pathwayName in user['pathways']) ? user['pathways'][pathwayName]['currentLevel'] : 1
  const timesCompleted = (pathwayName in user['pathways']) ? user['pathways'][pathwayName]['timesCompleted'] : 0
  const currentPathway = pathwaysMap.get(pathwayName);

  const getImageURI = (img: any) => {
    return Image.resolveAssetSource(img).uri;
  }

  const navigateToPrompt = async (pathwayName: string) => {
    let updatedUser = { ...user, ...{ currentPathway: pathwayName } };
    setUser(updatedUser);
    navigation.push('PathwaysPrompt', { pathway:pathwayName, level: currentLevel});
  }

  // Given the long description for a pathway it parses the description
  // to add headers where '<b>' tag is found in the text
  const BodyText = () => {
    const text = currentPathway.long_desc;
    let textArray = text.split("<b>");

    return (
      <View style={styles.description}>
        {
          textArray.map((item: any, index: number) => {
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

  const renderGems = () => {
    let arr = [1,2,3,4,5];
    const gems = arr.map((x) => {
      return (
        <View style={styles.gemIcon}>
          {
            x <= timesCompleted
            ?
            <CustomIcon name={'gemstone_unfilled'} style={styles.gemFilled}></CustomIcon>
            :
            <CustomIcon name={'gemstone_unfilled'} style={styles.gemUnfilled}></CustomIcon>
          }
        </View>
      );
    });

    return <View style={styles.gemContainer}>{gems}</View>
  }

  // Set button text to Begin/Continue pathway based on user's progress
  const beginOrContinue = () => {
    return currentLevel > 1 ? "Continue Pathway" : "Begin Pathway";
  }

  return (
    <View style={styles.container}>
      <GoBack />

      <ScrollView showsVerticalScrollIndicator={false} >
        <Image style={styles.imageHeader} source={{uri:getImageURI(currentPathway.image)}}/>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{pathwayName}</Text>
          {renderGems()}
        </View>

        <BodyText />

        <ProgressMap currentProgress={currentLevel-1} total={MAX_LEVELS}/>
      </ScrollView>

      <View style={styles.recordButton}>
        <SignInButton background={colors.HIGHLIGHT}
          onPress={() => navigateToPrompt(pathwayName)}
        >
          <Text style={text.h4}>{beginOrContinue()}</Text>
        </SignInButton>
      </View>
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
    color: colors.PRIMARY,
    marginVertical: spacings.MEDIUM,
  },
  bodyText: {
    ...text.h5,
    color: colors.PRIMARY,
  },
  headerRightIconContainer: {
    ...debug,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    ...text.h4,
    color: colors.PRIMARY,
  },
  description: {
    marginHorizontal: spacings.HUGE,
    marginTop: spacings.LARGE,
    color: colors.PRIMARY
  },
  recordButton: {
    position: 'absolute',
    bottom: spacings.HUGE,
    left: '10%',
    backgroundColor: 'transparent',
    margin:spacings.HUGE,
  },
  gemIcon: {
    marginHorizontal: spacings.TINY
  },
  gemFilled: {
    ...icons.TINY,
    color: colors.HIGHLIGHT,
  },
  gemUnfilled: {
    ...icons.TINY,
    color: colors.SECONDARY,
  },
  gemContainer: {
    flexDirection: 'row',
    marginLeft: spacings.MEDIUM
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacings.HUGE,
    marginTop: spacings.HUGE
  }
});

export default PathwayFull;
