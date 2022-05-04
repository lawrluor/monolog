import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { AppStack, OnBoardingStack, AuthStack } from './index';

import { readUserData } from '../utils/localStorageUtils';

const MainNavigator = (): JSX.Element =>  {
  // TODO: set user interface type
  const [user, setUser] = React.useState<null | boolean>(null);
  const [shouldOnboard, setShouldOnboard] = React.useState<boolean>(false);

  const checkOnboarding = async () => {
    let userData = await readUserData();
    console.log("UD", userData);

    if (userData && userData.onboarded) {
      // 1. Existing user: take them to AppStack (Home screen)
      setUser(true);
      setShouldOnboard(false);
    } else {
      // 2. First-time user: take them to AuthStack (Landing screen)
      setShouldOnboard(true);
    }

    // TODO: Handle sending users to Onboarding again if they wish to edit their user data.
  }

  // Helper function to decide which stack to render based on user state
  const renderNavigationStack = () => {
    // TODO: add local storage tracking for onBoard variables, including name, etc
    // NOTE: No need to review, just temporary for testing
    if (shouldOnboard) {
      return <OnBoardingStack setShouldOnboard={setShouldOnboard} />
    } else {
      if (user === null) {
        return <AuthStack setUser={setUser} setShouldOnboard={setShouldOnboard} /> 
      } else {
        return <AppStack setUser={setUser}  />
      }
    }
  }

  useEffect(() => {
    checkOnboarding();
  }, [shouldOnboard])

  return (
    <NavigationContainer>
      {renderNavigationStack()}
    </NavigationContainer>
  )
}

export default MainNavigator;
