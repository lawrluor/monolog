import React from 'react';

import { writeUserData, readUserData } from '../utils/localStorageUtils';

type User = {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  pronouns: string;
  onboarded?: boolean;
}

type UserContextValue = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
};

const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // 1. First, fetch user from local db, just do this once
  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        let fetchedUser = await readUserData();
        setUser(fetchedUser);
      } catch (err) {
        console.log("[ERROR] UserContext.tsx:fetchUserData", err)
      }

      setIsLoading(false);
    }

    fetchUserData();
  }, []);

  // 2. Whenever user is updated, write it to local database
  React.useEffect(() => {
    const wrapper = async () => {
      if (user) {
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