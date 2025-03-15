import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Error handling helper
const handleApiError = (error) => {
  let errorMessage = 'An unexpected error occurred';
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    errorMessage = error.response.data?.error?.message || 
                  error.response.data?.msg || 
                  `Error ${error.response.status}: ${error.response.statusText}`;
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'No response from server. Please check your internet connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    errorMessage = error.message;
  }
  
  console.error('API Error:', errorMessage);
  return Promise.reject({
    message: errorMessage,
    originalError: error
  });
};

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to an expired token and we haven't already tried to refresh
    if (error.response?.status === 401 && 
        error.response?.data?.error?.message === 'Access token expired' && 
        !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        await refreshToken();
        // If successful, retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return handleApiError(error);
  }
);

export const login = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const register = async (credentials) => {
  try {
    const response = await api.post('/api/auth/register', credentials);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const refreshToken = async () => {
  try {
    const response = await api.post('/api/auth/refresh');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUser = async () => {
  try {
    const response = await api.get('/api/auth/user');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export default api;