import React from 'react';
import { View, Text, Image, StyleSheet, type ImageSourcePropType } from 'react-native';
import { text, spacings, colors } from '../styles';
import { pathwaysMap } from '../utils/pathwaysData'
import ProgressBar from './ProgressBar';
import UserContext from '../context/UserContext';

type Props = {
  pathwayName: string;
  children: React.ReactNode;
}
const PathwayCard = ({ pathwayName, children }: Props) => {
  const MAX_LEVELS = 10;  // Max number of prompts a pathway may contain
  const userContext = React.useContext(UserContext);
  if (!userContext) throw new Error('UserContext must be used within a provider');

  const { user } = userContext;
  if (!user) throw new Error('User not found');


  const getImageURI = (img: ImageSourcePropType) => {
    return Image.resolveAssetSource(img).uri
  }

  const currentPathway = pathwaysMap.get(pathwayName);

  // If the current pathway exists in the user's data then that means they have started that pathway.
  // If they have started that pathway set the current level or score to their level otherwise it is 0
  const currentLevel = !user.pathways[pathwayName] ? 0 : user.pathways[pathwayName].currentLevel - 1;

  const renderProgressBar = () => {
    if (pathwayName != "New Year's Resolutions") {
      return (
        <View style={styles.progressBar}>
          <ProgressBar currentProgress={currentLevel} total={MAX_LEVELS}></ProgressBar>
        </View>
      )
    } else {

    }
  }

  return (
    <View style={styles.featureContainer}>
      <Image style={styles.imageHeader} source={{ uri: getImageURI(currentPathway.image) }} />
      <Text style={styles.featureTitle}>{pathwayName}</Text>
      {renderProgressBar()}
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  featureTitle: {
    ...text.h4,
    margin: spacings.MEDIUM,
    paddingLeft: spacings.SMALL,
    marginBottom: spacings.SMALL,
    color: colors.PRIMARY,
  },
  featureContainer: {
    backgroundColor: colors.BACKGROUND,
    borderRadius: 20,
    width: "100%",
    marginBottom: spacings.HUGE,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    paddingBottom: 35,
  },
  navigateButton: {
    alignSelf: 'center',
  },
  imageHeader: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    aspectRatio: 1.68,
    flex: 1,
    resizeMode: 'contain'
  },
  progressBar: {
    position: 'relative',
    left: '40%',
    bottom: '9%',
    width: '55%',
    marginBottom: '-10%',
  }
});

export default PathwayCard;
