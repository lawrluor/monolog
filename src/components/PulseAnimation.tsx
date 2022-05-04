import React from 'react';
import { Animated } from 'react-native';

// See: https://reactnativeforyou.com/react-native-animation-tutorials-how-to-create-looping-animations-in-react-native/
// Reference: https://reactnative.dev/docs/animated#sequence
const PulseAnimation = ({ children }: any) => {
  const pulseAnimation = React.useRef(new Animated.Value(1)).current  // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          pulseAnimation,
          {
            toValue: 0.33,
            duration: 500,
            useNativeDriver: true
          }
        ),
        Animated.timing(
          pulseAnimation,
          {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
          }
        )
      ])
    ).start()
  }, [pulseAnimation])

  return (
    <Animated.View
      style={{
        opacity: pulseAnimation
      }}
    >
      {children}
    </Animated.View>
  );
}

export default PulseAnimation