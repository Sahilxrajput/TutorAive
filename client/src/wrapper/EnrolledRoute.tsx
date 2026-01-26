import useAuth from "@/hooks/useAuth";
import { type ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";


const EnrolledRoute = ({ children }: {
    children: ReactNode;
}) => {
    const { classroomId } = useParams<{ classroomId: string }>(); // classroom id from URL
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // @todo handle public classrooom case
    const isEnrolled = user?.enrolledClassrooms?.includes(classroomId || "");

    if (!isEnrolled) {
        return (
            <div className="flex items-center justify-center h-screen bg-yellow-50 text-red-600 text-lg font-semibold">
                Unauthorized Access: You are not enrolled in this classroom.
            </div>
        );
    }

    return <>{children}</>;
};

export default EnrolledRoute;
