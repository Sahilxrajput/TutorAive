import { ClassroomContext } from "./classroomContext";
import { IClassroom } from "@/types/type";
import { ReactNode } from "react";
interface Props {
    classroom: IClassroom,
    isClassInstructor: boolean,
    children: ReactNode
}

export default function ClassroomProvider({ classroom, children, isClassInstructor }: Props) {

    return (
        <ClassroomContext.Provider
            value={{ classroom, isClassInstructor }}
        >
            {children}
        </ClassroomContext.Provider>
    );
}
