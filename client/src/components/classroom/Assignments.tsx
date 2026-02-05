import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    Clock,
    Sparkles,
} from "lucide-react";
import API from "@/lib/api";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { IAssignment } from "@/types/type";
import AssignmentCard from "./AssignmentCard";


function AssignmentPage() {
    const [submitted, setSubmitted] = useState<IAssignment[]>([]);
    const [pending, setPending] = useState<IAssignment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { classroomId } = useParams();

    useEffect(() => {
        async function fetchAssignments() {
            try {
                setIsLoading(true);
                const { data } = await API.get(`/classrooms/${classroomId}/my-assignment-progress`)
                setPending(data.pending || [])
                setSubmitted(data.submitted || [])
            } catch(e) {
                console.log(e)
                toast.error("Unable to fetch assignments")
            } finally {
                setIsLoading(false);
            }
        }
        fetchAssignments()
    }, [classroomId])

    function submissionUploaded(id: string, submissionId?: string) {
        setPending(prevPending => {
            const item = prevPending.find(a => a._id === id);
            if (!item) return prevPending;

            setSubmitted(prevSubmitted => {
                // prevent duplicates
                if (prevSubmitted.some(a => a._id === id)) {
                    return prevSubmitted;
                }

                return [
                    ...prevSubmitted,
                    {
                        ...item,
                        isSubmitted: true,
                        submissionId,
                        submittedAt: new Date().toISOString(),
                    },
                ];
            });

            return prevPending.filter(a => a._id !== id);
        });
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background p-10 space-y-10">
                <div className="h-20 w-64 bg-muted animate-pulse rounded-[2rem]" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-64 rounded-[2.5rem] bg-muted animate-pulse border border-border/10" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 relative overflow-hidden font-inter">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 blur-[140px] rounded-full z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-20">
                {/*<header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-border/40 pb-12">
                     <div className="space-y-4">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-primary">
                            <Target size={16} className="animate-pulse" />
                            <span className="text-[10px] font-bold font-oswald uppercase tracking-[0.4em]">Directive Control Center</span>
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-bold font-cinzel tracking-tighter text-foreground uppercase leading-none">
                            MISSION. <span className="text-primary italic">INTEL.</span>
                        </h1>
                    </div>

                    <div className="hidden md:flex items-center gap-8 opacity-40">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-bold font-oswald uppercase tracking-widest">Pending Protocol</span>
                            <span className="text-2xl font-bold font-cinzel text-yellow-500">{pending.length}</span>
                        </div>
                        <div className="w-px h-10 bg-border/40" />
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-bold font-oswald uppercase tracking-widest">Archived Mission</span>
                            <span className="text-2xl font-bold font-cinzel text-emerald-500">{submitted.length}</span>
                        </div>
                    </div>
                </header> */}

                <div className="space-y-24 pb-20">
                    <section className="space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                                <Clock size={20} />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-bold font-cinzel tracking-wider text-foreground uppercase">Pending Directives</h2>
                                <p className="text-[9px] font-bold font-oswald text-muted-foreground uppercase tracking-widest">Action required for sector clearance</p>
                            </div>
                        </div>

                        {pending.length === 0 ? (
                            <div className="py-20 rounded-[2.5rem] border border-dashed border-border/50 flex flex-col items-center justify-center text-center opacity-40">
                                <Sparkles size={40} className="mb-4 text-primary/30" />
                                <p className="font-oswald tracking-widest uppercase text-xs">All Directives Synchronized. System Clear.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <AnimatePresence mode="popLayout">
                                    {pending.map((item) => (
                                        <AssignmentCard key={item._id} item={item} isPending={true} onUploadComplete={submissionUploaded} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </section>

                    <section className="space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                <CheckCircle2 size={20} />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-bold font-cinzel tracking-wider text-foreground uppercase">Mission Archive</h2>
                                <p className="text-[9px] font-bold font-oswald text-muted-foreground uppercase tracking-widest">Historical logs and verified transmissions</p>
                            </div>
                        </div>

                        {submitted.length === 0 ? (
                            <div className="py-12 text-center opacity-30 italic font-inter text-sm">
                                Archive currently empty. Complete missions to populate data.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <AnimatePresence mode="popLayout">
                                    {submitted.map((item) => (
                                        <AssignmentCard key={item._id} item={item} isPending={false} onUploadComplete={submissionUploaded} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default AssignmentPage;

