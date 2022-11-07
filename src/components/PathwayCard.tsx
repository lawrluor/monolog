import React from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { text, spacings, colors } from '../styles';
import SignInButton from './SignInButton';
import { pathwaysMap } from '../utils/pathwaysData'
import { comingSoonAlert } from '../utils/customAlerts';

const PathwayCard = ({ children, name, navigation}: any): JSX.Element => {

  const getImageURI = (img) => {
    return Image.resolveAssetSource(img).uri
  }

  const currentPathway = pathwaysMap.get(name);
  console.log("-----------------CURRENT PATHWAY:"+currentPathway+"----------------")

  const imageHeader = Image.resolveAssetSource(currentPathway.image).uri
  return (
    <View style={styles.featureContainer}>
      <Image style={styles.imageHeader} source={{uri:getImageURI(currentPathway.image)}}/>
      <Text style={styles.featureTitle}> {name} {'\n'}</Text>
      {children}
      
      {/* TODO: Add button to go straight to recording, needs to know title and progress */}
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
    padding: spacings.HUGE,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
  },
  navigateButton: {
    alignSelf: 'center',
  },
  imageHeader: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
  }
});

export default PathwayCard;
