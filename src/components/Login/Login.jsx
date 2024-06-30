// src/components/Login/Login.js

import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './Login.scss';

const Login = () => {
  const { loginHandler } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ username: '', password: '' });


  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginHandler(credentials);
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          name="username"
          placeholder="Email"
          value={credentials.username}
          onChange={handleChange}
          required
          autoComplete="username"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
