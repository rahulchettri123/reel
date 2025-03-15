// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { localStorageService } from '../../services/localStorage';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = localStorageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const user = localStorageService.loginUser(email, password);
    if (user) {
      setUser(user);
      setIsAuthenticated(true);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorageService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (username: string, email: string, password: string) => {
    const user = localStorageService.registerUser(username, email, password);
    setUser(user);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}