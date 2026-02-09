import { IClassroom } from "@/types/type";
import { createContext } from "react";

interface ClassroomContextType {
    classroom: IClassroom;
    isClassInstructor: boolean;
}

export const ClassroomContext = createContext<ClassroomContextType | null>(null);
