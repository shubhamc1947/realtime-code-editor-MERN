// src/utils/api.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

axios.defaults.withCredentials = true;

export const login = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
  console.log(response.data)
  return response.data;
};

export const register = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/register`, credentials);
  return response.data;
};

export const logout = async () => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/logout`);
  return response.data;
};
