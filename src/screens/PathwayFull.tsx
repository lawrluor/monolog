import React from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { dimensions, text, spacings, icons, colors, debug } from '../styles';
import SignInButton from '../components/SignInButton';
import GoBack from '../components/GoBack';
import { LinearGradient } from 'expo-linear-gradient';
import { pathwaysData, pathwaysMap } from '../utils/pathwaysData'
import { SafeAreaBottom, SafeAreaTop } from '../components/SafeAreaContainer';
import ProgressBar from '../components/ProgressBar';
import { BorderlessButton } from 'react-native-gesture-handler';

const PathwayFull = ({ route, navigation }: any): JSX.Element => {
  const { name } = route.params;
  const currentPathway = pathwaysMap.get(name);
  const progress = currentPathway.progress[1] / 10* 100;

  const getImageURI = (img) => {
    return Image.resolveAssetSource(img).uri
  }
  const navigateToPrompt = (name: string) => {
    const level = pathwaysMap.get(name).progress[1]
    navigation.push('PathwaysPrompt', { pathway:name, level: level});
  }
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
            {name} --- {currentPathway.progress[0]} stars
          </Text>
          <BodyText></BodyText>
          <ProgressBar currentProgress={3} total={10}>
          </ProgressBar>
        </ScrollView>
        <View style={styles.recordButton}>
          <SignInButton background={colors.HIGHLIGHT}
            onPress={() => { navigateToPrompt(name)}}
            >
            <Text style={text.h4}> RECORDING </Text>
          </SignInButton>
        </View>
      </SafeAreaBottom>
    </View>
  );
}

const styles = StyleSheet.create({
  progressBarFill: {
    backgroundColor: '#8BED4F',
  },
  progressBarContainer: {
    flex: 1,
    flexDirection: "column", //column direction
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '10%',
    backgroundColor: 'transparent',
    padding: 8,
  },
  progressBar: {
    height: 5,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'lightgrey',
    borderColor: '#000',
  },
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
    bottom: '0%',
    left: '0%',
    backgroundColor: 'transparent',
    paddingTop: '5%',
    paddingBottom: '5%',
    paddingLeft: '16%',
    paddingRight: '16%',
  }
});

export default PathwayFull;
