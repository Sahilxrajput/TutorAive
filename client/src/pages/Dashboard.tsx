// src/pages/Dashboard.tsx
import React from "react";
import useAuth from "../hooks/useAuth";
import { Button } from "@/components/ui/button";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome {user?.firstName}</h1>
      <img src={user?.profilePicture} alt="avatar" width={80} />
      <div>
        <Button onClick={() => logout()}>Logout</Button>
      </div>
    </div>
  );
};

export default Dashboard;
