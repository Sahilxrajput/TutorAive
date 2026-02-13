import SectorLoading from "@/components/Loading";
import useAuth from "@/hooks/useAuth";
import API from "@/lib/api";
import { IClassroom, IUser } from "@/types/type";
import { notifyError } from "@/utils/notifyError";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const EnrolledRoute = () => {
    const [classroom, setClassroom] = useState<IClassroom | null>(null);
    const [classroomLoading, setClassroomLoading] = useState(true);

    const { classroomId } = useParams<{ classroomId: string }>();
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClassroom = async () => {
            try {
                const { data } = await API.get(`/classrooms/${classroomId}`);
                setClassroom(data);
            } catch (e) {
                notifyError(e);
                navigate("/classrooms");
            } finally {
                setClassroomLoading(false);
            }
        };

        if (user && classroomId) {
            fetchClassroom();
        }
    }, [classroomId, user, navigate]);

    // Wait for auth or classroom fetch
    if (loading || classroomLoading) {
        return <SectorLoading />;
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    if (!classroom || !classroom.teacher) {
        return <SectorLoading />;
    }

    const isEnrolled = classroom.students?.some(
        (student: IUser) =>
            student._id.toString() === user._id.toString()
    );

    const isClassInstructor =
        classroom.teacher._id.toString() === user._id.toString();

    if (!isEnrolled && !isClassInstructor) {
        toast.info("You are not enrolled");
        return <Navigate to="/home" replace />;
    }

    return (
        <Outlet context={{ classroom, isClassInstructor }} />
    );
};

export default EnrolledRoute;
