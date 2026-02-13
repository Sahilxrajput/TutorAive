import LiveStudentPage from "@/pages/LiveStudentPage";
import LiveTeacherPage from "@/pages/LiveTeacherPage";
import { useParams, Navigate, useOutletContext } from "react-router-dom";

const LiveSession = () => {
    const { lectureId } = useParams<{ lectureId: string }>();
    const { isClassInstructor } = useOutletContext<{
        isClassInstructor: boolean;
    }>();

    
    if (!lectureId) {
        return <Navigate to="/404" replace />;
    }

    if (isClassInstructor) {
        return <LiveTeacherPage />;
    } else {
        return <LiveStudentPage />;
    }
};

export default LiveSession;
