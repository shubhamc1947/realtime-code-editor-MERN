// src/components/NavBar/NavBar.js

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import "./NavBar.scss";

const NavBar = () => {
  const { authState, logoutHandler } = useContext(AuthContext);
  console.log(authState);
  return (
    <nav className="navbar">
      <Link to="/"><h1>CollabCode<span>.</span></h1></Link>
      {authState.username ? (
        <>
          <button onClick={logoutHandler}>Logout</button>
        </>
      ) : (
        <>
          <span>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </span>
        </>
      )}
    </nav>
  );
};

export default NavBar;
