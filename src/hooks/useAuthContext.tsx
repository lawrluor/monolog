import React from 'react';

import AuthContext from '../context/AuthContext';

interface AuthData {
  name: string;
  id: string;
}

type AuthContextData = {
  authData?: AuthData;
  isLoading: boolean;
  signIn(): Promise<void>;
  signOut(): void;
};

const useAuthContext = (): AuthContextData => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export default useAuthContext;