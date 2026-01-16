import { useMemo } from "react";
import type { ILecture } from "@/types/type";
import EventCard from "./EventCard";

interface Props {
    events: ILecture[];
    selectedDate: Date | null; // comes from calendar click
    onOpen: (id: string) => void;
}

const EventList = ({ events, selectedDate, onOpen }: Props) => {
    const filteredEvents = useMemo(() => {
        if (!selectedDate) return events;

        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        return events.filter((event) => {
            const lectureTime = new Date(
                event.newStartTime ?? event.startTime
            ).getTime();

            return (
                lectureTime >= startOfDay.getTime() &&
                lectureTime < endOfDay.getTime()
            );
        });
    }, [events, selectedDate]);

    if (filteredEvents.length === 0) {
        return (
            <p className="text-center text-muted-foreground mt-6">
                No lectures on this day
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1  gap-4">
            {filteredEvents.map((event) => (
                <EventCard key={event._id} event={event} onOpen={onOpen} />
            ))}
        </div>
    );
};

export default EventList;
