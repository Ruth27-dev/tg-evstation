import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageKey } from '../constants/GeneralConstants';
import { delay } from '../utils';
import { navigate, reset } from '@/navigation/NavigationService';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const credentials: any = await AsyncStorage.getItem(StorageKey.userInfo);
      const parsedCredentials = JSON.parse(credentials);
      if (parsedCredentials) {
        const isAlreadyLogin = parsedCredentials?.state?.isUserLogin;
        setIsAuthenticated(isAlreadyLogin);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      await delay(1200); 
      setLoading(false);
    }
  };
  useEffect(() => {
    checkAuth();
  }, [isAuthenticated,loading]);

  return (
    <AuthContext.Provider value={{ isAuthenticated,loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
