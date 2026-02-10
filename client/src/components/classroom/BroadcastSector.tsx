import { Activity, ArrowRight, PlayCircle, Radio } from "lucide-react";
import SectorHeader from "./SectorHeader";
import { motion } from 'framer-motion'
import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useParams } from "react-router-dom";
import { ILecture } from "@/types/type";
import { notifyError } from "@/utils/notifyError";

export default function BroadcastSector() {
    const [sessions, setSessions] = useState<ILecture[]>([])
    const { classroomId } = useParams();


    useEffect(() => {
        const fetchBroadCasts = async () => {
            try {
                const { data } = await API.get(`/lectures/all/${classroomId}`);
                setSessions(data.data || []);
            } catch(e) {
                notifyError(e)
            }
        };
        fetchBroadCasts();
    }, [classroomId]);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <SectorHeader title="Live Broadcasts" subtitle="Synchronized video streams and recordings" icon={Radio} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {sessions.map(session => (
                    <div key={session._id} className="p-8 rounded-[2.5rem] bg-card/60 border border-border dark:border-white/5 backdrop-blur-xl group hover:border-primary/40 transition-all duration-500">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                {(session.status === "live" || session.status === "scheduled") ? <Activity className="animate-pulse" /> : <PlayCircle />}
                            </div>
                            {(session.status === "live" || session.status === "scheduled") && (
                                <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[8px] font-bold uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" /> SECTOR LIVE
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-bold font-cinzel text-foreground mb-2">{session.title}</h3>
                        <p className="text-[10px] font-bold font-oswald text-muted-foreground uppercase tracking-widest mb-6">
                            Instructor: {session.createdBy?.userName ?? "Unknown"}&nbsp;•&nbsp;
                            {session.startTime
                                ? new Date(session.startTime).toLocaleString(undefined, {
                                    dateStyle: "medium", timeStyle: "short"
                                }) : "No date"}
                        </p>
                        <button className="w-full py-4 rounded-xl bg-primary text-white font-oswald text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-all">
                            {(session.status === "live" || session.status === "scheduled") ? "Enter Cockpit" : "Replay Transmission"} <ArrowRight size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
