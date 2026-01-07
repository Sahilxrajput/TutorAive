import React, { createContext, useCallback, useEffect, useState } from "react";
import API, { setAccessToken } from "../lib/api";
import type { AuthContextValue, IUser } from "../types/type";
import defaultAvatar from "@/assets/image/avatar.png";
import { toast } from "sonner";


const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isInstructor, setIsinstructor] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await API.post("/auth/refresh");
            console.log("refrsh data", data)
            setAccessToken(data.accessToken)

            const { data: profile } = await API.get("/users/me")
            console.log("me: ", profile)
            setIsinstructor(profile.role === "instructor")

            const updatedUser = {
                ...profile,
                profilePicture: profile?.profilePicture || defaultAvatar,
            };

            setUser(updatedUser ?? null);

        } catch (err) {
            console.error("Failed to refresh user", err);
            setUser(null);
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
        <AuthContext.Provider value={{ user, isInstructor, loading, refreshUser, signout, signin }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
