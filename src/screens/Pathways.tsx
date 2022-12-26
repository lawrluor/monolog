import React from 'react';
import { StyleSheet, View, ScrollView, Text, Pressable, Alert } from 'react-native';
import { SafeAreaBottom, SafeAreaTop } from '../components/SafeAreaContainer';
import { dimensions, text, spacings, icons, colors, debug } from '../styles';
import GoBack from '../components/GoBack';
import { LinearGradient } from 'expo-linear-gradient';
import PathwayCard from '../components/PathwayCard';
import PathwayFull from './PathwayFull';
import { NavigationHelpersContext, useNavigation } from '@react-navigation/native';
import { pathwaysData, pathwaysMap } from '../utils/pathwaysData'
import SignInButton from '../components/SignInButton';
import GoForward from '../components/GoForward';
import UserContext from '../context/UserContext';

const Pathways = ({ navigation }: any): JSX.Element => { 
  const { user, setUser } = React.useContext(UserContext);

  const navigateToFullPathway = (pathwayName: string) => {
    navigation.push('PathwayFull', { pathwayName: pathwayName })
  }

  const navigateToPrompt = async (pathwayName: string) => {
    let updatedUser = { ...user, ...{ currentPathway: pathwayName } }
    setUser(updatedUser)
    const currentLevel = (pathwayName in user['pathways']) ? user['pathways'][pathwayName] : 1
    navigation.push('PathwaysPrompt', { pathway:pathwayName, level: currentLevel});
  }

  // Set button text to Begin/Continue pathway based on user's progress
  const beginOrContinue = (pathwayName: string) => {
    const currentLevel = (pathwayName in user['pathways']) ? user['pathways'][pathwayName] : 1
    if (currentLevel > 1) {
      return "Continue Pathway"
    } else {
      return "Begin Pathway"
    }
  }

  return (
    <View style={styles.container}>
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
                  <PathwayCard pathwayName={item.name} key={`${item.name}_short`}>
                    <View style={styles.forwardArrow}>
                      <GoForward callback={() => { navigateToFullPathway(item.name) }} />
                    </View>
                    <Text style={[text.p, styles.featureDescription]}>
                      {item.short_desc}
                    </Text>
                    <View style={ styles.navigateButton }>
                      <SignInButton background={colors.HIGHLIGHT}
                        onPress={() => navigateToPrompt(item.name)}
                        >
                        <Text style={text.h4}> {beginOrContinue(item.name)} </Text>
                      </SignInButton>
                    </View>
                  </PathwayCard>
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
    margin: spacings.HUGE,
    marginTop: spacings.SMALL,
    color: colors.SECONDARY,
  },
  headerContainer: {
    flexDirection: 'row',
    paddingVertical: spacings.HUGE,
    // paddingHorizontal: spacings.MEDIUM,
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
    ...text.h2,
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
  forwardArrow: {
    // top:0,
    // padding: spacings.HUGE,
    // margin: spacings.HUGE,
    position: 'absolute',
    bottom: '122.5%',
    left: '78%',
  },
});

export default Pathways;
