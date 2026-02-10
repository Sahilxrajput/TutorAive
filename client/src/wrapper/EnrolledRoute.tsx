import ClassroomProvider from "@/context/classroomProvider";
import useAuth from "@/hooks/useAuth";
import API from "@/lib/api";
import { IClassroom } from "@/types/type";
import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";


const EnrolledRoute = ({ children }: { children: ReactNode }) => {
    const [classroom, setClassroom] = useState<IClassroom | null>(null);
    const { classroomId } = useParams<{ classroomId: string }>();
    const { user, loading } = useAuth();

    useEffect(() => {
        const fetchClassroom = async () => {
            const { data } = await API.get(`/classrooms/${classroomId}`);
            setClassroom(data);
        };

        if (user && classroomId) {
            fetchClassroom();
        }
    }, [classroomId, user]);

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    if (!classroom) {
        return <div>Loading classroom...</div>;
    }

    const isEnrolled = classroom.students?.some(
        (id: string) => id.toString() === user._id.toString()
    );

    const teacherId = classroom.teacher._id

    const isClassInstructor = teacherId?.toString() === user._id.toString();

    if (!isEnrolled && !isClassInstructor) {
        toast.info("you are not enrolled")
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <ClassroomProvider classroom={classroom} isClassInstructor={isClassInstructor}>
            {children}
        </ClassroomProvider>
    );
};

export default EnrolledRoute;