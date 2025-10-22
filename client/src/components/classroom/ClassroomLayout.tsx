import { Outlet } from "react-router-dom";
import ClassroomSideBar from "./ClassroomSideBar";

const ClassroomLayout = () => {
  return (
    <div className="flex h-screen">

      {/* Classroom-specific sidebar */}
      <ClassroomSideBar />

      {/* Main classroom content */}
      <div className="flex-1 bg-yellow-800 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ClassroomLayout;
