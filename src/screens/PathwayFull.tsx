import React from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { dimensions, text, spacings, icons, colors, debug } from '../styles';
import SignInButton from '../components/SignInButton';
import {
  procrastination_header,
  anxiety_header,
  depression_header,
  grief_loss_header,
} from '../../assets/img/pathway-headers'
import GoBack from '../components/GoBack';
import { LinearGradient } from 'expo-linear-gradient';
import { pathwaysData } from '../utils/pathwaysData'
import { SafeAreaBottom, SafeAreaTop } from '../components/SafeAreaContainer';

const PathwayFull = ({ route, navigation }: any): JSX.Element => {

const data = {
    "Procrastination": {
      name: "Procrastination",
      long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
      image: "procrastination_header",
      progress: [0,3],
    },
    "Depression": {
      name: "Depression",
      long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
      image: "depression_header",
      progress: [1,4],
    }
  }

  const pathwaysMap = new Map();
  pathwaysMap.set('Procrastination', { name: "Procrastination",
      long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
      image: procrastination_header,
    progress: [0, 3],
  })
  pathwaysMap.set('Depression', { name: "Depression",
      long_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim ac ipsum tempus vehicula. Quisque at leo pharetra, venenatis metus sit amet, efficitur justo. Sed vel tortor metus. Duis mattis, dolor quis dapibus semper, elit purus lobortis massa, eget mollis velit tellus sed sem. Phasellus ante ipsum, consectetur quis interdum et, porta sit amet nibh. Suspendisse et neque ut sem pretium varius. Mauris eget tortor et lectus condimentum tempus. Proin euismod leo eu orci congue ornare. Mauris ac odio vel arcu molestie cursus quis et erat. Mauris odio nisi, interdum nec lacus ac, egestas pretium nisi. Donec ante quam, interdum eu molestie nec, maximus a quam.",
      image: depression_header,
    progress: [0, 3],
  })

  const getImageURI = (img) => {
    return Image.resolveAssetSource(img).uri
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
            {'\n'}{name} : {currentPathway.progress[0]}
          </Text>
          <Text>
            {currentPathway.long_desc}
          </Text>
          <Text>
            {currentPathway.progress[1]}
          </Text>
        </ScrollView>
      </SafeAreaBottom>
    </View>
  );
}

{/* <SignInButton background={colors.HIGHLIGHT}
              onPress={() => {
                let currentObj = pathwaysMap.get(name);
                console.log(currentObj.image)
              }}
              >
              <Text style={text.h4}> CONSOLE LOG </Text>
            </SignInButton> */}













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
