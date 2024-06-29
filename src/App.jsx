import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Editor from "./pages/Editor/Editor";
import Auth from "./components/ProtectedRoutes/Auth";
import NotFound from "./pages/NotFound/NotFound";
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth compo={Home} />} />
          <Route path="/editor/:roomId" element={<Auth compo={Editor} />} />
          <Route path="/login" element={<Auth compo={Login} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            theme: {
              primary: "#4aed88",
            },
          },
        }}
      ></Toaster>
    </>
  );
};

export default App;
