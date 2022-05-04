import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

const PulseAnimation = ({ children }) => {
  const pulseAnimation = useRef(new Animated.Value(1)).current  // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(
      pulseAnimation,
      {
        toValue: 0.5,
        duration: 2000,
      }
    ).start();
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