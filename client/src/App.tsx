// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AuthSuccess from "./pages/AuthSuccess";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatRoom from "./pages/ChatRoom";
import Home from "./pages/Home";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/signup";





const App: React.FC = () => {
  return (

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auth/success" element={<AuthSuccess />} />
      <Route path="/chat" element={<ChatRoom />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
