import { useCallback, useEffect, useState } from "react"
import LectureList from "./LectureList"
import LectureCardSkeleton from "./LectureCardSkelton";
import useSocketContext from '@/hooks/useSocketContext';
import type { ILecture } from "@/types/type"
import useAuth from "@/hooks/useAuth";
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
            Array.from({ length: 2 }).map((_, i) => (
                <LectureCardSkeleton key={i} />
            )))

    return (
        <LectureList
            lectures={lectures}
        />
    )

}

export default DaySchedule
