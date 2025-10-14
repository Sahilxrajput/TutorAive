// src/components/LoginButton.tsx
import React from "react";

const LoginButton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return <button onClick={handleLogin}>Sign in with Google</button>;
};

export default LoginButton;
