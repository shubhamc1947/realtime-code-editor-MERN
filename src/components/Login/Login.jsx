// src/components/Login/Login.js

import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './Login.scss';
import { Link } from 'react-router-dom';

const Login = () => {
  const { loginHandler,loading } = useContext(AuthContext);
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
        <h2>Login ...</h2>
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
        <button type="submit" disabled={loading} style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
          {loading ? <div className="loaderwrap" >
            <div className='loader'>
            </div>
          </div> : 'Login'}

        </button>
        <p>Don't have any account? <Link to="/register">Create One</Link></p>
      </form>
    </div>
  );
};

export default Login;
