import { motion } from "framer-motion";
import { CalendarRangeIcon, Radio, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import type { ILecture } from "@/types/type";
import { formatDateTime } from "@/utils/splitDateTime";
import { LectureDropdownMenu } from "./LectureDropdownMenu";
import { cn } from "@/lib/utils";

const statusStyles: Record<
    ILecture["status"],
    { badge: string; text: string; glow: string }
> = {
    scheduled: {
        badge: "text-primary bg-primary/10 border-primary/20",
        text: "Scheduled",
        glow: "group-hover:shadow-primary/5",
    },
    rescheduled: {
        badge: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        text: "Rescheduled",
        glow: "group-hover:shadow-amber-500/5",
    },
    live: {
        badge: "text-red-500 bg-red-500/10 border-red-500/20",
        text: "Live Now",
        glow: "shadow-red-500/20 group-hover:shadow-red-500/30",
    },
    delayed: {
        badge: "text-orange-500 bg-orange-500/10 border-orange-500/20",
        text: "Delayed",
        glow: "group-hover:shadow-orange-500/5",
    },
    completed: {
        badge: "text-muted-foreground bg-muted border-border",
        text: "Completed",
        glow: "opacity-70",
    },
    cancelled: {
        badge: "text-muted-foreground bg-muted border-border",
        text: "Cancelled",
        glow: "opacity-50 grayscale",
    },
};

const LectureCard = ({ lecture }: { lecture: ILecture }) => {
    const { isInstructor } = useAuth();
    const navigate = useNavigate();
    const style = statusStyles[lecture.status];

    const onOpen = () => {
        navigate(`/classrooms/${lecture.classroom._id}/lecture/live/${lecture._id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            onClick={lecture.status !== "cancelled" ? onOpen : undefined}
            className={cn(
                "group relative p-6 rounded-[2rem] transition-all duration-500 cursor-pointer overflow-hidden",
                "bg-card/60 dark:bg-neutral-900/40 backdrop-blur-xl border border-border dark:border-white/5 shadow-2xl ",
                style.glow,
                lecture.status === "cancelled" && "line-through cursor-not-allowed"
            )}
        >
            {/* Background Glow for Live sessions */}
            {lecture.status === "live" && (
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full pointer-events-none" />
            )}

            {/* STATUS HEADER */}
            <div className="flex justify-between items-center mb-6">
                <div className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-[0.15em] font-oswald",
                    style.badge
                )}>
                    {lecture.status === "live" && (
                        <Radio size={10} className="animate-pulse" />
                    )}
                    {style.text}
                </div>

                {isInstructor && (
                    <div onClick={(e) => e.stopPropagation()} className="relative z-20">
                        <LectureDropdownMenu lecture={lecture} />
                    </div>
                )}
            </div>

            {/* MAIN CONTENT */}
            <div className="space-y-4">
                <div>
                    <h4 className="text-foreground dark:text-white font-bold text-lg leading-tight font-cinzel tracking-tight group-hover:text-primary transition-colors">
                        {lecture.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-1 font-oswald uppercase tracking-wider font-medium">
                        {lecture.classroom?.title || "Standalone Session"}
                    </p>
                </div>

                <div className="flex items-center gap-4 py-2 border-y border-border/40 dark:border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground font-oswald uppercase tracking-widest">
                        <CalendarRangeIcon size={14} className="text-primary" />
                        {formatDateTime(lecture.newStartTime ?? lecture.startTime)}
                    </div>
                </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="mt-6 flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                    View Details
                </span>

                {lecture.status === "live" ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpen();
                        }}
                        className="bg-red-600 text-white px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:scale-105 transition-all shadow-lg shadow-red-500/20"
                    >
                        Join Live
                    </button>
                ) : (
                    <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <ArrowRight size={16} />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default LectureCard;