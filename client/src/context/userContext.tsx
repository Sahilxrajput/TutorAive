import React, { createContext, useCallback, useEffect, useState } from "react";
import API from "../api";
import type { AuthContextValue, IUser } from "../types/auth";


const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/profile/me");
      setUser(res.data ?? null);
    } catch (err) {
      console.error("Failed to refresh user", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const leg = await API.get("/auth/logout");
      console.log("log : "+ leg)
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      const res = await API.post("/login", credentials); // backend should authenticate and set cookie
      setUser(res.data.user ?? null);
    } catch (err) {
      console.error("Login failed", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
