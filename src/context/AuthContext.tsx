import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  const checkTokenExpiration = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // This is a simple example. In real apps, you'd decode JWT and check its exp
      const tokenDate = localStorage.getItem('tokenDate');
      const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
      
      if (tokenDate && Date.now() - parseInt(tokenDate) > expirationTime) {
        logout();
      }
    }
  }, []);

  useEffect(() => {
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('tokenDate', Date.now().toString());
    setIsAuthenticated(true);
    navigate('/users');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenDate');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
