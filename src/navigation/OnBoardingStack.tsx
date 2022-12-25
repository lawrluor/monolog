import React from 'react';

import { OnBoarding1, Landing } from '../screens';


import { createNativeStackNavigator } from '@react-navigation/native-stack';

// OnBoarding3, OnBoardingPicture, OnBoardingSliders
type OnBoardingStackParams = {
  "OnBoarding1": undefined,
  "Landing": undefined
}

const Stack = createNativeStackNavigator<OnBoardingStackParams>(); // Generic

const OnBoardingNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen
        name="OnBoarding1"
        component={OnBoarding1}
        options={{
          headerShown: false,
          transitionSpec: {
            open: config,
            close: config
          }
        }}
      />

      <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }}/>
    </Stack.Navigator>
  )
}

// For animations: see https://reactnavigation.org/docs/stack-navigator/#animations
const config = {
  // animation property: spring, timing
  animation: 'spring',

  // config property:
  // For timing: duration, easing
  // For spring: stiffness, damping, mass, overshootClamping, restDisplacementThreshold, restSpeedThreshold
  config: {
    stiffness: 500,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

export default OnBoardingNavigator;