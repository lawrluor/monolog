import React from 'react';
import { View, Animated, Easing, Pressable, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import { dimensions } from '../styles';

const generateRandomCoordinates = (): any => {
  const x = (Math.random() - 0.5) * dimensions.width / 2;  // half of max distance
  const y = (Math.random() - 0.5) * dimensions.height / 2;  // half of max distance
  return { x: x, y: y };  
}

const MAX_SIZE = 180;
const MIN_SIZE = 90;
const NUMBER_OF_BUBBLES = 10;
const PRESSABLE_COLOR = 'transparent';  // '#FFFFFF66'; 
const COLOR = 'transparent' // 'D4D4D455';  // use grey-ish transparent color instead of generateRandomColor();

// An individual animated Audio Bubble
const AudioBubble = ({ shouldBegin }: any) => {
  // MIN_SIZE is smallest possible bubble
  const BUBBLE_SIZE = (Math.random() * (MAX_SIZE - MIN_SIZE)) + MIN_SIZE;  
  const TIME_OFFSET = Math.random() * 500;

  const coordinate = generateRandomCoordinates();  // center: { x: 0, y: 0 }

  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const [color, setColor] = React.useState<string>(COLOR);  // generate random hex value

  const size = React.useRef(new Animated.Value(0.3)).current;
  const opacity = React.useRef(new Animated.Value(0.9)).current;

  // Not currently used - bubbles are not interactable at the moment
  const onBubblePress = () => {
    // Stop the animation, then begin the loop again. 
    // Prevents multiple simultaneous loops for the same bubble
    // done because resetAnimation() does not work
    
    // setIsVisible(!isVisible);  // "permanently" pop the bubble
    // opacityLoop();  // "pop" the bubble

    // NOTE: Updating any state triggers useEffect to reset opacity and movement loops.
  }

  const sizeLoop = () => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(TIME_OFFSET),
        Animated.timing(
          size,
          {
            toValue: 1.0,
            duration: 2000,
            easing: Easing.linear,  // How "bouncy" during movements https://reactnative.dev/docs/easing
            useNativeDriver: true,
          }
        ),
        Animated.timing(
          size,
          {
            toValue: 0.3,
            duration: 1,
            useNativeDriver: true,
          }
        )
      ])
    ).start();
  }

  const opacityLoop = () => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(TIME_OFFSET),
        Animated.timing(
          opacity,
          {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }
        ),
        Animated.timing(
          opacity,
          {
            toValue: 0.9,
            duration: 1,
            useNativeDriver: true,
          }
        )
      ])
    ).start();
  }

  React.useEffect(() => {
    if (shouldBegin) {
      setIsVisible(true);
      
      size.stopAnimation();
      sizeLoop();
      
      opacity.stopAnimation();
      opacityLoop();
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
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2
  }

  return (
    <View style={[styles.container, { display: isVisible ? 'flex' : 'none' }]}>
      <Animated.View style={[styles.bubble, bubbleSize, shadowStyle, transformStyle, { opacity: opacity, backgroundColor: `#${color}` } ]} >
        <Pressable 
          onPress={onBubblePress} 
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
    borderWidth: 2, 
  },
  container: {
    flex: 1
  }
})

export default AudioBubbles;