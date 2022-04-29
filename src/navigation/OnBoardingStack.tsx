import React from 'react';

import { OnBoarding1, OnBoarding2, OnBoarding3 } from '../screens';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

// OnBoarding3, OnBoardingPicture, OnBoardingSliders
type OnBoardingStackParams = {
  "OnBoarding1": undefined,
  "OnBoarding2": undefined,
}

const Stack = createNativeStackNavigator<OnBoardingStackParams>(); // Generic

const OnBoardingNavigator = ({ setShouldOnboard }): JSX.Element => {
  return (
    <Stack.Navigator initialRouteName="OnBoarding1">
      <Stack.Screen 
        name="OnBoarding1"
        component={OnBoarding1}
        initialParams={{ setShouldOnboard }}
        options={{
          headerShown: false,
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
      />
      
      <Stack.Screen 
        name="OnBoarding2"
        component={OnBoarding2}
        initialParams={{ setShouldOnboard }}
        options={{
          headerShown: false,
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
      />      
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