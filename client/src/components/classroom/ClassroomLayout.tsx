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
            {/* Sidebar */}
            {!isFullScreen && !isLiveLecture && (
                <aside className="w-64 shrink-0">
                    <ClassroomSideBar />
                </aside>
            )}

            {/* Scroll container */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default ClassroomLayout;
