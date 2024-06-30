// src/App.js

import React from "react";
import {
  Route,
  Routes,
  BrowserRouter as Router,
} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/Home/Home";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import RoomPage from "./pages/RoomPage/RoomPage";
import NavBar from "./components/NavBar/NavBar";
import Auth from "./components/ProtectedRoutes/Auth";
import CreateRoom from './pages/CreateRoom/CreateRoom';
import { AuthProvider } from "./contexts/AuthContext";
import { compileString } from "sass";

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/createRoom" element={<Auth compo={CreateRoom}  />} />

          <Route path="/editor/:roomId" element={<RoomPage />} />
          
        </Routes>
      </AuthProvider>
      <ToastContainer
         position="top-right"
         autoClose={5000}
         hideProgressBar={false}
         newestOnTop={false}
         closeOnClick
         rtl={false}
         pauseOnFocusLoss
         draggable
         pauseOnHover
         theme="light"
      />
    </Router>
  );
}

export default App;
