import React, { createContext, useCallback, useEffect, useState } from "react";
import API from "../lib/api";
import type { AuthContextValue, IUser } from "../types/type";
import defaultAvatar from "@/assets/image/avatar.png";
import { toast } from "sonner";
import axios from "axios";


const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isInstructor, setIsinstructor] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const refreshUser = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/auth/refresh");
            // console.log("refrsh data", data)
            setAccessToken(data.accessToken)
            localStorage.setItem("accessToken", data.accessToken)

            const { data: profile } = await API.get("/users/me")
            // console.log("me: ", profile)
            setIsinstructor(profile.role === "instructor")

            const updatedUser = {
                ...profile,
                profilePicture: profile?.profilePicture || defaultAvatar,
            };

            setUser(updatedUser ?? null);

        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 401 || status === 403) {
                    setUser(null); // refresh token invalid → real logout
                }
            } else {
                console.error("Unknown error", err);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const signout = useCallback(async () => {
        try {
            const { data } = await API.get("/auth/signout");
            console.dir(data, { depth: null });
            setAccessToken(null)
            setUser(null);
            toast.success(data.message)
            localStorage.removeItem("accessToken")

        } catch (err) {
            setAccessToken(null)
            console.error("Logout failed", err);
        }
    }, []);

    const signin = useCallback(async (credentials: { email: string; password: string }) => {
        try {
            setLoading(true);
            const { data } = await API.post("/auth/signin", credentials); // backend should authenticate and set cookie
            console.log("login res: ", data)
            setAccessToken(data.accessToken)
            localStorage.setItem("accessToken", data.accessToken)
            toast.success(data.message)

            setIsinstructor(data.user.role === "instructor")

            const updatedUser = {
                ...data.user,
                profilePicture: data?.profilePicture || defaultAvatar,
            };

            setUser(updatedUser ?? null);

        } catch (err: any) {
            console.error("Login failed", err.response.data.message);
            toast.error(err.response.data.message ?? "login failed");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    return (
        <AuthContext.Provider value={{ user, isInstructor, loading, refreshUser, accessToken, setAccessToken, setUser, signout, signin }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
