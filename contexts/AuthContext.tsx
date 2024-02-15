import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import AuthService from '../services/AuthService';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({ currentUser: null, isLoading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = AuthService.listenToAuthStateChanges((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};