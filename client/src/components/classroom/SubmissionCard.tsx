import { forwardRef } from "react";
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils";
import { ExternalLink, FileText, Orbit, ShieldCheck } from "lucide-react";
import { ISubmission } from "@/types/type";

type SubmissionCardProps = {
    item: ISubmission;
};

const SubmissionCard = forwardRef<HTMLDivElement, SubmissionCardProps>(
    ({ item }, ref) => {
        const isGraded = item.status === "graded";

        return (
            <motion.div
                ref={ref}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className={cn(
                    "group relative flex flex-col justify-between p-7 rounded-[2.5rem] border transition-all duration-500 overflow-hidden",
                    "bg-card/60 dark:bg-neutral-900/40 backdrop-blur-xl border-border dark:border-white/5 shadow-xl",
                    !isGraded ? "hover:border-yellow-500/40" : "hover:border-emerald-500/40 border-emerald-500/10"
                )}
            >
                {/* Glow Effect */}
                <div className={cn(
                    "absolute -right-10 -top-10 w-32 h-32 blur-[60px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity",
                    !isGraded ? "bg-yellow-500" : "bg-emerald-500"
                )} />

                <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-start">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors",
                            !isGraded ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                        )}>
                            {!isGraded ? <Orbit size={24} className="animate-spin-slow" /> : <ShieldCheck size={24} />}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className={cn(
                                "text-[8px] font-bold font-oswald uppercase tracking-[0.2em] px-3 py-1 rounded-full border",
                                !isGraded ? "bg-yellow-500/5 text-yellow-500 border-yellow-500/20" : "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                            )}>
                                {!isGraded ? "Awaiting Review" : "Mission Deciphered"}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xl font-bold font-cinzel tracking-tight text-foreground group-hover:text-primary transition-colors uppercase leading-tight">
                            {item.assignment.title}
                        </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-4 border-y border-border/40 dark:border-white/5">
                        <div>
                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Max Intel</p>
                            <p className="text-lg font-bold font-cinzel text-primary">{item.assignment.maxPoints || "---"}</p>
                        </div>
                        <div>
                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Score</p>
                            <p className="text-lg font-bold font-cinzel text-emerald-500">{item.marks ?? "---"}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 relative z-10">
                    {/* Assignment File Link */}
                    <a
                        href={item.assignment.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/brief flex flex-col items-center justify-center py-4 px-2 rounded-2xl bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/30 transition-all duration-300"
                    >
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover/brief:scale-110 transition-transform">
                            <FileText size={18} />
                        </div>
                        <span className="mt-2 text-[8px] font-bold font-oswald text-muted-foreground uppercase tracking-[0.2em]">Assignment</span>
                    </a>

                    {/* User Submission Link */}
                    <a
                        href={item.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/intel flex flex-col items-center justify-center py-4 px-2 rounded-2xl bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300"
                    >
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover/intel:scale-110 transition-transform">
                            <ExternalLink size={18} />
                        </div>
                        <span className="mt-2 text-[8px] font-bold font-oswald text-muted-foreground uppercase tracking-[0.2em]">Submission</span>
                    </a>
                </div>
            </motion.div>
        );
    }
);

export default SubmissionCard;