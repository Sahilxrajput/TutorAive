// src/pages/Dashboard.tsx
import React from "react";
import useAuth from "../hooks/useAuth";
import { Button } from "@/components/ui/button";

const Dashboard: React.FC = () => {
  const { user, signout } = useAuth();

  return (
    <div>
      <h1>Welcome {user?.firstName}</h1>
      <h1>Email {user?.email}</h1>
      <h1>Welcome {user?.role}</h1>
      <h1>Username {user?.userName}</h1>
      <img src={user?.profilePicture} alt="avatar" width={80} />
      <div>
        <Button onClick={() => signout()}>Logout</Button>
      </div>
    </div>
  );
};

export default Dashboard;
