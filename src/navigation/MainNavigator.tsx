import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppStack, OnBoardingStack, AuthStack, AuthLoading } from './index';

type StackNavigatorParams = {
  "AuthLoading": undefined;
  "AppStack": undefined;
  "AuthStack": undefined;
  "OnBoardingStack": undefined;
}

const Stack = createNativeStackNavigator<StackNavigatorParams>();

const MainNavigator = () => {
  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName='AuthLoading' screenOptions={{ animation: 'none' }}>
        <Stack.Screen name="AuthLoading" component={AuthLoading} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="AppStack" component={AppStack} options={{ headerShown: false }} />
        <Stack.Screen name="AuthStack" component={AuthStack} options={{ headerShown: false }} />
        <Stack.Screen name="OnBoardingStack" component={OnBoardingStack} options={{ headerShown: false, gestureEnabled: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator;
