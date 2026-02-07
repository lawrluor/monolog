import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Signup, Login } from '../screens';

// Initial params (NOT PROPS) for routes: See https://reactnavigation.org/docs/typescript/
// Specifying undefined means that the route doesn't have params.
// A union type with undefined (e.g. SomeType | undefined) means that params are optional.
type AuthStackParams = {
  "Signup": undefined;
  "Login": undefined;
}

const Stack = createNativeStackNavigator<AuthStackParams>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default AuthNavigator;