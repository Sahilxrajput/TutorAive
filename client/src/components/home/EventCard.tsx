import useAuth from "@/hooks/useAuth";
import type { ILecture } from "@/types/type";
import { CalendarRangeIcon, Pencil, Trash } from "lucide-react";
import { AlertConfirmDialog } from "../AlertConfirmDialog";
import { formatDateTime } from "@/utils/splitDateTime";
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { EventDropdownMenu } from "./EventDropdownMenu";


interface EventCardProps {
    event: ILecture;
    onOpen?: (id: string) => void;
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
}


const EventCard = ({ event, onOpen }: EventCardProps) => {
    const { isInstructor } = useAuth();


    return (
        <div
            onClick={() => onOpen?.(event._id)}
            className="p-2 border rounded-lg flex flex-col items-center justify-center shadow-sm hover:shadow-lg relative transition-transform hover:scale-105 duration-200 ease-in-out group bg-white dark:bg-zinc-900"
        >
            {/* Title */}
            <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                {event.title}
            </h2>

            {/* Classroom */}
            <h3 className="font-light text-sm pb-2 text-muted-foreground">
                {event.classroom?.title || "No classroom"}
            </h3>

            {/* Date & Time */}
            {/* <div className="flex px-2 w-full items-center justify-between text-sm text-gray-600 dark:text-gray-400"> */}
            <p className="text-sm flex text-gray-600 dark:text-gray-400">
                <CalendarRangeIcon className="w-4 h-4" /> &nbsp; {formatDateTime(event.newStartTime ?? event.startTime)}
            </p>
            {/* <p className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {event.timeStr}
                </p> */}
            {/* </div> */}
            {/* <div className="flex px-2 w-full items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <p className="flex items-center gap-1">
                    <CalendarRangeIcon className="w-4 h-4" /> {event.dateStr}
                </p>
                <p className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {event.timeStr}
                </p>
            </div> */}

            {isInstructor &&
                <div className="absolute top-2 right-2 z-20">
                    <EventDropdownMenu eventId={event._id} />
                </div>
            }
        </div>
    );
};

export default EventCard;
