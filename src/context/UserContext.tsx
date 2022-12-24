import React from 'react';

import { writeUserData, readUserData, createAllDirectories } from '../utils/localStorageUtils';

const UserContext = React.createContext(undefined!);

export const UserProvider: React.FC = ({children}) => {
  const [user, setUser] = React.useState({});
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // 1. First, fetch user from local db, just do this once
  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        let fetchedUser = await readUserData();
        setUser(fetchedUser);
      } catch (err) {
        console.log(
          "[ERROR] UserContext.tsx:fetchUserData", err,
          "The user data directory has not been created yet, but is being created now."
        );

        // await createAllDirectories();
        // let fetchedUser = await readUserData();
        // setUser(fetchedUser);
      }

      setIsLoading(false);
    }

    fetchUserData();
  }, []);

  // 2. Whenever user is updated, write it to local database
  React.useEffect(() => {
    const wrapper = async () => {
      if (user && user!=={} && Object.keys(user).length > 0) {
        console.log("Writing updated non-empty user to db: ", user);
        writeUserData(user);
        setIsLoading(false);
      }
    }

    wrapper();
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext;