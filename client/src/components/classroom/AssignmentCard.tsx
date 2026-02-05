import { forwardRef } from "react";
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils";
import { Calendar, CheckCircle2, ExternalLink, Orbit, ShieldCheck } from "lucide-react";
import { IAssignment } from "@/types/type";
import { PdfUploadDialog } from "../PdfUpload";

type AssignmentCardProps = {
    item: IAssignment;
    isPending: boolean;
    onUploadComplete: (id: string) => void;
};

const AssignmentCard = forwardRef<HTMLDivElement, AssignmentCardProps>(
    ({ item, isPending, onUploadComplete }, ref) => {
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
                    isPending ? "hover:border-yellow-500/40" : "hover:border-emerald-500/40 border-emerald-500/10"
                )}
            >
                <div className={cn(
                    "absolute -right-10 -top-10 w-32 h-32 blur-[60px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity",
                    isPending ? "bg-yellow-500" : "bg-emerald-500"
                )} />

                <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-start">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors",
                            isPending ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                        )}>
                            {isPending ? <Orbit size={24} className="animate-spin-slow" /> : <ShieldCheck size={24} />}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className={cn(
                                "text-[8px] font-bold font-oswald uppercase tracking-[0.2em] px-3 py-1 rounded-full border",
                                isPending ? "bg-yellow-500/5 text-yellow-500 border-yellow-500/20" : "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                            )}>
                                {isPending ? "Active Directive" : "Archive Secure"}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xl font-bold font-cinzel tracking-tight text-foreground group-hover:text-primary transition-colors uppercase leading-tight">
                            {item.title}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 opacity-60">
                            <div className="flex items-center gap-1.5 text-[9px] font-bold font-oswald uppercase tracking-widest">
                                <Calendar size={12} className="text-primary" /> Due: {new Date(item.dueDate).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {!isPending && (
                        <div className="grid grid-cols-2 gap-3 py-4 border-y border-border/40 dark:border-white/5">
                            <div>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Score Metric</p>
                                <p className="text-lg font-bold font-cinzel text-primary">{item.maxPoints || "---"}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Obtained</p>
                                <p className="text-lg font-bold font-cinzel text-emerald-500">{item.maxPoints || "---"}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex gap-3 relative z-10">
                    {isPending ? (
                        <PdfUploadDialog
                            onComplete={(id) => onUploadComplete(id)}
                            buttonText="Initialize Upload"
                            type="submission"
                            title="Authorize Submission"
                            id={item._id}
                        />
                    ) : (
                        <button className="flex-1 py-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-oswald text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                            <CheckCircle2 size={12} /> Transmission Verified
                        </button>
                    )}

                    <button className="px-5 py-3 rounded-xl bg-muted/50 hover:bg-primary hover:text-white transition-all font-oswald text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                        <ExternalLink size={12} /> Intel
                    </button>
                </div>
            </motion.div>
        );
    });

export default AssignmentCard;