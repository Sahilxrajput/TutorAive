import { Outlet } from "react-router-dom";
import ClassroomSideBar from "./ClassroomSideBar";
import { useFullscreen } from "@/hooks/useFullscreen";

const ClassroomLayout = () => {
    const { isFullScreen } = useFullscreen();
    return (
        <div className="flex h-screen overflow-hidden">

            {/* Classroom-specific sidebar */}
            {!isFullScreen && <ClassroomSideBar />}

            {/* Main classroom content */}
            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default ClassroomLayout;
