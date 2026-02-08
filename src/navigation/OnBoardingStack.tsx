import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { OnBoarding1, Landing } from '../screens';
import { OnBoardingStackParamsList } from '../types/navigation';

const Stack = createNativeStackNavigator<OnBoardingStackParamsList>();

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