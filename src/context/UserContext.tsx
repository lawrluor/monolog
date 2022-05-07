import React from 'react';

import { writeUserData, readUserData } from '../utils/localStorageUtils';

const UserContext = React.createContext(undefined!);

export const UserProvider: React.FC = ({children}) => {
  const [user, setUser] = React.useState({});
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // 1. First, fetch user from local db, just do this once
  React.useEffect(() => {
    const fetchUserData = async () => {
      let u = await readUserData();
      setUser(u);
    }

    fetchUserData();
  }, []);

  // 2. Whenever user is updated, write it to local database
  React.useEffect(() => {
    const wrapper = async () => {
      console.log("current user", user);
      if (Object.keys(user).length > 0) {
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