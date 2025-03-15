// src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, logout, refreshToken, getUser } from '../utils/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    username: localStorage.getItem('username'),
    loading: false,
    error: null
  });
  const [tokenRefreshTimer, setTokenRefreshTimer] = useState(null);
  const reactNavigate = useNavigate();

  // Set up timer to refresh token
  const setupRefreshTimer = () => {
    if (tokenRefreshTimer) {
      clearTimeout(tokenRefreshTimer);
    }
    
    const timer = setTimeout(refreshTokenHandler, 14 * 60 * 1000);
    setTokenRefreshTimer(timer);
  };

  // Function to refresh the token
  const refreshTokenHandler = async () => {
    try {
      await refreshToken();
      setupRefreshTimer();
    } catch (err) {
      console.error('Token refresh failed:', err);
      handleAuthError(err);
      logoutHandler(false); // Silent logout (don't show success message)
    }
  };

  // Function to handle authentication errors
  const handleAuthError = (error) => {
    const errorMessage = error.message || 'Authentication failed';
    setAuthState(prev => ({
      ...prev,
      loading: false,
      error: errorMessage
    }));
    
    toast.error(errorMessage);
  };

  // Check auth status on mount
  useEffect(() => {
    const verifyAuth = async () => {
      if (localStorage.getItem('username')) {
        try {
          setAuthState(prev => ({ ...prev, loading: true }));
          const userData = await getUser();
          setAuthState({
            username: userData.user.username,
            loading: false,
            error: null
          });
          setupRefreshTimer();
        } catch (err) {
          // Handle token expiration or other errors
          console.error('Auth verification failed:', err);
          setAuthState({
            username: null,
            loading: false,
            error: null // Don't show error on initial load
          });
          localStorage.removeItem('username');
        }
      }
    };

    verifyAuth();
    
    return () => {
      if (tokenRefreshTimer) {
        clearTimeout(tokenRefreshTimer);
      }
    };
  }, []);

  const loginHandler = async (credentials) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const response = await login(credentials);
      setAuthState({
        username: credentials.username,
        loading: false,
        error: null
      });
      localStorage.setItem('username', credentials.username);
      setupRefreshTimer();
      reactNavigate('/');
      toast.success('Login successful');
    } catch (err) {
      handleAuthError(err);
    }
  };

  const registerHandler = async (credentials) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const response = await register(credentials);
      setAuthState({
        username: credentials.username,
        loading: false,
        error: null
      });
      localStorage.setItem('username', credentials.username);
      setupRefreshTimer();
      reactNavigate('/');
      toast.success('Registration successful');
    } catch (err) {
      handleAuthError(err);
    }
  };

  const logoutHandler = async (showSuccessMessage = true) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      if (showSuccessMessage) {
        await logout();
      }
      
      if (tokenRefreshTimer) {
        clearTimeout(tokenRefreshTimer);
        setTokenRefreshTimer(null);
      }
      setAuthState({
        username: null,
        loading: false,
        error: null
      });
      localStorage.removeItem('username');
      if (showSuccessMessage) {
        toast.success("Logout successful");
      }
      reactNavigate('/');
    } catch (err) {
      console.error(err);
      // Even if server logout fails, clear local state
      setAuthState({
        username: null,
        loading: false,
        error: null
      });
      localStorage.removeItem('username');
      reactNavigate('/');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      authState, 
      loginHandler, 
      registerHandler, 
      logoutHandler,
      refreshToken: refreshTokenHandler 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };