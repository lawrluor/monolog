import React from 'react';
import { StyleSheet, View, ScrollView, Text, Pressable, Alert } from 'react-native';
import { SafeAreaBottom, SafeAreaTop } from '../components/SafeAreaContainer';
import { dimensions, text, spacings, icons, colors, debug } from '../styles';
import GoBack from '../components/GoBack';
import { LinearGradient } from 'expo-linear-gradient';
import PathwayPreview from '../components/PathwayPreview';
import PathwayFull from './PathwayFull';
import { NavigationHelpersContext, useNavigation } from '@react-navigation/native';
import { pathwaysData, pathwaysMap } from '../utils/pathwaysData'
import SignInButton from '../components/SignInButton';

const Pathways = ({ navigation }: any): JSX.Element => { 

  const navigateToFullPathway = (name: string) => {
    navigation.push('PathwayFull', { name: name })
  }

  // TODO: add prompt params for recording proompt
  const navigateToRecord = (name: string) => {
    navigation.navigate('Recording');
  }

  return (
    <View style={styles.container}>
      <GoBack />
      <SafeAreaTop/>
      <SafeAreaBottom transparent>
        <LinearGradient
          colors={[colors.HIGHLIGHT, colors.HIGHLIGHT2]}
          style={styles.container}
        >
          <ScrollView
            style={styles.bodyContainer}
            contentContainerStyle={styles.scrollContentContainerStyle}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Pathways</Text>
            </View>
            {
              pathwaysData.map((item, index) => {
                return (
                  <PathwayPreview name={item.name} key={`${item.name}_short`}>
                    <Text style={[text.p, styles.featureDescription]}>
                      {item.short_desc}
                    </Text>
                    <View style={styles.navigateButton }>
                      <SignInButton background={colors.HIGHLIGHT}
                        onPress={() => { navigateToFullPathway(item.name)}}
                        >
                        <Text style={text.h4}> Full Desc </Text>
                      </SignInButton>
                      <SignInButton background={colors.HIGHLIGHT}
                        onPress={() => { navigateToRecord(item.name)}}
                        >
                        <Text style={text.h4}> RECORDING </Text>
                      </SignInButton>
                    </View>
                  </PathwayPreview>
                )
              })
            }
          </ScrollView>
        </LinearGradient>
      </SafeAreaBottom>
    </View>
  )
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
  // This container size is dependent on the size of the brandImage below
  // This ensures that the image does not overflow the container
  // A padding on the brandHeader ensures adequate vertical spacing no matter the image size
  bodyContainer: {
    paddingHorizontal: spacings.HUGE,
  },
  scrollContentContainerStyle: {
    paddingVertical: spacings.HUGE,
  },
  headerRightIconContainer: {
    ...debug,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    ...text.h2
  },
  hidden: {
    display: 'none',
  },
  unhidden: {
    display: 'flex'
  },
  navigateButton: {
    alignSelf: 'center',
  },
});

export default Pathways;
