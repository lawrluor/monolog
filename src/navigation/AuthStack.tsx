import React from 'react';

import { Landing, Signup, Login } from '../screens';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Initial params (NOT PROPS) for routes: See https://reactnavigation.org/docs/typescript/
// Specifying undefined means that the route doesn't have params.
// A union type with undefined (e.g. SomeType | undefined) means that params are optional.
type AuthStackParams = {
  "Signup": boolean,
  "Login": boolean
}

const Stack = createNativeStackNavigator<AuthStackParams>(); // Generic

const AuthNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }}/>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
    </Stack.Navigator>
  )
}

export default AuthNavigator;