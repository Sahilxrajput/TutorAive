// src/routes/EnrolledRoute.tsx
import useAuth from "@/hooks/useAuth";
import type { ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";

interface EnrolledRouteProps {
  children: ReactNode;
}

const EnrolledRoute = ({ children }: EnrolledRouteProps) => {
  const { id } = useParams(); // classroom id from URL
  const { user, loading } = useAuth();

  //  Check if user exists and is enrolled
  async function getEnrolled() {
    return await user?.enrolledClassrooms?.includes(id || "");
  }

  const isEnrolled = getEnrolled()

  // loading
  if (loading) return <div>Loading...</div>;

  // User not logged in
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (!isEnrolled) {
    // User logged in but not enrolled
    return (
      <div className="flex items-center justify-center h-screen bg-yellow-50 text-red-600 text-lg font-semibold">
        Unauthorized Access: You are not enrolled in this classroom.
      </div>
    );
  }

  // User is enrolled → render classroom content
  return <>{children}</>;
};

export default EnrolledRoute;
