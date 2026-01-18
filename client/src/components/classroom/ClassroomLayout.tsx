import { Outlet, useMatch } from "react-router-dom";
import ClassroomSideBar from "./ClassroomSideBar";
import { useFullscreen } from "@/hooks/useFullscreen";

const ClassroomLayout = () => {
    const { isFullScreen } = useFullscreen();
    const isLiveLecture = useMatch(
        "/classrooms/:classroomId/lecture/live/:lectureId"
    );
    
    return (
        <div className="flex h-screen overflow-hidden">

            {/* Classroom-specific sidebar */}
            {!isFullScreen && !isLiveLecture && <ClassroomSideBar />}

            {/* Main classroom content */}
            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default ClassroomLayout;
