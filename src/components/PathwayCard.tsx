import React from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { text, spacings, colors, containers } from '../styles';
import { pathwaysMap } from '../utils/pathwaysData'
import ProgressBar from './ProgressBar';
import UserContext from '../context/UserContext';

const PathwayCard = ({ children, pathwayName }: any): JSX.Element => {
  const MAX_LEVELS = 10
  const { user, setUser } = React.useContext(UserContext);

  const getImageURI = (img) => {
    return Image.resolveAssetSource(img).uri
  }

  const currentPathway = pathwaysMap.get(pathwayName);
  const currentLevel = user['pathways'][pathwayName]? user['pathways'][pathwayName]['currentLevel'] : 0
  // if (user['pathways'][pathwayName]) {
  //   currentLevel = user[pathwayName]['currentLevel']
  // }
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
    right: 0,
    top: 200,
    width: '60%'
  }
});

export default PathwayCard;
