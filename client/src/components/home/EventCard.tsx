// import useAuth from "@/hooks/useAuth";
// import type { ILecture } from "@/types/type";
// import { CalendarRangeIcon } from "lucide-react";
// import { formatDateTime } from "@/utils/splitDateTime";
// import { EventDropdownMenu } from "./EventDropdownMenu";
// import { useEffect, useMemo } from "react";
// import { cn } from "@/lib/utils";


// interface EventCardProps {
//     event: ILecture;
//     onOpen?: (id: string) => void;
//     onDelete?: (id: string) => void;
//     onEdit?: (id: string) => void;
// }


// const EventCard = ({ event, onOpen }: EventCardProps) => {
//     const { isInstructor } = useAuth();
//     const startTime = new Date(event.newStartTime ?? event.startTime).getTime();
//     const now = Date.now();

//     const isLive = useMemo(() => now > startTime, [now, startTime]);


//     return (
//         <div
//             onClick={() => onOpen?.(event._id)}
//             className={cn("p-2 border rounded-lg flex flex-col items-center justify-center shadow-sm hover:shadow-lg relative transition-transform hover:scale-105 duration-200 ease-in-out group bg-white dark:bg-zinc-900", !isLive && "border-2 border-green-400")}
//         >
//             {/* Title */}
//             <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
//                 {event.title}
//             </h2>

//             {/* Classroom */}
//             <h3 className="font-light text-sm pb-2 text-muted-foreground">
//                 {event.classroom?.title || "No classroom"}
//             </h3>
//             <p className="text-sm flex text-gray-600 dark:text-gray-400">
//                 <CalendarRangeIcon className="w-4 h-4" /> &nbsp; {formatDateTime(event.newStartTime ?? event.startTime)}
//             </p>


//             {isInstructor &&
//                 <div className="absolute top-2 right-2 z-20">
//                     <EventDropdownMenu event ={event}/>
//                 </div>
//             }

//             {isLive && (
//                 <button
//                     onClick={(e) => {
//                         e.stopPropagation(); // stop card click
//                         onOpen?.(event._id);
//                     }}
//                     className="mt-3 rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition"
//                 >
//                     Join Live
//                 </button>
//             )}

//         </div>
//     );
// };

// export default EventCard;

import useAuth from "@/hooks/useAuth";
import type { ILecture } from "@/types/type";
import { CalendarRangeIcon, Radio } from "lucide-react";
import { formatDateTime } from "@/utils/splitDateTime";
import { EventDropdownMenu } from "./EventDropdownMenu";
import { cn } from "@/lib/utils";

interface EventCardProps {
    event: ILecture;
    onOpen?: (id: string) => void;
}

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

const EventCard = ({ event, onOpen }: EventCardProps) => {
    const { isInstructor } = useAuth();
    const style = statusStyles[event.status];

    return (
        <div
            onClick={() => onOpen?.(event._id)}
            className={cn(
                "p-2 rounded-lg flex flex-col items-center justify-center shadow-sm hover:shadow-lg hover:scale-105 relative transition-all duration-200 ease-in-out group bg-white dark:bg-zinc-900 cursor-pointer border-2",
                style.border,
                event.status === "cancelled" && "line-through"
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
                    {event.status === "live" && (
                        <Radio size={10} className="animate-pulse" />
                    )}
                    {event.status.toUpperCase()}
                </div>
            )}

            {/* Instructor menu */}
            {isInstructor && (
                <div className="absolute top-2 right-2 z-20">
                    <EventDropdownMenu event={event} />
                </div>
            )}

            {/* Title */}
            <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 text-center">
                {event.title}
            </h2>

            {/* Classroom */}
            <h3 className="font-light text-sm pb-2 text-muted-foreground">
                {event.classroom?.title || "No classroom"}
            </h3>

            {/* Time */}
            <p className="text-sm flex items-center text-gray-600 dark:text-gray-400">
                <CalendarRangeIcon className="w-4 h-4 mr-1" />
                {formatDateTime(event.newStartTime ?? event.startTime)}
            </p>

            {/* Join button ONLY when live */}
            {event.status === "live" && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpen?.(event._id);
                    }}
                    className="mt-3 rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition"
                >
                    Join Live
                </button>
            )}
        </div>
    );
};

export default EventCard;
