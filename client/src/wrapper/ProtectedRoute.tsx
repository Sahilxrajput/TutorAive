// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import SectorLoading from "@/components/Loading";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return  <SectorLoading/>;
  
  if (!user) return <Navigate to="/auth" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
