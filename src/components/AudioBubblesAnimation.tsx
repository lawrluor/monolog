import React from 'react';
import { View, Text, Animated, Easing, Pressable, StyleSheet } from 'react-native';


const AudioBubblesAnimation = () => {
  const easing = Easing.elastic(1);  // https://reactnative.dev/docs/easing

  const color = Math.floor(Math.random()*16777215).toString(16);  // generate random hex value

  const opacity = React.useRef(new Animated.Value(0.9)).current;
  const coordinate = React.useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const onBubblePress = () => {
    // Stop the animation, then begin the loop again. 
    // Prevents multiple simultaneous loops for the same bubble
    // done because resetAnimation() does not work
    // coordinate.stopAnimation();  
    // movementLoop();

    opacity.stopAnimation();
    opacityLoop();
  }

  // opacity.addListener((val) => {
  //   if (val.value === -1) {
  //     opacityLoop();
  //   }
  // })

  const opacityLoop = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          coordinate,
          { 
            // toValue: { x: Math.random() * 100, y: Math.random() * 100 },
            toValue: { x: Math.random() * 100, y: Math.random() * 100 },
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

  const movementLoop = () => {
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
    opacityLoop();
    movementLoop();
  })

  // animation transform
   // https://stackoverflow.com/questions/62064894/react-native-animated-you-must-specify-exactly-one-property-per-transform-objec

  const shadowStyle = {
    shadowColor: 'black', 
    shadowOpacity: 0.2, 
    shadowRadius: 2,
    shadowOffset: { width: 2, height: 2 }
  }

  const transformStyle = {
    transform: [{translateX: coordinate.x}, {translateY: coordinate.y }]
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bubble, shadowStyle, transformStyle, { opacity: opacity, backgroundColor: `#${color}` } ]} >
        <Pressable onPress={onBubblePress} hitSlop={5} style={ ({pressed}) => [{flex: 1, height: 100, width: 100, borderRadius: 50, backgroundColor: pressed ? 'red' : 'transparent' }] }>
        </Pressable>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    height: 100,
    aspectRatio: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1
  }
})

export default AudioBubblesAnimation;