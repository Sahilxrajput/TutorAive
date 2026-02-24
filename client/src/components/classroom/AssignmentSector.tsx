import { lazy, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    Clock,
    Plus,
    Sparkles,
} from "lucide-react";
import API from "@/lib/api";
import { useOutletContext, useParams } from "react-router-dom";
import { toast } from "sonner";
import { IAssignment, ISubmission } from "@/types/type";
import useAuth from "@/hooks/useAuth";
import { Skeleton } from "../ui/skeleton";
const AssignmentCard = lazy(() => import("./AssignmentCard"));
const SubmissionCard = lazy(() => import("./SubmissionCard"));
const PdfUploadDialog = lazy(() => import("./PdfUploadDialog"));
const SectorHeader = lazy(() => import("./SectorHeader"));


function AssignmentSector() {
    const [submitted, setSubmitted] = useState<ISubmission[]>([]);
    const [pending, setPending] = useState<IAssignment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { classroomId } = useParams();
    const { user } = useAuth();
    const { isClassInstructor } = useOutletContext<{
        isClassInstructor: boolean;
    }>();

    useEffect(() => {
        async function fetchAssignments() {
            try {
                if (!user) return;
                setIsLoading(true);
                const { data } = await API.get(`/classrooms/${classroomId}/students/${user._id}/assignment-progress`)
                setPending(data.pending || [])
                setSubmitted(data.submitted || [])
            } catch (e) {
                console.log(e)
                toast.error("Unable to fetch assignments")
            } finally {
                setIsLoading(false);
            }
        }
        fetchAssignments()
    }, [classroomId, user])

    // function submissionUploaded(id: string) {
    //     setPending(prevPending => {
    //         const item = prevPending.find(a => a._id === id);
    //         if (!item) return prevPending;

    //         setSubmitted(prevSubmitted => {
    //             // prevent duplicates
    //             if (prevSubmitted.some(a => a._id === id)) {
    //                 return prevSubmitted;
    //             }

    //             // Create a minimal ISubmission object using the properties required by ISubmission
    //             const submission: ISubmission = {
    //                 assignment: item._id,
    //                 status: "submitted",
    //                 student: "",
    //                 _id: id,
    //                 file: item.file,
    //                 updatedAt: item.updatedAt,
    //             };

    //             return [
    //                 ...prevSubmitted,
    //                 submission,
    //             ];
    //         });

    //         return prevPending.filter(a => a._id !== id);
    //     });
    // }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background p-8 space-y-10">
                <Skeleton className="h-20 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 relative overflow-hidden font-inter">
            <div className="absolute top-0 left-1/4 w-150 h-150 bg-primary/5 blur-[140px] rounded-full z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-20">

                <div className="space-y-24 pb-20">
                    <section className="space-y-10">

                        <div className="flex items-start w-full justify-between pr-4">
                            <SectorHeader color="yellow-500" title="Pending Directives" subtitle="Action required for sector clearance" icon={Clock} />

                            {isClassInstructor && (
                                <PdfUploadDialog
                                    Icon={Plus}
                                    buttonText="Add Assignment"
                                    type="assignment"
                                    id={classroomId || "1"}
                                    title="add new assignmnet"
                                />
                            )}
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
                                        <AssignmentCard key={item._id} item={item} isInstructor={isClassInstructor} isPending={true} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </section>

                    <section className="space-y-10">
                        <SectorHeader color="emerald-500" title="Mission Archive" subtitle="Historical logs and verified transmissions" icon={CheckCircle2} />


                        {submitted.length === 0 ? (
                            <div className="py-12 text-center opacity-30 italic font-inter text-sm">
                                Archive currently empty. Complete missions to populate data.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <AnimatePresence mode="popLayout">
                                    {submitted.map((item) => (
                                        <SubmissionCard item={item} />
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

export default AssignmentSector;

