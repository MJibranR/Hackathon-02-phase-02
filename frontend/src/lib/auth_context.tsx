"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRead } from './api'; // Assuming UserRead schema is defined in api.ts

interface AuthContextType {
  token: string | null;
  user: UserRead | null;
  isAuthenticated: boolean;
  login: (token: string, user: UserRead) => void;
  logout: () => void;
  signup: (token: string, user: UserRead) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserRead | null>(null);
  const router = useRouter();

  // On initial load, try to retrieve token from sessionStorage or context if page refreshed
  useEffect(() => {
    // In a real app, you might load from a secure cookie or another client-side storage
    // For this spec, token is managed in React state, which means it will reset on full page refresh.
    // If persistent login is desired across refreshes, a more robust storage solution (e.g., secure, httpOnly cookies)
    // would be needed, which is out of scope for "no localStorage" constraint.
    // So, current state means user needs to log in on each full page refresh.
  }, []);

  const login = (newToken: string, newUser: UserRead) => {
    setToken(newToken);
    setUser(newUser);
    router.push('/dashboard'); // Redirect to dashboard after login
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    router.push('/'); // Redirect to homepage after logout
  };

  const signup = (newToken: string, newUser: UserRead) => {
    setToken(newToken);
    setUser(newUser);
    router.push('/dashboard'); // Redirect to dashboard after signup
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout, signup }}>
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
