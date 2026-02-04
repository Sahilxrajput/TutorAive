import { motion, AnimatePresence } from 'framer-motion'
import type { ILecture } from "@/types/type";
import LectureCard from "./LectureCard";

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
            const cancelledAt = new Date(lecture.updatedAt || lecture.startTime).getTime()
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
            // Priority 1: LIVE lectures always at the top
            if (a.status === "live" && b.status !== "live") return -1
            if (b.status === "live" && a.status !== "live") return 1

            // Priority 2: Sort by start time (Earliest first)
            return (
                new Date(a.startTime).getTime() -
                new Date(b.startTime).getTime()
            )
        })

    if (visibleLectures.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 px-6 text-center"
            >
                <div className="w-16 h-16 rounded-3xl bg-muted/30 flex items-center justify-center mb-4 border border-border/50">
                    <span className="text-2xl text-muted-foreground/50">∅</span>
                </div>
                <p className="text-[11px] font-bold font-oswald text-muted-foreground uppercase tracking-[0.3em]">
                    The Frontier is quiet. <br /> No lectures scheduled.
                </p>
            </motion.div>
        )
    }

    return (
        <div className="flex flex-col gap-6 overflow-y-auto pr-2 h-full max-h-[82vh] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20 transition-all">
            <AnimatePresence mode="popLayout">
                {visibleLectures.map((lecture, i) => (
                    <motion.div
                        key={lecture._id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                            duration: 0.4,
                            delay: i * 0.05,
                            ease: [0.23, 1, 0.32, 1]
                        }}
                    >
                        <LectureCard lecture={lecture} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}

export default LectureList;