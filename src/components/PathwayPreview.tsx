import React from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { text, spacings, colors } from '../styles';
import SignInButton from './SignInButton';
import {
  procrastination_header,
  anxiety_header,
  depression_header,
  grief_loss_header,
} from '../../assets/img/pathway-headers'

const PathwayPreview = ({ children, title, navigation}: any): JSX.Element => {
  let userPathwayProgress = { 'procrastination': 0 }
  const startOrContinue = userPathwayProgress['procrastination'] > 0 ? "Continue Pathway" : "Start Pathway";

  const pathways = {
    'Depression': depression_header,
    'Anxiety': anxiety_header,
    'Procrastination': procrastination_header,
    'Grief & Loss': grief_loss_header,
  }
  const imageHeader = Image.resolveAssetSource(pathways[title]).uri
  return (
    <View style={styles.featureContainer}>
      <Image style={styles.imageHeader} source={{uri:imageHeader}} />
      <Text style={styles.featureTitle}> {title} {'\n'}</Text>
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

export default PathwayPreview;
