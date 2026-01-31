import type { ILecture } from "@/types/type";
import LectureCard from "./LectureCard";
import { motion } from 'framer-motion'
interface Props {
    lectures: ILecture[];
}

const CANCELLED_VISIBLE_MS = 30 * 60 * 1000 // 30 minutes

const shouldShowLecture = (lecture: ILecture) => {
    const now = Date.now()

    switch (lecture.status) {
        case "live":
            return true

        case "completed":
            return false

        case "cancelled": {
            const cancelledAt = new Date(lecture.updatedAt!).getTime()
            return now - cancelledAt <= CANCELLED_VISIBLE_MS
        }

        case "delayed":
        case "scheduled":
        case "rescheduled":
            return true

        default:
            return false
    }
}

const LectureList = ({ lectures }: Props) => {
    const visibleLectures = lectures
        .filter(shouldShowLecture)
        .sort((a, b) => {
            // LIVE always on top
            if (a.status === "live") return -1
            if (b.status === "live") return 1

            return (
                new Date(a.startTime).getTime() -
                new Date(b.startTime).getTime()
            )
        })

    if (visibleLectures.length === 0) {
        return (
            <p className="text-center text-muted-foreground mt-6">
                No lectures on this day
            </p>
        )
    }

    return (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 overflow-y-scroll h-[80vh] gap-4">
            {visibleLectures.map((lecture, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 + (i * 0.1) }}
                >
                    <LectureCard
                        key={lecture._id}
                        lecture={lecture}
                    />
                </motion.div>
            ))}
        </div>
    )
}


export default LectureList;
