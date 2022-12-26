import React from 'react';
import { FullPageSpinner } from '../components/Spinner';

import UserContext from '../context/UserContext';

// Initial screen in the mainNavigator, which App loads
// HANDLES: reading user from Context and checking if user exists/logged in,
// then forwarding to either AppStack or AuthStack
const AuthLoading = ({ navigation }: any) => {
  const { user } = React.useContext(UserContext);

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
    // authenticate() will be called whenever currentUser updates
    // This happens after the correct user is from database is matched to login/auth credentials
    // Then, this user is loaded from Context
    authenticate();
  }, [user]);

  return (
    <FullPageSpinner size="large" />
  );
}

export default AuthLoading;
