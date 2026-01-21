import useAuth from "@/hooks/useAuth";
import LiveStudentPage from "@/pages/LiveStudentPage";
import LiveTeacherPage from "@/pages/LiveTeacherPage";
import { useParams, Navigate } from "react-router-dom";

const LiveSession = () => {
    const { classroomId, lectureId } = useParams<{ classroomId: string, lectureId: string }>();
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!classroomId || !lectureId) {
        return <Navigate to="/404" replace />;
    }

    // ROLE-BASED CHECK
    if (user.role === "instructor") {
        return <LiveTeacherPage />; // LiveTeacherPage
    }

    if (user.role === "student") {
        return <LiveStudentPage />;
    }

    // fallback for weird roles which I forgot to handle
    return <Navigate to="/403" replace />;
};

export default LiveSession;
