// src/contexts/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register , logout} from '../utils/api';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { findDOMNode } from 'react-dom';
const AuthContext = createContext();
export const useAuth=()=>useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [loading,setLoading]=useState(false);
  const [authState, setAuthState] = useState({
    username: localStorage.getItem('username'),
  });
  const reactNavigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      // Fetch user data if token exists
      // Implement fetch user logic here
    }
  }, []);

  const loginHandler = async (credentials) => {
    setLoading(true);
    try {
      // console.log(credentials);
      const response = await login(credentials);
      if (response.msg === 'Login successful') {
        setAuthState({ username: credentials.username });
        localStorage.setItem('username', credentials.username);
        reactNavigate('/');
        toast.success('😍 Login successful');
      }
    } catch (err) {
      console.error(err.message);
      toast.error('Login failed: ' + (err.response?.data?.msg || 'Server error'));
    } finally {
      setLoading(false);
    }
  };

  const registerHandler = async (credentials) => {
    setLoading(true)
    try {
      const response = await register(credentials);
      if (response.msg === 'Registration successful') {
        setAuthState({ username: credentials.username });
        localStorage.setItem('username', credentials.username);
        reactNavigate('/');
        toast.success('😎 Registration successful');
      }
    } catch (err) {
      console.error(err.message);
      toast.error('Registration failed: ' + (err.response?.data?.msg || 'Server error'))
    } finally {
      setLoading(false)
    }
  };

  const logoutHandler = async () => {
    setLoading(true);
    try {
      await logout(); // Call logout API
      setAuthState({ username: null });
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      toast.success("😊 Logout Successfully")
      reactNavigate('/');
    } catch (err) { 
      console.error(err.message);
      toast.error('Logout failed: ' + err.response?.data?.msg || 'Server error')
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ authState, loginHandler, registerHandler, logoutHandler,loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
