import React from 'react';
import { View, Animated, Easing, Pressable, StyleSheet } from 'react-native';

const generateRandomColor = (): string => {
  return Math.floor(Math.random()*16777215).toString(16)
}

const AudioBubblesAnimation = () => {
  const easing = Easing.elastic(1.5);  // https://reactnative.dev/docs/easing

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

  const movementLoop = () => {
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
    coordinate.stopAnimation();  
    opacity.stopAnimation();
    opacityLoop();
    movementLoop();
  })

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
    <View style={styles.container}>
      <Animated.View style={[styles.bubble, shadowStyle, transformStyle, { opacity: opacity, backgroundColor: `#${color}` } ]} >
        <Pressable onPress={onBubblePress} hitSlop={5} style={ ({pressed}) => [styles.bubblePressable, {backgroundColor: pressed ? '#FFFFFF66' : 'transparent' }] }>
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
  // This overlaps each bubble to make the animation pressable.
  bubblePressable: {
    flex: 1, 
    height: 100, 
    width: 100, 
    // borderWidth: 2, 
    borderRadius: 50
  },
  container: {
    flex: 1
  }
})

export default AudioBubblesAnimation;