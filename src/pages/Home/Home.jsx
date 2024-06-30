// src/pages/Home/Home.js
import { Link } from 'react-router-dom';
import React from 'react';
import './Home.scss';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to the Real-Time Code Editor</h1>
      <h2>Hello Uncle</h2>
      <h3><Link to={'/createRoom'}>Create New Room</Link></h3>
    </div>
  );
};

export default Home;
