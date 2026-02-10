import SectorLoading from "@/components/Loading";
import ClassroomProvider from "@/context/classroomProvider";
import useAuth from "@/hooks/useAuth";
import API from "@/lib/api";
import { IClassroom, IUser } from "@/types/type";
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

    if (loading)
        return <SectorLoading />;


    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    if (!classroom)
        return <SectorLoading />;

    const isEnrolled = classroom.students?.some(
        (student: IUser) => student._id.toString() === user._id.toString()
    );

    console.log("classroom")
    console.log(classroom)

    const teacherId = classroom.teacher._id

    const isClassInstructor = teacherId?.toString() === user._id.toString();

    if (!isEnrolled && !isClassInstructor) {
        toast.info("you are not enrolled")
        // <Navigate to="/dashboard" replace />;
        return <div>hii</div>
    }

    return (
        <ClassroomProvider classroom={classroom} isClassInstructor={isClassInstructor}>
            {children}
        </ClassroomProvider>
    );
};

export default EnrolledRoute;