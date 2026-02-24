import { useState, useEffect, useMemo, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MoreHorizontal,
    Filter,
    UserPlus,
    GraduationCap,
    Clock,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    AtSign,
    Zap,
    Command,
    Users,
    SearchIcon,
} from "lucide-react";
import { IUser } from "@/types/type";
import API from "@/lib/api";
import { cn } from "@/lib/utils";
import TweetAvatar from "../community/TweetAvatar";
import { Outlet, useOutletContext, useParams } from "react-router-dom";
import SectorHeader from "./SectorHeader";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import InvitationDialog from "./InvitationDialog";


interface FrontierBadge {
    children: ReactNode,
    variant: "default" | "secondary" | "success" | "warning"
}

const FrontierBadge = ({ children, variant = 'default' }: FrontierBadge) => {
    const variants = {
        default: "bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_rgba(var(--primary-rgb),0.05)]",
        secondary: "bg-muted text-muted-foreground border-border opacity-60",
        success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
        warning: "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
    };
    return (
        <span className={cn(
            "px-3 py-1 rounded-full text-[8px] font-bold font-oswald uppercase tracking-widest border transition-all duration-300",
            variants[variant]
        )}>
            {children}
        </span>
    );
};

const RosterSector = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [students, setStudents] = useState<IUser[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [openAddStudent, setOpenAddStudent] = useState(false)

    const { classroomId } = useParams();
    const { isClassInstructor } = useOutletContext<{
        isClassInstructor: boolean;
    }>();

    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true);
            try {
                const { data } = await API.get(`/classrooms/${classroomId}/students?page=${page}`);
                setStudents(data.students);
                setTotalStudents(data.totalStudents);
                setTotalPages(Math.ceil(data.totalStudents / data.limit));
            } catch (err) {
                console.error("Terminal Sync Error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudents();
    }, [classroomId, page]);

    const getStatusVariant = (status: "Active" | "On Leave" | "Inactive") => {
        switch (status) {
            case 'Active': return 'success';
            case 'On Leave': return 'warning';
            default: return 'secondary';
        }
    };

    const filteredStudents = useMemo(() => {
        return students.filter(s =>
            `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.userName && s.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [students, searchTerm]);

    return (<>
        <div className="min-h-screen p-4 md:p-8 lg:p-12 font-inter relative overflow-hidden ">
            <InvitationDialog isOpen={openAddStudent} onClose={() => setOpenAddStudent(false)} />
            {/* Structural Depth Glows */}
            <div className="absolute top-0 left-1/4 w-150h-150 bg-primary/5 blur-[140px] rounded-full -z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-12">

                {/* Tactical Header */}
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-border/40 pb-10">
                    <div className="space-y-4">
                        <SectorHeader
                            title="Personnel Roster"
                            subtitle="Overseeing student distribution across academic sectors."
                            icon={Users}
                        />
                    </div>

                    {isClassInstructor && <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-card/40 border border-border dark:border-white/5 text-[10px] font-bold font-oswald uppercase tracking-widest hover:bg-muted/50 transition-all">
                            <Filter size={14} /> Filters
                        </button>
                        <button
                            onClick={() => setOpenAddStudent(true)}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-[10px] font-bold font-oswald uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            <UserPlus size={14} /> Authorize Identity
                        </button>
                    </div>}
                </header>

                {/* Search & Intelligence Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-6">
                    <InputGroup
                        className="md:col-span-2 w-full bg-card/40 border border-border dark:border-white/5 rounded-2xl overflow-hidden"
                    >
                        <InputGroupAddon
                            align="inline-start"
                            className="pl-4 text-muted-foreground"
                        >
                            <SearchIcon />
                        </InputGroupAddon>

                        <InputGroupInput
                            type="text"
                            id="inline-start-input"
                            placeholder="SCAN BY NAME, ROLL, OR SECTOR..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="py-4 pr-4 bg-transparent text-[10px] font-oswald uppercase tracking-widest focus:outline-none placeholder:opacity-20"
                        />
                    </InputGroup>

                    <div className="bg-card/40 backdrop-blur-xl border border-border dark:border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-sm group">
                        <div className="space-y-1">
                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Active Nodes</p>
                            <p className="text-3xl font-bold font-cinzel group-hover:text-primary transition-colors leading-none">{totalStudents}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <GraduationCap size={20} />
                        </div>
                    </div>

                    <div className="bg-card/40 backdrop-blur-xl border border-border dark:border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-sm group">
                        <div className="space-y-1">
                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Sector Sync</p>
                            <p className="text-3xl font-bold font-cinzel text-emerald-500 leading-none">94%</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                            <Zap size={20} fill="currentColor" />
                        </div>
                    </div>
                </div>

                {/* Main Data Terminal */}
                <div className="bg-card/30 backdrop-blur-2xl border border-border dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-200">
                            <thead>
                                <tr className="border-b border-border dark:border-white/5 bg-muted/20">
                                    <th className="px-8 py-6 text-[10px] font-bold font-oswald text-muted-foreground uppercase tracking-[0.2em]">
                                        <div className="flex items-center gap-2">Student Identity <ChevronDown size={14} className="opacity-40" /></div>
                                    </th>
                                    <th className="px-8 py-6 text-[10px] font-bold font-oswald text-muted-foreground uppercase tracking-[0.2em]">Sector Core</th>
                                    <th className="px-8 py-6 text-[10px] font-bold font-oswald text-muted-foreground uppercase tracking-[0.2em]">Deployment</th>
                                    <th className="px-8 py-6 text-[10px] font-bold font-oswald text-muted-foreground uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-bold font-oswald text-muted-foreground uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border dark:divide-white/5">
                                {isLoading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-8 py-10 bg-muted/50 border-b border-border/10" />
                                        </tr>
                                    ))
                                ) : (
                                    <AnimatePresence mode="popLayout">
                                        {filteredStudents.map((student, i) => (
                                            <motion.tr
                                                key={student._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="group hover:bg-primary/2 transition-all duration-300 cursor-default"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-5">
                                                        <TweetAvatar author={student} size={10} />
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-foreground group-hover:text-primary transition-colors font-inter text-sm">
                                                                {student.firstName} {student.lastName}
                                                            </span>
                                                            <div className="flex items-center gap-2 mt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                                                <AtSign size={10} className="text-primary" />
                                                                <span className="text-[10px] font-medium font-oswald tracking-widest uppercase">{student.userName}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-bold font-oswald uppercase tracking-widest text-foreground">{student?.sector}</span>
                                                        <span className="text-[9px] text-muted-foreground uppercase tracking-tighter mt-1 font-inter">{student?.major}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="inline-flex items-center gap-2 text-[10px] font-bold font-oswald uppercase tracking-widest px-3 py-1.5 rounded-xl bg-muted/50 border border-border dark:border-white/5">
                                                        <Clock size={12} className="text-primary/50" /> {student?.year}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <FrontierBadge variant={getStatusVariant(student?.status)}>
                                                        {student?.status}
                                                    </FrontierBadge>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button className="p-3 hover:bg-primary/10 rounded-xl border border-transparent hover:border-primary/20 transition-all text-muted-foreground hover:text-primary">
                                                        <MoreHorizontal size={18} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Industrial Footer / Tactics */}
                    <footer className="px-8 py-6 border-t border-border dark:border-white/5 flex flex-col md:flex-row items-center justify-between bg-muted/10 gap-6">
                        <div className="flex items-center gap-6 opacity-40">
                            <div className="flex items-center gap-2">
                                <Command size={14} />
                                <p className="text-[10px] font-bold font-oswald uppercase tracking-widest">
                                    Sector: <span className="text-foreground">{classroomId}</span>
                                </p>
                            </div>
                            <div className="w-px h-4 bg-border" />
                            <p className="text-[9px] font-medium italic opacity-60">
                                Showing {filteredStudents.length} nodes of {totalStudents} synchronization logs.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-6 py-2.5 text-[9px] font-bold font-oswald uppercase tracking-[0.2em] border border-border dark:border-white/5 rounded-xl hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={14} className="inline mr-2" /> Previous
                            </button>
                            <div className="px-4 py-2 bg-primary/10 rounded-xl text-primary font-oswald font-bold text-xs border border-primary/20">
                                {page}
                            </div>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-6 py-2.5 text-[9px] font-bold font-oswald uppercase tracking-[0.2em] bg-foreground text-background rounded-xl hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                Next <ChevronRight size={14} className="inline ml-2" />
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
        <Outlet />
</>
        );
};

        export default RosterSector