import React from 'react';
import { Spinner } from '../components/Spinner';

import UserContext from '../context/UserContext';
import { readUserData } from '../utils/localStorageUtils';

// Initial screen in the mainNavigator, which App loads
// HANDLES: loading user and checking if user exists/logged in, then forwarding to either AppStack or AuthStack
const AuthLoading = ({ navigation }: any) => {
  const { user, setUser } = React.useContext(UserContext);

  const authenticate = async () => {
    // let queriedUser = await readUserData();
    // console.log("AuthLoading Queried User: ", queriedUser)
    console.log("AuthLoading Context User: ", user);

    if (user && user.onboarded) {
      navigation.navigate('AppStack');
    } else {
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
    <Spinner size="large" />
  );
}

export default AuthLoading;
