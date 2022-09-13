import React from 'react';
import { View, Animated, Easing, Pressable, StyleSheet } from 'react-native';

import { dimensions } from '../styles';

const BUBBLE_SIZE = 70;
const NUMBER_OF_BUBBLES = 25;

// Generates a random hex code.
// TODO: not sure if includes opacity or not, ideally not.
const generateRandomColor = (): string => {
  return Math.floor(Math.random()*16777215).toString(16)
}

// An individual animated Audio Bubble
const AudioBubble = ({ shouldBegin }: any) => {
  const easing = Easing.elastic(1);  // https://reactnative.dev/docs/easing

  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const [color, setColor] = React.useState<string>(generateRandomColor());  // generate random hex value

  const opacity = React.useRef(new Animated.Value(0.9)).current;
  const coordinate = React.useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const onBubblePress = () => {
    // Stop the animation, then begin the loop again. 
    // Prevents multiple simultaneous loops for the same bubble
    // done because resetAnimation() does not work
    setColor(generateRandomColor());  // Optional: set new color 

    // NOTE: Updating any state triggers useEffect to reset opacity and movement loops.
  }

  // opacity.addListener((val) => {
  //   if (val.value === -1) {
  //     opacityLoop();
  //   }
  // })

  // negative coordinates allowed
  // const generateRandomX = () => {
  //   Math.random() - 0.5;

  const movementLoop = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          coordinate,
          { 
            toValue: { x: (Math.random() - 0.5) * 200, y: Math.random() * -300 },
            duration: 3000,
            useNativeDriver: true,
            easing
          } 
        ),
        Animated.timing(
          coordinate,
          { 
            toValue: { x: 0, y: 0 },
            duration: 1,  // moves back to starting point while bubble is invisible
            useNativeDriver: true,
          } 
        )
      ])
    ).start()
  }

  const opacityLoop = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          opacity,
          {
            toValue: 0,
            duration: 2990,
            useNativeDriver: true,
          }
        ),
        Animated.timing(
          opacity,
          {
            toValue: 0.9,
            duration: 10,
            useNativeDriver: true,
          }
        )
      ])
    ).start();
  }


  React.useEffect(() => {
    console.log("shouldbegin", shouldBegin)
    if (shouldBegin) {
      setIsVisible(true);
    
      coordinate.stopAnimation();  
      opacity.stopAnimation();
      opacityLoop();
      movementLoop();
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
    transform: [{translateX: coordinate.x}, {translateY: coordinate.y }]
  }

  return (
    <View style={[styles.container, { display: isVisible ? 'flex' : 'none'}]}>
      <Animated.View style={[styles.bubble, shadowStyle, transformStyle, { opacity: opacity, backgroundColor: `#${color}` } ]} >
        <Pressable onPress={onBubblePress} hitSlop={5} style={ ({pressed}) => [styles.bubblePressable, {backgroundColor: pressed ? '#FFFFFF66' : 'transparent' }] }>
        </Pressable>
      </Animated.View>
    </View>
  )
}

// shouldBegin is a generalized alias for isRecording
const AudioBubbles = ({ shouldBegin }: any) => {
  // create array of size NUMBER_OF_BUBBLES to map through and generate each audio bubble
  const mapArray = [...Array(NUMBER_OF_BUBBLES).keys()];  

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
    backgroundColor: 'black'
  },
  // same absolute positioning from Recording.tsx
  recordContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    bottom: dimensions.height / 10
  }
});

const styles = StyleSheet.create({
  bubble: {
    aspectRatio: 1,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  // This overlaps each bubble to make the animation pressable.
  bubblePressable: {
    flex: 1, 
    aspectRatio: 1,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    // borderWidth: 2, 
  },
  container: {
    flex: 1
  }
})

export default AudioBubbles;