import { ClassroomContext } from "@/context/classroomContext";
import {  useContext } from "react";

export const useClassroom = () => {
    const ctx = useContext(ClassroomContext);
    if (!ctx) {
        throw new Error("useClassroom must be used inside ClassroomProvider");
    }
    return ctx;
};
