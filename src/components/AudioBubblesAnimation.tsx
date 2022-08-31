import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const color = Math.floor(Math.random()*16777215).toString(16);

const AudioBubblesAnimation = () => {
  const bubbleAnim = React.useRef(new Animated.Value(0.9)).current;
  const moveX = React.useRef(new Animated.Value(0)).current;
  const moveY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          bubbleAnim,
          {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true
          }
        ),
        Animated.timing(
          bubbleAnim,
          {
            toValue: 0.9,
            duration: 0,
            useNativeDriver: true
          }
        )
      ])
    ).start();
  })

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          moveX,
          {
            toValue: Math.random() * 100,
            duration: 3000,
          }
        ),
        // Animated.timing(
        //   moveX,
        //   {
        //     toValue: 0,
        //     duration: 3000,
        //   }
        // )
      ])
    ).start();
  })

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          moveY,
          {
            toValue: Math.random() * 100,
            duration: 3000,
          }
        ),
        // Animated.timing(
        //   moveX,
        //   {
        //     toValue: 0,
        //     duration: 3000,
        //   }
        // )
      ])
    ).start();
  })

  return (
    <View style={styles.container}>
      <Animated.View style={{ marginLeft: moveX, marginTop: moveY }}>
        <Animated.View style={[styles.bubble, { opacity: bubbleAnim }]}>  

        </Animated.View>
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
    backgroundColor: `#${color}`
  },
  container: {
    flex: 1
  }
})

export default AudioBubblesAnimation;