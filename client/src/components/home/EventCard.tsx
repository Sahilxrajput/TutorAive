import useAuth from "@/hooks/useAuth";
import type { ILecture } from "@/types/type";
import { CalendarRangeIcon, Clock, Pencil, Trash } from "lucide-react";
import { AlertConfirmDialog } from "../AlertConfirmDialog";


interface EventCardProps {
    event: ILecture;
    onOpen?: (id: string) => void;
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
}


const EventCard = ({ event, onOpen, onDelete, onEdit }: EventCardProps) => {
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
            <h3 className="font-thin text-sm pb-2 text-muted-foreground">
                {event.classroom?.title || "No classroom"}
            </h3>

            {/* Date & Time */}
            <div className="flex px-2 w-full items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <p className="flex items-center gap-1">
                    <CalendarRangeIcon className="w-4 h-4" /> {event.dateStr}
                </p>
                <p className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {event.timeStr}
                </p>
            </div>

            {/* Delete Button (visible on hover) */}
            {isInstructor &&
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(event._id);
                        }}
                        className="text-gray-500 hover:text-gray-600"
                    >
                        <Pencil size={16} />
                    </button>
                    <AlertConfirmDialog
                        Icon={Trash}
                        title="Cancle this lecture?"
                        description="This action cannot be undone. The lecture will be permanently removed."
                        confirmText="Delete"
                        cancelText="Cancel"
                        onConfirm={() => onDelete?.(event._id)}
                    />
                </div>
            }
        </div>
    );
};

export default EventCard;
