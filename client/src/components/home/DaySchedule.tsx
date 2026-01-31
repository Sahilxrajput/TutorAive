import { useCallback, useEffect, useState } from "react"
import LectureList from "./LectureList"
import useSocketContext from '@/hooks/useSocketContext';
import type { ILecture } from "@/types/type"
import useAuth from "@/hooks/useAuth";
import { Skeleton } from "../ui/skeleton";
import API from "@/lib/api";


const DaySchedule = () => {
    const [lectures, setLectures] = useState<ILecture[]>([])
    const [loading, setLoading] = useState(true);
    const { socket } = useSocketContext();
    const { isInstructor } = useAuth();

    const detectPath = useCallback(
        function detectPath() {
            if (isInstructor) return "/lectures/scheduled/created"
            return "/lectures/scheduled/my"
        }, [isInstructor])

    useEffect(() => {
        const fetchScheduleLectures = async () => {
            try {
                setLoading(true);
                const { data } = await API.get(detectPath());
                setLectures(data.data);
            } catch (error) {
                console.error('Error fetching lectures:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchScheduleLectures();
    }, [detectPath]);

    useEffect(() => {
        if (!socket) return;

        const onLectureUpdate = (payload: ILecture) => {
            setLectures(prev => {
                const idx = prev.findIndex(l => l._id === payload._id);

                // ---- UPDATE EXISTING LECTURE ----
                if (idx !== -1) {
                    const updated = [...prev];

                    updated[idx] = {
                        ...updated[idx],
                        status: payload.status,
                        title: payload.title ?? updated[idx].title,
                        newStartTime: payload.startTime ?? updated[idx].newStartTime,
                        updatedAt: new Date(),
                    };

                    return updated;
                }

                return [payload, ...prev];
            });
        };

        socket.on("lecture:update", onLectureUpdate);

        return () => {
            socket.off("lecture:update", onLectureUpdate);
        };
    }, [socket]);


    if (loading)
        return (
            Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className="p-3 border rounded-md shadow-sm space-y-2"
                >
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            )))

    return (
        lectures.length > 0 ? (
            <LectureList
                lectures={lectures}
            />
        ) : (
            <p className="text-gray-500 text-center">
                No lecture Update
            </p>
        )
    )

}

export default DaySchedule
