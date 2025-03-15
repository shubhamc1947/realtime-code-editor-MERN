// src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, logout, refreshToken, getUser } from '../utils/api';
import Cookies from 'js-cookie';
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
    // Clear any existing timer
    if (tokenRefreshTimer) {
      clearTimeout(tokenRefreshTimer);
    }
    
    // Set timer to refresh token 1 minute before it expires (14 minutes after setting)
    const timer = setTimeout(refreshTokenHandler, 14 * 60 * 1000);
    setTokenRefreshTimer(timer);
  };

  // Function to refresh the token
  const refreshTokenHandler = async () => {
    try {
      await refreshToken();
      // If successful, set up another timer
      setupRefreshTimer();
    } catch (err) {
      console.error('Token refresh failed:', err);
      // If refresh fails, log the user out
      logoutHandler();
    }
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
          // Set up refresh timer
          setupRefreshTimer();
        } catch (err) {
          // Handle token expiration
          if (err.response?.data?.tokenExpired) {
            try {
              await refreshToken();
              const userData = await getUser();
              setAuthState({
                username: userData.user.username,
                loading: false,
                error: null
              });
              setupRefreshTimer();
            } catch (refreshErr) {
              // If refresh fails, clear auth state
              setAuthState({
                username: null,
                loading: false,
                error: 'Authentication failed'
              });
              localStorage.removeItem('username');
            }
          } else {
            // Other errors
            setAuthState({
              username: null,
              loading: false,
              error: 'Authentication failed'
            });
            localStorage.removeItem('username');
          }
        }
      }
    };

    verifyAuth();
    
    // Cleanup function to clear timer
    return () => {
      if (tokenRefreshTimer) {
        clearTimeout(tokenRefreshTimer);
      }
    };
  }, []);

  const loginHandler = async (credentials) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const response = await login(credentials);
      if (response.msg === 'Login successful') {
        setAuthState({
          username: credentials.username,
          loading: false,
          error: null
        });
        localStorage.setItem('username', credentials.username);
        // Set up refresh timer
        setupRefreshTimer();
        reactNavigate('/');
        toast.success('😍 Login successful');
      }
    } catch (err) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.msg || 'Login failed'
      }));
      console.error(err.message);
      toast.error('Login failed: ' + (err.response?.data?.msg || 'Server error'));
    }
  };

  const registerHandler = async (credentials) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const response = await register(credentials);
      if (response.msg === 'Registration successful') {
        setAuthState({
          username: credentials.username,
          loading: false,
          error: null
        });
        localStorage.setItem('username', credentials.username);
        // Set up refresh timer
        setupRefreshTimer();
        reactNavigate('/');
        toast.success('😎 Registration successful');
      }
    } catch (err) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.msg || 'Registration failed'
      }));
      console.error(err.message);
      toast.error('Registration failed: ' + (err.response?.data?.msg || 'Server error'));
    }
  };

  const logoutHandler = async () => {
    try {
      await logout();
      // Clear timer
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
      toast.success("😊 Logout Successfully");
      reactNavigate('/');
    } catch (err) {
      console.error(err.message);
      toast.error('Logout failed: ' + (err.response?.data?.msg || 'Server error'));
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