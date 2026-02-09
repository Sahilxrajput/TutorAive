import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import ClassroomOverview from "@/components/classroom/ClassroomOverview";
import ClassroomProvider from "@/context/classroomProvider";
import { IClassroom } from "@/types/type";

const ClassroomPage = () => {
    const { classroomId } = useParams();
    const [classroom, setClassroom] = useState<IClassroom | null>(null);

    useEffect(() => {
        const fetchClassroom = async () => {
            const { data } = await API.get(`/classrooms/${classroomId}`);
            setClassroom(data);
        };
        fetchClassroom();
    }, [classroomId]);

    if (!classroom) return null;

    return (
        <ClassroomProvider classroom={classroom}>
            <ClassroomOverview />
        </ClassroomProvider>
    );
};

export default ClassroomPage;
