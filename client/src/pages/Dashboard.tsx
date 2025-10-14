// src/pages/Dashboard.tsx
import React from "react";
import useAuth from "../hooks/useAuth";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome {user?.firstName}</h1>
      <img src={user?.profilePicture} alt="avatar" width={80} />
      <div>
        <button onClick={() => logout()}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
