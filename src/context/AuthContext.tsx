import React from 'react';

interface AuthData {
  name: string;
  id: string;
}

interface AuthContextData {
  authData?: AuthData | null;
  isLoading: boolean;
  signIn(): Promise<void>;
  signOut(): void;
};

// Workaround bug https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/#extended-example
const AuthContext = React.createContext<AuthContextData>(undefined!); 
// const AuthContext = React.createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider:React.FC = ({ children }) => {
  const [authData, setAuthData] = React.useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const signIn = async ():Promise<void> => {
    // TODO: sign-in logic. Will be replaced with Firebase later 
    console.log("Signing in...");
    setIsLoading(true);
    setAuthData({name:'admin', id:'123'});
    setIsLoading(false);
  }

  const signOut = async ():Promise<void> => {
    console.log("Signing out...");
    setAuthData(null);
  }

  return (
    <AuthContext.Provider value={{ authData, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;