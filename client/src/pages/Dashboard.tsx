// src/pages/Dashboard.tsx
import React from "react";
import useAuth from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import avatar from "@/assets/image/boy.png"

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome {user?.firstName}</h1>
      <img src={user?.profilePicture || avatar} alt="avatar" width={80} />
      <div>
        <Button onClick={() => logout()}>Logout</Button>
      </div>
    </div>
  );
};

export default Dashboard;
