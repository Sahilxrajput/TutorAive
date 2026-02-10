import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    Terminal as TerminalIcon,
    Zap,
    UserCheck,
    Globe,
    Cpu,
    Target,
    ArrowRight,
    Loader2,
} from "lucide-react";
import API from "@/lib/api";
import { IClassroom } from "@/types/type";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { notifyError } from "@/utils/notifyError";

const JoinSector = () => {
    const [status, setStatus] = useState<"decrypting" | "ready" | "syncing" | "complete">("decrypting");
    const [classroom, setClassroom] = useState<IClassroom | null>(null);
    const { classroomId, inviteCode } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const initBriefing = async () => {
            try {
                const classRes = await API.get(`/classrooms/${classroomId}`);
                setClassroom(classRes.data);
                setStatus("ready");
            } catch (e) {
                notifyError(e);
                navigate("/home");
            }
        };
        initBriefing();
    }, [classroomId, navigate]);

    const handleSync = async () => {
        try {
            setStatus("syncing");
            const { data } = await API.get(`/classrooms/${classroomId}/join/${inviteCode}`);

            setStatus("complete");
            toast.success(data.message);

            setTimeout(() => {
                navigate("/home");
            }, 2000);

        } catch (e) {
            setStatus("ready");
            console.error(e);
            notifyError(e);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030303] text-slate-900 dark:text-foreground flex items-center justify-center font-inter relative p-4 sm:p-6 transition-colors duration-500 overflow-x-hidden">

            {/* Background Architecture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#e2e8f0,transparent)] dark:bg-[radial-gradient(circle_at_50%_-20%,#1a1a1a,transparent)] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[800px] h-[300px] sm:h-[800px] bg-primary/10 dark:bg-primary/[0.03] blur-[80px] sm:blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-2xl relative z-10">
                <AnimatePresence mode="wait">
                    {status === "decrypting" ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-6 py-20"
                        >
                            <Loader2 size={40} className="text-primary animate-spin" />
                            <div className="text-center space-y-2">
                                <p className="text-[10px] font-bold font-oswald uppercase tracking-[0.5em] text-primary animate-pulse">Decrypting Coordinates...</p>
                                <p className="text-[8px] font-mono text-slate-400 dark:text-muted-foreground opacity-60">LOCATING TARGET SECTOR IN FRONTIER MESH</p>
                            </div>
                        </motion.div>
                    ) : status === "complete" ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-card/40 backdrop-blur-3xl border border-emerald-500/20 rounded-[2.5rem] p-8 sm:p-12 text-center space-y-8 shadow-xl dark:shadow-[0_0_50px_rgba(16,185,129,0.05)]"
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto border border-emerald-500/20 shadow-inner">
                                <ShieldCheck size={40} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl sm:text-3xl font-bold font-cinzel uppercase text-slate-900 dark:text-foreground leading-tight">Node Synchronized.</h2>
                                <p className="text-xs text-slate-500 dark:text-muted-foreground font-inter">Your identity has been authorized for Sector: <span className="text-emerald-500 font-bold">{classroom?.title}</span></p>
                            </div>
                            <button
                                onClick={() => navigate("/home")}
                                className="w-full py-4 rounded-xl bg-emerald-600 text-white font-oswald text-xs font-bold uppercase tracking-[0.3em] shadow-lg shadow-emerald-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Enter Sector Workspace
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="briefing"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-card/30 backdrop-blur-3xl border border-slate-200 dark:border-white/5 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden"
                        >
                            <div className="p-8 sm:p-12 md:p-14 space-y-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Target size={14} className="animate-pulse" />
                                        <span className="text-[10px] font-bold font-oswald uppercase tracking-[0.4em]">Mission Briefing</span>
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-bold font-cinzel text-slate-900 dark:text-foreground leading-tight uppercase">
                                        {classroom?.title}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-4 opacity-70">
                                        <div className="flex items-center gap-2 text-[9px] font-bold font-oswald uppercase tracking-widest text-slate-600 dark:text-muted-foreground">
                                            <UserCheck size={14} className="text-primary" /> Instructor: {classroom?.teacher?.userName}
                                        </div>
                                        <div className="hidden sm:block w-1 h-1 bg-slate-300 dark:bg-white/10 rounded-full" />
                                        <div className="flex items-center gap-2 text-[9px] font-bold font-oswald uppercase tracking-widest text-slate-600 dark:text-muted-foreground">
                                            <Globe size={14} className="text-primary" /> Global Node
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-1 group hover:border-primary/20 transition-all">
                                        <p className="text-[8px] font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-widest">Knowledge Modules</p>
                                        <p className="text-2xl font-bold font-cinzel text-slate-900 dark:text-foreground group-hover:text-primary transition-colors leading-none">{classroom?.modules}</p>
                                    </div>
                                    <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-1 group hover:border-primary/20 transition-all">
                                        <p className="text-[8px] font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-widest">Active Students</p>
                                        <p className="text-2xl font-bold font-cinzel text-slate-900 dark:text-foreground group-hover:text-primary transition-colors leading-none">{classroom?.students?.length}</p>
                                    </div>
                                    <div className="sm:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                                        <p className="text-[8px] font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-widest mb-2">Sector Description</p>
                                        <p className="text-xs text-slate-600 dark:text-muted-foreground font-inter leading-relaxed italic opacity-90">
                                            "{classroom?.description}"
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-4">
                                    <div className="flex items-center gap-3 px-5 py-3 sm:px-6 sm:py-3 rounded-2xl bg-primary/5 border border-primary/10">
                                        <ShieldCheck size={16} className="text-primary flex-shrink-0" />
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold font-oswald uppercase tracking-widest text-primary">Identity Verified</span>
                                            <span className="text-[8px] text-slate-400 dark:text-muted-foreground uppercase">Authorization Level: Student</span>
                                        </div>
                                    </div>

                                    <button
                                        disabled={status === "syncing"}
                                        onClick={handleSync}
                                        className="group relative w-full py-4 sm:py-5 rounded-2xl bg-primary text-white font-oswald text-[11px] font-bold uppercase tracking-[0.4em] overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-3">
                                            {status === "syncing" ? (
                                                <>SYNCHRONIZING... <Zap size={14} className="animate-spin-slow" /></>
                                            ) : (
                                                <>Initialize Sector Link <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-white/[0.02] border-t border-slate-200 dark:border-white/5 p-6 flex flex-col sm:flex-row justify-between items-center px-8 sm:px-10 gap-4 sm:gap-0 opacity-40">
                                <div className="flex gap-6">
                                    <div className="flex items-center gap-2"><TerminalIcon size={12} /> <span className="text-[8px] font-bold font-oswald tracking-widest uppercase">AES-256</span></div>
                                    <div className="flex items-center gap-2"><Cpu size={12} /> <span className="text-[8px] font-bold font-oswald tracking-widest uppercase">P2P Mesh</span></div>
                                </div>
                                <span className="text-[8px] font-bold font-oswald uppercase tracking-widest">BHU Node Sync v4.2</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {status === "complete" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center opacity-40 hover:opacity-100 transition-opacity"
                    >
                        <p className="text-[10px] text-slate-500 dark:text-muted-foreground uppercase tracking-widest font-bold">
                            Incorrect coordinates?
                            <button
                                onClick={() => navigate(-1)}
                                className="ml-2 text-primary hover:text-slate-900 dark:hover:text-white transition-colors underline underline-offset-4 decoration-primary/20"
                            >
                                Abort Authorization
                            </button>
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default JoinSector;