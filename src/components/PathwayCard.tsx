import React from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { text, spacings, colors, containers } from '../styles';
import { pathwaysMap } from '../utils/pathwaysData'
import ProgressBar from './ProgressBar';
import UserContext from '../context/UserContext';
/*
 * @param {string} pathwayName name of the pathway info to be displayed 
*/
const PathwayCard = ({ children, pathwayName }: any): JSX.Element => {
  // Max number of prompts a pathway may contain
  const MAX_LEVELS = 10
  const { user, setUser } = React.useContext(UserContext);

  const getImageURI = (img) => {
    return Image.resolveAssetSource(img).uri
  }

  const currentPathway = pathwaysMap.get(pathwayName);

  // If the current pathway exists in the user's data then that means they have started that pathway.
  // If they have started that pathway set the current level or score to their level otherwise it is 0
  const currentLevel = (pathwayName in user['pathways'])? user['pathways'][pathwayName]['currentLevel']-1 : 0
  const imageHeader = Image.resolveAssetSource(currentPathway.image).uri
  return (
    <View style={styles.featureContainer}>
      <Image style={styles.imageHeader} source={{uri:getImageURI(currentPathway.image)}}/>
      <Text style={styles.featureTitle}> {pathwayName} </Text> 
      <View style={styles.progressBar}>
        <ProgressBar  currentProgress={currentLevel} total={MAX_LEVELS}></ProgressBar>
      </View>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  featureTitle: {
    ...text.h3,
    margin: spacings.MEDIUM,
    marginBottom: spacings.SMALL,
    color: colors.PRIMARY
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
    position: 'absolute',
    right: 10,
    top: 210,
    width: '55%'
  }
});

export default PathwayCard;
