// import useAuth from "@/hooks/useAuth";
// import type { ILecture } from "@/types/type";
// import { CalendarRangeIcon, Radio } from "lucide-react";
// import { formatDateTime } from "@/utils/splitDateTime";
// import { LectureDropdownMenu } from "./LectureDropdownMenu";
// import { cn } from "@/lib/utils";
// import { useNavigate } from "react-router-dom";


// const statusStyles: Record<
//     ILecture["status"],
//     { border: string; badge?: string }
// > = {
//     scheduled: {
//         border: "border-blue-400 shadow-blue-100 bg-blue-50",
//         badge: "bg-blue-500",
//     },
//     rescheduled: {
//         border: "border-amber-400 shadow-amber-100 bg-amber-50",
//         badge: "bg-amber-500",
//     },
//     live: {
//         border: "border-red-500 bg-red-50 shadow-red-100 animate-pulse",
//         badge: "bg-red-600",
//     },
//     delayed: {
//         border: "border-orange-400 bg-orange-50 shadow-orange-100 border-dashed",
//         badge: "bg-orange-500",
//     },
//     completed: {
//         border: "border-gray-300 dark:border-zinc-700 shadow-gray-100 opacity-70",
//     },
//     cancelled: {
//         border: "border-gray-400 opacity-60 shadow-gray-100",
//     },
// };

// const LectureCard = ({ lecture }: { lecture: ILecture }) => {
//     const { isInstructor } = useAuth();
//     const style = statusStyles[lecture.status];
//     const navigate = useNavigate();


//     const onOpen = () => {
//         navigate(`/classrooms/${lecture.classroom._id}/lecture/live/${lecture._id}`);
//     }

//     return (
//         <div
//             className={cn(
//                 "p-2 rounded-lg flex flex-col overflow-clip items-center justify-center shadow-sm hover:shadow-lg hover:scale-105 relative transition-all duration-200 ease-in-out group bg-white dark:bg-zinc-900 cursor-pointer border-2",
//                 style.border,
//                 lecture.status === "cancelled" && "line-through"
//             )}
//         >
//             {/* STATUS BADGE */}
//             {style.badge && (
//                 <div
//                     className={cn(
//                         "absolute top-2 left-2 z-20 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-white",
//                         style.badge
//                     )}
//                 >
//                     {lecture.status === "live" && (
//                         <Radio size={10} className="animate-pulse" />
//                     )}
//                     {lecture.status.toUpperCase()}
//                 </div>
//             )}

//             {/* Instructor menu */}
//             {isInstructor && (
//                 <div className="absolute top-2 right-2 z-20">
//                     <LectureDropdownMenu cn={style.border} lecture={lecture} />
//                 </div>
//             )}

//             {/* Title */}
//             <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 text-center">
//                 {lecture.title}
//             </h2>

//             {/* Classroom */}
//             <h3 className="font-light text-sm pb-2 text-muted-foreground">
//                 {lecture.classroom?.title || "No classroom"}
//             </h3>

//             {/* Time */}
//             <p className="text-sm flex items-center text-gray-600 dark:text-gray-400">
//                 <CalendarRangeIcon className="w-4 h-4 mr-1" />
//                 {formatDateTime(lecture.newStartTime ?? lecture.startTime)}
//             </p>

//             {/* Join button ONLY when live */}
//             {lecture.status === "live" && (
//                 <button
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         onOpen();
//                     }}
//                     className="mt-3 rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition"
//                 >
//                     Join Live
//                 </button>
//             )}
//         </div>
//     );
// };

// export default LectureCard;


import useAuth from "@/hooks/useAuth";
import type { ILecture } from "@/types/type";
import { CalendarRangeIcon, Radio } from "lucide-react";
import { formatDateTime } from "@/utils/splitDateTime";
import { LectureDropdownMenu } from "./LectureDropdownMenu";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const statusStyles: Record<
    ILecture["status"],
    { badge?: string; text?: string }
> = {
    scheduled: {
        badge: "text-indigo-400",
        text: "Scheduled",
    },
    rescheduled: {
        badge: "text-amber-400",
        text: "Rescheduled",
    },
    live: {
        badge: "text-red-500",
        text: "Live",
    },
    delayed: {
        badge: "text-orange-400",
        text: "Delayed",
    },
    completed: {
        badge: "text-neutral-500",
        text: "Completed",
    },
    cancelled: {
        badge: "text-neutral-600",
        text: "Cancelled",
    },
};

const LectureCard = ({ lecture }: { lecture: ILecture }) => {
    const { isInstructor } = useAuth();
    const navigate = useNavigate();
    const style = statusStyles[lecture.status];

    const onOpen = () => {
        navigate(
            `/classrooms/${lecture.classroom._id}/lecture/live/${lecture._id}`
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "p-5 rounded-2xl bg-neutral-900/40 border border-white/5 backdrop-blur-md hover:border-indigo-500/30 transition-all cursor-pointer group relative",
                lecture.status === "cancelled" && "opacity-60 line-through"
            )}
        >
            {/* STATUS + MENU */}
            <div className="flex justify-between items-start mb-2">
                <span
                    className={cn(
                        "text-[9px] font-bold uppercase tracking-widest",
                        style.badge
                    )}
                >
                    {lecture.status === "live" && (
                        <Radio size={10} className="inline mr-1 animate-pulse" />
                    )}
                    {style.text}
                </span>

                {isInstructor && (
                    <LectureDropdownMenu cn="text-white" lecture={lecture} />
                )}
            </div>

            {/* TITLE */}
            <h4 className="text-white font-bold text-sm mb-3 group-hover:text-indigo-400 transition-colors uppercase tracking-wide">
                {lecture.title}
            </h4>

            {/* CLASSROOM */}
            <p className="text-[10px] text-neutral-500 mb-3">
                {lecture.classroom?.title || "No classroom"}
            </p>

            {/* TIME */}
            <p className="text-[10px] flex items-center text-neutral-500">
                <CalendarRangeIcon className="w-3 h-3 mr-1" />
                {formatDateTime(lecture.newStartTime ?? lecture.startTime)}
            </p>

            {/* JOIN BUTTON */}
            {lecture.status === "live" && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpen();
                    }}
                    className="mt-4 w-full rounded-lg bg-red-600/90 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-red-600 transition"
                >
                    Join Live
                </button>
            )}
        </motion.div>
    );
};

export default LectureCard;
