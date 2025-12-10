import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { DateTimePicker } from "./DateTimePicker";
import { PdfUploadDialog } from "../PdfUpload";

const ClassroomSideBar = () => {
  const [isHide, setIsHide] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const { user } = useAuth()

  const pathDetector = (item: string) => {
    item = item.toLowerCase()
    if (item == "overview") {
      return ""
    }
    return "/" + item;
  }

  const classContent = ["Overview", "Resources", "Notes", "Assignments", "Leaderboard"]

  const { classroomId } = useParams();

  return (
    <div
      className={`relative flex flex-col border-r-2 h-screen transition-all duration-300 
      ${isHide ? "w-0" : "w-64"}`}
    >
      <button
        onClick={() => setIsHide(!isHide)}
        className={`absolute border-2 bg-white z-40 p-1 rounded-full -right-3 top-4 
        transition-transform duration-300 ${isHide && "rotate-180"}`}
      >
        <ChevronLeft />
      </button>

      <div className="flex flex-col items-start mt-12 space-y-1">
        <h2
          className={`text-lg p-4 font-semibold -mt-6 transition-all duration-200 ${isHide ? "opacity-0 w-0" : "opacity-100 w-full"
            }`}
        >
          Classroom
        </h2>

        {classContent.map(
          (item) => (
            <Link
              to={'/classrooms/' + classroomId + pathDetector(item)}
              key={item}
              className={`hover:bg-blue-400 text-left p-4 w-full transition-all duration-200 ease-in-out ${isHide ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
            >
              {item}
            </Link>
          )
        )}
        <div>
          <div>
        {/* @todo only creator of that classroom can create assignment */}
            {user?.role === "instructor" &&
              <div className="flex justify-center items-center flex-col space-y-2">
                <Button
                  onClick={() => setShowPopup(true)}
                  className={`hover:bg-blue-400 text-left p-4 w-full transition-all duration-200 ease-in-out ${isHide ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                >
                  schedule Class
                </Button>
                <PdfUploadDialog buttonText=" Create Assignment" title="Create Assignment" id={classroomId!} type="assignment" />
              </div>
            }

          </div>
        </div>
      </div>

      <DateTimePicker showPopup={showPopup} setShowPopup={setShowPopup} />

    </div>
  );
};

export default ClassroomSideBar;
