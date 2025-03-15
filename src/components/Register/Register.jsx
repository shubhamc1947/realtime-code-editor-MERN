// src/components/Register/Register.js

import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './Register.scss';
import { Link } from 'react-router-dom';

const Register = () => {
  const { registerHandler,loading } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ username: '', password: '', confirmPassword: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSubmit =async (e) => {
    e.preventDefault();
    if (credentials.password !== credentials.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    await registerHandler(credentials);
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <h2>Register ...</h2>
        <input
          type="email"
          name="username"
          placeholder="Email"
          value={credentials.email}
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
          autoComplete="new-password"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={credentials.confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
         <button type="submit" disabled={loading} style={{ opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? <div className="loaderwrap" >
            <div className='loader'>
            </div>
          </div> : 'Register'}

        </button>
        <p>Already have any account? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  );
};

export default Register;
