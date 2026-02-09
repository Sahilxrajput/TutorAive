import useAuth from "@/hooks/useAuth";
import { ClassroomContext } from "./classroomContext";
import { IClassroom } from "@/types/type";
import { ReactNode } from "react";

export default function ClassroomProvider({ classroom, children }: { classroom: IClassroom, children: ReactNode }) {
    const { user } = useAuth();

    const isClassInstructor =
        classroom.teacher._id === user?._id;

    return (
        <ClassroomContext.Provider
            value={{ classroom, isClassInstructor }}
        >
            {children}
        </ClassroomContext.Provider>
    );
}
