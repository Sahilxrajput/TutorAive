import { Outlet } from "react-router-dom";
import ClassroomSideBar from "./ClassroomSideBar";

const ClassroomLayout = () => {
  return (
      <div className="flex h-screen overflow-hidden">

      {/* Classroom-specific sidebar */}
      <ClassroomSideBar />

      {/* Main classroom content */}
      <main  className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default ClassroomLayout;
