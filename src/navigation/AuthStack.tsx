import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Signup, Login } from '../screens';
import { AuthStackParamsList } from '../types/navigation';

const Stack = createNativeStackNavigator<AuthStackParamsList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default AuthNavigator;