import useAuth from "@/hooks/useAuth";
import type { ILecture } from "@/types/type";
import { CalendarRangeIcon, Radio } from "lucide-react";
import { formatDateTime } from "@/utils/splitDateTime";
import { LectureDropdownMenu } from "./LectureDropdownMenu";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";


const statusStyles: Record<
    ILecture["status"],
    { border: string; badge?: string }
> = {
    scheduled: {
        border: "border-blue-400 shadow-blue-100 bg-blue-50",
        badge: "bg-blue-500",
    },
    rescheduled: {
        border: "border-amber-400 shadow-amber-100 bg-amber-50",
        badge: "bg-amber-500",
    },
    live: {
        border: "border-red-500 bg-red-50 shadow-red-100 animate-pulse",
        badge: "bg-red-600",
    },
    delayed: {
        border: "border-orange-400 bg-orange-50 shadow-orange-100 border-dashed",
        badge: "bg-orange-500",
    },
    completed: {
        border: "border-gray-300 dark:border-zinc-700 shadow-gray-100 opacity-70",
    },
    cancelled: {
        border: "border-gray-400 opacity-60 shadow-gray-100",
    },
};

const LectureCard = ({ lecture }: { lecture: ILecture }) => {
    const { isInstructor } = useAuth();
    const style = statusStyles[lecture.status];
    const navigate = useNavigate();


    const onOpen = () => {
        navigate(`/classrooms/${lecture.classroom._id}/lecture/live/${lecture._id}`);
    }

    return (
        <div
            className={cn(
                "p-2 rounded-lg flex flex-col overflow-clip items-center justify-center shadow-sm hover:shadow-lg hover:scale-105 relative transition-all duration-200 ease-in-out group bg-white dark:bg-zinc-900 cursor-pointer border-2",
                style.border,
                lecture.status === "cancelled" && "line-through"
            )}
        >
            {/* STATUS BADGE */}
            {style.badge && (
                <div
                    className={cn(
                        "absolute top-2 left-2 z-20 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-white",
                        style.badge
                    )}
                >
                    {lecture.status === "live" && (
                        <Radio size={10} className="animate-pulse" />
                    )}
                    {lecture.status.toUpperCase()}
                </div>
            )}

            {/* Instructor menu */}
            {isInstructor && (
                <div className="absolute top-2 right-2 z-20">
                    <LectureDropdownMenu cn={style.border} lecture={lecture} />
                </div>
            )}

            {/* Title */}
            <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 text-center">
                {lecture.title}
            </h2>

            {/* Classroom */}
            <h3 className="font-light text-sm pb-2 text-muted-foreground">
                {lecture.classroom?.title || "No classroom"}
            </h3>

            {/* Time */}
            <p className="text-sm flex items-center text-gray-600 dark:text-gray-400">
                <CalendarRangeIcon className="w-4 h-4 mr-1" />
                {formatDateTime(lecture.newStartTime ?? lecture.startTime)}
            </p>

            {/* Join button ONLY when live */}
            {lecture.status === "live" && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpen();
                    }}
                    className="mt-3 rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition"
                >
                    Join Live
                </button>
            )}
        </div>
    );
};

export default LectureCard;
