import React from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { dimensions, text, spacings, icons, colors, debug } from '../styles';
import SignInButton from '../components/SignInButton';
import GoBack from '../components/GoBack';
import { LinearGradient } from 'expo-linear-gradient';
import { pathwaysData, pathwaysMap } from '../utils/pathwaysData'
import { SafeAreaBottom, SafeAreaTop } from '../components/SafeAreaContainer';

const PathwayFull = ({ route, navigation }: any): JSX.Element => {

  const getImageURI = (img) => {
    return Image.resolveAssetSource(img).uri
  }
  const navigateToRecord = (name: string) => {
    navigation.navigate('Recording');
  }

  const { name } = route.params;
  const currentPathway = pathwaysMap.get(name);
  return (
    <View style={styles.container}>
      <GoBack />
      <SafeAreaTop/>
      <SafeAreaBottom transparent>
        <ScrollView
          style={styles.bodyContainer}
          contentContainerStyle={styles.scrollContentContainerStyle}
          showsVerticalScrollIndicator={false}
        >
          <Image style={styles.imageHeader} source={{uri:getImageURI(currentPathway.image)}}/>
          <Text>
            {name} --- # of times completed: {currentPathway.progress[0]}
          </Text>
          <Text>
            {currentPathway.long_desc}
          </Text>
          <Text>
            Current progress: {currentPathway.progress[1]}
          </Text>
          <SignInButton background={colors.HIGHLIGHT}
            onPress={() => { navigateToRecord(name)}}
            >
            <Text style={text.h4}> RECORDING </Text>
          </SignInButton>
        </ScrollView>
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
    width: "100%",
    height: undefined,
    aspectRatio: 1,
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
});

export default PathwayFull;
