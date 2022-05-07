import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppStack, OnBoardingStack, AuthStack, AuthLoading } from './index';

type StackNavigatorParams = {
  "AuthLoading": undefined,
  "AppStack": undefined,
  "AuthStack": undefined,
  "OnBoardingStack": undefined
}

const Stack = createNativeStackNavigator<StackNavigatorParams>();

const MainNavigator = (): JSX.Element =>  {
  const renderNavStack = () => {
    return (
      <NavigationContainer >
        <Stack.Navigator initialRouteName='AuthLoading' screenOptions={{ animation: 'none' }}>
          <Stack.Screen name="AuthLoading" component={AuthLoading} options={{ headerShown: false, }} />
          <Stack.Screen name="AppStack" component={AppStack} options={{ headerShown: false }} />
          <Stack.Screen name="AuthStack" component={AuthStack} options={{ headerShown: false }} />
          <Stack.Screen name="OnBoardingStack" component={OnBoardingStack} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

        // 1. Existing user: take them to AppStack (Home screen)
        // if (userData && userData.onboarded) {
        //   return <AuthStack /> 
        // } else {
        //   return <AppStack />
        // }

  return (
    renderNavStack()
  )
}

export default MainNavigator;
