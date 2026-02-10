import { motion } from "framer-motion";
import { IClassroom } from "@/types/type";
import { BookOpen, ChevronRight, Clock, LayoutGrid, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    course: IClassroom,
    isEnrolled: boolean,
    index: number,
    onClick: () => void
}

const SectorCard = ({ course, isEnrolled, index, onClick }: Props) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05, ease: "easeOut" }}
            whileHover={{ y: -10 }}
            onClick={onClick}
            className={cn(
                "group relative flex flex-col justify-between p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer overflow-hidden",
                "bg-card/60 dark:bg-neutral-900/40 backdrop-blur-xl border-border dark:border-white/5",
                "hover:border-primary/40 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_30px_60px_-15px_rgba(var(--primary-rgb),0.1)]",
                isEnrolled && "border-primary/30 bg-primary/[0.02]"
            )}
        >
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div>
                <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                        <BookOpen size={24} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        {isEnrolled ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-bold font-oswald uppercase tracking-widest">
                                <ShieldCheck size={10} /> Synchronized
                            </div>
                        ) : course.paid ? (
                            <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-bold font-oswald uppercase tracking-widest">
                                Premium Sector
                            </div>
                        ) : (
                            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold font-oswald uppercase tracking-widest">
                                Open Frontier
                            </div>
                        )}
                    </div>
                </div>

                <h3 className="text-2xl font-bold font-cinzel tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight mb-4">
                    {course.title}
                </h3>

                <p className="text-xs text-muted-foreground font-inter leading-relaxed line-clamp-2 opacity-80 mb-8">
                    {course.description}
                </p>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-6 py-4 border-y border-border/40 dark:border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-bold font-oswald uppercase tracking-widest text-muted-foreground/70">
                        <LayoutGrid size={14} className="text-primary" /> {course.modules} Modules
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold font-oswald uppercase tracking-widest text-muted-foreground/70">
                        <Clock size={14} className="text-primary" /> {course.hours} Hours
                    </div>
                </div>

                <button className={cn(
                    "w-full py-4 rounded-xl font-oswald font-bold uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2",
                    isEnrolled
                        ? "bg-muted hover:bg-primary hover:text-white text-muted-foreground"
                        : "bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02]"
                )}>
                    {isEnrolled ? (
                        <>ENTER SECTOR <ChevronRight size={14} /></>
                    ) : (
                        <>INITIALIZE ACCESS <Zap size={14} fill="currentColor" /></>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default SectorCard