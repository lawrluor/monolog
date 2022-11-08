import React from 'react';
import { View, Animated, Easing, Pressable, StyleSheet } from 'react-native';

import { dimensions } from '../styles';

const MAX_BUBBLE_SIZE = 180;  // largest possible bubble
const MIN_BUBBLE_SIZE = 90;  // smallest possible bubble
const NUMBER_OF_BUBBLES = 11;  
const PRESSABLE_COLOR = 'transparent';  // '#FFFFFF66'; 
const COLOR = '#D4D4D444';  // 'D4D4D455'; grey-ish

// An individual animated Audio Bubble, with its own individual display states
const AudioBubble = ({ shouldBegin }: any) => {
  // Helper function: Math.random() to generate range (-0.5, 0.5) then scaled to screen width
  const generateRandomCoordinates = (): any => {
    const x = (Math.random() - 0.5) * dimensions.width / 2;  // half of max distance
    const y = (Math.random() - 0.5) * dimensions.height / 2;  // half of max distance
    return { x: x, y: y };  
  }

  const timeOffset = Math.random() * 1500;  // 1.5 seconds of variance
  const diameter = (Math.random() * (MAX_BUBBLE_SIZE - MIN_BUBBLE_SIZE)) + MIN_BUBBLE_SIZE;  
  const coordinate = generateRandomCoordinates();  // center: { x: 0, y: 0 }

  // States
  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  // Animation values
  const size = React.useRef(new Animated.Value(0.3)).current;
  const opacity = React.useRef(new Animated.Value(0.9)).current;

  /* 
  // NOTE: not currently used - bubbles are not interactable at the moment
  const onBubblePress = () => {
    // Stop the animation, then begin the loop again. 
    // Prevents multiple simultaneous loops for the same bubble
    // This function is used because resetAnimation() does not work
    
    setIsVisible(!isVisible);  // "permanently" pop the bubble
    opacityLoop();  // "pop" the bubble

    // NOTE: Updating any state triggers useEffect to reset opacity and movement loops.
  }
  */

  // Changes the size of the bubble, looping between 30% to 90% of its size
  const sizeLoop = () => {
    Animated.loop(
      Animated.timing(
        size,
        {
          toValue: 0.9,
          duration: 2000,
          delay: timeOffset,
          easing: Easing.linear,  // "bounciness" https://reactnative.dev/docs/easing
          useNativeDriver: true,  // required
        }
      )
    ).start();
  }

  // Changes the opacity of the bubble, looping between 0% to 90% of its opacity
  const opacityLoop = () => {
    Animated.loop(
      Animated.timing(
        opacity,
        {
          toValue: 0,
          duration: 2000,
          delay: timeOffset,
          useNativeDriver: true,
        }
      )
    ).start();
  }

  React.useEffect(() => {
    if (shouldBegin) {
      setIsVisible(true);
      sizeLoop();
      opacityLoop();
    }

    return () => {
      // TODO: stop animations and reset states?
    }

  }, [shouldBegin])

  // animation transform
   // https://stackoverflow.com/questions/62064894/react-native-animated-you-must-specify-exactly-one-property-per-transform-objec

  const shadowStyle = {
    shadowColor: 'black', 
    shadowOpacity: 0.2, 
    shadowRadius: 3,
    shadowOffset: { width: 3, height: 3 }
  }

  const transformStyle = {
    transform: [{translateX: coordinate.x}, {translateY: coordinate.y}, {scaleX: size}, {scaleY: size}]
  }

  const bubbleSize = {
    height: diameter,
    borderRadius: diameter / 2
  }

  return (
    <View style={[styles.container, { display: isVisible ? 'flex' : 'none' }]}>
      <Animated.View style={[styles.bubble, bubbleSize, shadowStyle, transformStyle, { opacity: opacity, backgroundColor: COLOR } ]} >
        <Pressable 
          style={ ({pressed}) => [styles.bubblePressable, bubbleSize, { backgroundColor: pressed ? PRESSABLE_COLOR : 'transparent' }] }
          hitSlop={5} 
        >
        </Pressable>
      </Animated.View>
    </View>
  )
}

// shouldBegin is a generalized alias for isRecording
const AudioBubbles = ({ shouldBegin }: any) => {
  // create array of size NUMBER_OF_BUBBLES to map through and generate each audio bubble
  const mapArray = [...Array(NUMBER_OF_BUBBLES).keys()];  

  // First container: Full screen, with flex of 1, solid background. 
  // Second container: Absolute positioned at bottom of the screen where the record icon is.
  return (
    <View style={audioBubblesStyles.container}>
      <View style={audioBubblesStyles.recordContainer}>
        {
          mapArray.map((id: number) => {
            return (
              <View key={id} style={{ position: 'absolute' }}>
                <AudioBubble shouldBegin={shouldBegin} />
              </View>
            )
          })
        }
      </View>
    </View>
  )
}

const audioBubblesStyles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    bottom: dimensions.height / 10
  }
});

const styles = StyleSheet.create({
  bubble: {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  // This overlaps each bubble to make the animation pressable.
  bubblePressable: {
    flex: 1, 
    aspectRatio: 1,
    borderColor: 'white',
    borderWidth: 1
  },
  container: {
    flex: 1,
  }
})

export default AudioBubbles;