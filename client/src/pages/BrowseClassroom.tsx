import  { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    ShieldCheck,
    Globe,
    Sparkles
} from "lucide-react";
import {  useNavigate } from "react-router-dom";
import { useSearchShortcut } from "@/hooks/useSearchShortcut";
import { IClassroom } from "@/types/type";
import API from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import SectorCard from "@/components/classroom/CourseCard";


const BrowseClassroom = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [selectedTag, setSelectedTag] = useState("All");
    const [enrolledIds, setEnrolledIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchInputRef = useRef(null);
    const { register } = useSearchShortcut();


    const [selectedCourse, setSelectedCourse] = useState<IClassroom | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [courses, setCourses] = useState<IClassroom[]>([]);
    const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

    useEffect(() => {
        register(searchInputRef.current);
        return () => register(null);
    }, [register]);

    const uniqueTags = useMemo(() => {
        const allTags = courses.flatMap((c) => c.tags || []);
        return ["All", ...Array.from(new Set(allTags)).slice(0, 8)];
    }, [courses]);

    const filteredCourses = useMemo(() => {
        const q = search.trim().toLowerCase();
        return courses.filter((course) => {
            const matchesSearch = !q || course.title?.toLowerCase().includes(q) || course.description?.toLowerCase().includes(q);
            const matchesTag = selectedTag === "All" || course.tags?.includes(selectedTag);
            return matchesSearch && matchesTag;
        });
    }, [courses, search, selectedTag]);

    const enrolledList = filteredCourses.filter((c) => enrolledCourses.includes(c._id));
    const availableList = filteredCourses.filter((c) => !enrolledCourses.includes(c._id));

    const handleEnrollClick = (course: IClassroom) => {
        if (enrolledCourses.includes(course._id)) {
            navigate(`/classrooms/${course._id}`);
            return;
        }
        setSelectedCourse(course);
        setIsDialogOpen(true);
    };

    const handleConfirmEnroll = async () => {
        if (!selectedCourse) return;
        try {
            const { data } = await API.post("/classrooms/enroll", { classroomId: selectedCourse._id });
            toast.success(data.message);
            setEnrolledCourses((prev) => [...prev, selectedCourse._id]);
            navigate(`/classrooms/${selectedCourse._id}`);
        } catch (err) { console.error(err); } finally { setIsDialogOpen(false); }
    };

    useEffect(() => {
        const loadFrontierData = async () => {
            setIsLoading(true);
            try {
                const [allRes, enrolledRes] = await Promise.all([
                    API.get("/classrooms"),
                    API.get("/users/enrolled")
                ]);
                setCourses(allRes.data.data);
                setEnrolledIds(enrolledRes.data);
            } catch {
                toast.error("Failed to sync with Frontier Database.");
            } finally {
                setIsLoading(false);
            }
        };
        loadFrontierData();
    }, []);



    useEffect(() => {
        if (searchInputRef.current) {
            register(searchInputRef.current);
        }
    }, [register, isLoading]);


    const filtered = useMemo(() => {
        return courses.filter(c => {
            const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
            const matchTag = selectedTag === "All" || c.tags.includes(selectedTag);
            return matchSearch && matchTag;
        });
    }, [courses, search, selectedTag]);

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 p-6 md:p-12 transition-colors duration-500 relative overflow-hidden font-inter">

            {/* Dynamic Background Energy */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-primary/5 blur-[160px] rounded-full -z-10 pointer-events-none" />
            <div className="absolute -right-20 bottom-0 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-16">

                {/* Terminal Header */}
                <header className="flex flex-col items-center text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md"
                    >
                        <Sparkles size={14} className="text-primary animate-pulse" />
                        <span className="text-[10px] font-bold font-oswald uppercase tracking-[0.4em] text-primary">
                            Frontier Discovery Terminal
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold font-cinzel tracking-tighter leading-tight"
                    >
                        SELECT. YOUR. <br />
                        <span className="text-primary italic">KNOWLEDGE. SECTOR.</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full max-w-2xl relative group"
                    >
                        <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex items-center bg-card/40 dark:bg-black/40 border border-border dark:border-white/5 rounded-2xl backdrop-blur-2xl px-6 py-4">
                            <Search className="text-primary mr-4" size={20} />
                            <input
                                ref={searchInputRef}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="SCAN DATABASE FOR COORDINATES..."
                                className="bg-transparent border-none outline-none w-full font-oswald tracking-widest text-xs uppercase"
                            />
                            <div className="hidden sm:flex items-center gap-2 ml-4 opacity-50">
                                <kbd className="px-2 py-1 rounded bg-muted text-[10px]">CTRL</kbd>
                                <kbd className="px-2 py-1 rounded bg-muted text-[10px]">K</kbd>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tag Navigation */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {uniqueTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                className={cn(
                                    "px-6 py-2 rounded-xl text-[10px] font-bold font-oswald uppercase tracking-widest transition-all",
                                    selectedTag === tag
                                        ? "bg-primary text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] scale-105"
                                        : "bg-muted/50 text-muted-foreground hover:bg-muted border border-border/50"
                                )}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Knowledge Sectors Grid */}
                <section className="space-y-12">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-80 rounded-[2.5rem] bg-muted animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {filtered.map((course, i) => (
                                    <SectorCard
                                        key={course._id}
                                        course={course}
                                        isEnrolled={(enrolledIds as string[]).includes(course._id)}
                                        index={i}
                                        onClick={() => navigate(`/classrooms/${course._id}`)}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {!isLoading && filtered.length === 0 && (
                        <div className="text-center py-20 opacity-50 italic">
                            No sectors found at these coordinates.
                        </div>
                    )}
                </section>

                {/* Global Footer Decoration */}
                <footer className="pt-20 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={16} /> <span className="text-[10px] font-bold font-oswald uppercase tracking-widest">Secure Access</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe size={16} /> <span className="text-[10px] font-bold font-oswald uppercase tracking-widest">Global P2P</span>
                        </div>
                    </div>
                    <p className="text-[10px] font-bold font-oswald uppercase tracking-[0.4em]">TUTORAIVE v2.0</p>
                </footer>
            </div>
        </div>
    );
};

export default BrowseClassroom