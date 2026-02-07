import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { OnBoarding1, Landing } from '../screens';

// TODO: add OnBoarding3, OnBoardingPicture, OnBoardingSliders
type OnBoardingStackParams = {
  "OnBoarding1": undefined;
  "Landing": undefined;
}

const Stack = createNativeStackNavigator<OnBoardingStackParams>();

const OnBoardingNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />
      <Stack.Screen
        name="OnBoarding1"
        component={OnBoarding1}
        options={{
          headerShown: false,
          animation: 'slide_from_right'
        }}
      />
    </Stack.Navigator>
  )
}

export default OnBoardingNavigator;