// src/pages/AuthSuccess.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AuthSuccess: React.FC = () => {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // Backend already set the HTTP-only cookie. Refresh user to fetch profile.
      await refreshUser();
      // navigate wherever you want after login
      navigate("/dashboard");
    })();
  }, [refreshUser, navigate]);

  return <div>Logging you in…</div>;
};

export default AuthSuccess;
