import React, { createContext, useCallback, useEffect, useState } from "react";
import API from "../lib/api";
import type { AuthContextValue, IUser } from "../types/type";
import defaultAvatar from "@/assets/image/avatar.png";
import { toast } from "sonner";
import axios from "axios";


const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isInstructor, setIsInstructor] = useState(false);
    const [loading, setLoading] = useState(true);


    const refreshUser = useCallback(async () => {
        try {
            setLoading(true);
            const { data: { user, accessToken } } = await API.get("/auth/refresh");
            localStorage.setItem("accessToken", accessToken)

            setIsInstructor(user.role === "instructor")

            const updatedUser = {
                ...user,
                profilePicture: user?.profilePicture || defaultAvatar,
                lastName: user?.lastName ?? "TutorAive",
                userName: user?.userName ?? "TutorAive User",
            };

            setUser(updatedUser);

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
            // setAuthResolved(true);
            setLoading(false);
        }
    }, []);

    const signout = useCallback(async () => {
        try {
            const { data } = await API.get("/auth/signout");
            setUser(null);
            setIsInstructor(false);
            toast.success(data.message)
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            localStorage.removeItem("accessToken")
        }
    }, []);

    const signin = useCallback(async (credentials: { email: string; password: string }) => {
        try {
            setLoading(true);
            const { data } = await API.post("/auth/signin", credentials);
            localStorage.setItem("accessToken", data.accessToken)
            toast.success(data.message)

            setIsInstructor(data.user.role === "instructor")

            const updatedUser = {
                ...data.user,
                profilePicture: data?.user?.profilePicture || defaultAvatar,
            };

            setUser(updatedUser ?? null);
            
        } catch (err) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message ?? "Login failed");
            } else {
                toast.error("Unexpected error");
            }
            setUser(null);
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    return (
        <AuthContext.Provider value={{ user, isInstructor, loading, refreshUser, setUser, signout, signin }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
