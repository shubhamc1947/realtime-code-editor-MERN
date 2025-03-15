// src/components/Login/Login.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './Login.scss';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

const loginSchema = yup.object({
  username: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
});

const Login = () => {
  const { authState, loginHandler } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});

  const validateForm = async () => {
    try {
      await loginSchema.validate(credentials, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach(error => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      loginHandler(credentials);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        
        {authState.error && (
          <div className="error-message global-error">{authState.error}</div>
        )}
        
        <div className="form-group">
          <input
            type="email"
            name="username"
            placeholder="Email"
            value={credentials.username}
            onChange={handleChange}
            className={errors.username ? 'error' : ''}
            autoComplete="username"
            disabled={authState.loading}
          />
          {errors.username && <div className="error-message">{errors.username}</div>}
        </div>
        
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            autoComplete="current-password"
            disabled={authState.loading}
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>
        
        <button type="submit" disabled={authState.loading}>
          {authState.loading ? 'Logging in...' : 'Login'}
        </button>
        
        <p>Don't have an account? <Link to="/register">Create One</Link></p>
      </form>
    </div>
  );
};

export default Login;