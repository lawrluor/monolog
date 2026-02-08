import React from 'react';
import { type StackNavigationProp } from '@react-navigation/stack';

import UserContext from '../context/UserContext';
import { FullPageSpinner } from '../components/Spinner';
import { type MainNavigationStackParamsList } from '../types/navigation';

type Props = {
  navigation: StackNavigationProp<MainNavigationStackParamsList>;
}

// Initial screen in the mainNavigator, which App loads
// HANDLES: reading user from Context and checking if user exists/logged in,
// then forwarding to either AppStack or AuthStack
const AuthLoading = ({ navigation }: Props) => {
  const userContext = React.useContext(UserContext);
  if (!userContext) throw new Error('AuthLoading must be used within a UserProvider');
  const { user } = userContext;

  const authenticate = async () => {
    if (user && user?.onboarded) {
      // Once user is "signed in", disallow returning to AuthLoading screen using reset
      // this wipes the AuthLoading screen and starts with a fresh stack
      navigation.reset({
        index: 0,
        routes: [{ name: 'AppStack' }]
      });
    } else {
      // Note: Must use .navigate(), so AuthLoading is still in the navigation stack
      // This is because AuthLoading is listening for changes to the user state
      // This also means that when Onboarding, can go back to Landing screen
      // TODO: If creating sign out method, might have to handle a bit differently
      navigation.navigate('OnBoardingStack');
    }
  }

  React.useEffect(() => {
    authenticate();
  }, [user]);

  return <FullPageSpinner size="large" />
}

export default AuthLoading;
