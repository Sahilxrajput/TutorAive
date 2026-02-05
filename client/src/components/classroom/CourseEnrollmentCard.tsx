import { IClassroom } from "@/types/type";
import { Zap, Lock, Cpu } from "lucide-react";

interface Props {
    course: IClassroom,
    isSyncing: boolean,
    onConfirm: () => void
}

const CourseEnrollmentCard = ({ course, isSyncing, onConfirm }: Props) => (
    <div className="p-10 space-y-8">
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <p className="text-[10px] font-bold font-oswald text-primary uppercase tracking-[0.3em]">Mission Authorization</p>
                <h2 className="text-2xl font-bold font-cinzel text-foreground leading-tight uppercase">{course?.title}</h2>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Cpu size={32} className={isSyncing ? "animate-spin" : ""} />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Modules</p>
                <p className="text-xl font-bold font-cinzel text-foreground">{course?.modules}</p>
            </div>
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Est. Completion</p>
                <p className="text-xl font-bold font-cinzel text-foreground">{course?.hours}h</p>
            </div>
        </div>
        <div className="pt-4 flex flex-col gap-3">
            <button disabled={isSyncing} onClick={onConfirm} className="w-full py-5 rounded-2xl bg-primary text-white font-oswald font-bold uppercase tracking-[0.3em] text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                {isSyncing ? <>SYNCHRONIZING... <Zap size={14} className="animate-pulse" /></> : <>{course?.paid ? "PURCHASE ACCESS" : "AUTHORIZE ENROLLMENT"} <Lock size={14} /></>}
            </button>
        </div>
    </div>
);


export default CourseEnrollmentCard