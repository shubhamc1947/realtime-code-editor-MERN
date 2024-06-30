// src/components/NavBar/NavBar.js

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './NavBar.scss';

const NavBar = () => {
  const { authState, logoutHandler } = useContext(AuthContext);
console.log(authState)
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      {authState.username ? (
        <>
          <button onClick={logoutHandler}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;