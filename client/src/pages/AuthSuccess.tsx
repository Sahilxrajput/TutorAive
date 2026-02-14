import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AuthSuccess: React.FC = () => {
    const { refreshUser } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()


    useEffect(() => {
        (async () => {
            const accessToken = searchParams.get("accessToken")
            if (!accessToken) return;
            localStorage.setItem("accessToken", accessToken)
            
            // small delay ensures cookie is stored
            await new Promise((r) => setTimeout(r, 100));

            await refreshUser();
            navigate("/dashboard");
        })();
    }, [refreshUser, searchParams, navigate]);

    return <div>Logging you in…</div>;
};

export default AuthSuccess;
