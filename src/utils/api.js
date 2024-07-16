// src/utils/api.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

axios.defaults.withCredentials = true;

export const login = async (credentials) => {
  console.log("login here is happneing testing text")
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
