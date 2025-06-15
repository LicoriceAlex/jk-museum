import { useState, useEffect } from 'react';
import { getToken, removeToken, setAuthHeader, saveToken } from '../utils/serviceToken';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      if (token) {
        setIsAuthenticated(true);
        setAuthHeader(token);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const login = (token: string) => {
    saveToken(token);
    setAuthHeader(token);
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    removeToken();
    setAuthHeader('');
    setIsAuthenticated(false);
  };
  
  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};
