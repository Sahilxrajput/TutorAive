import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Trash2,
    Archive,
    Plus,
    Globe,
    Pin,
    Shield,
    Search as SearchIcon,
    LucideIcon,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import NotesGrid from "@/components/note/NotesGrid";
import { useClearTrash, useNotes } from "@/tanStack/hooks/useNotes";
import NoteSkelton from "@/components/note/NoteSkelton";
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { useSearchShortcut } from "@/hooks/useSearchShortcut";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Status = "active" | "other" | "archived" | "trashed" | "pinned";

export default function BrowseNotes() {
    const [status, setStatus] = useState<Status>("active");
    const [query, setQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const { user } = useAuth();
    const { data: data = [], isLoading } = useNotes(status);
    const clearTrash = useClearTrash();
    const { register } = useSearchShortcut();

    const navItems: { type: Status; label: string; icon: LucideIcon }[] = [
        { type: "pinned", label: "Pinned", icon: Pin },
        { type: "active", label: "My Notes", icon: Shield },
        { type: "other", label: "Explore", icon: Globe },
        { type: "archived", label: "Archived", icon: Archive },
        { type: "trashed", label: "Trash", icon: Trash2 },
    ];

    const notes = useMemo(
        () => data.map((note) => ({
            ...note,
            isPinned: note.pinnedBy.some((id) => id.toString() === user?._id),
        })),
        [data, user]
    );

    const filteredNotes = useMemo(() => {
        if (!query.trim()) return notes;
        const q = query.toLowerCase();
        return notes.filter((note) => note.title?.toLowerCase().includes(q));
    }, [notes, query]);

    useEffect(() => {
        const canSearch = ["active", "other", "pinned"].includes(status);
        register(canSearch ? searchInputRef.current : null);
        return () => register(null);
    }, [register, status]);

    return (
        <main className="min-h-screen p-6 md:p-10 space-y-10 max-w-[1600px] mx-auto transition-colors duration-500 relative">
            {/* Background blur */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full z-10" />

            {/* HEADER & CONTROLS */}
            <div className="flex flex-col gap-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[10px] font-bold font-oswald text-primary uppercase tracking-[0.4em]"
                        >
                            Knowledge Base
                        </motion.p>
                        <h1 className="text-4xl md:text-5xl font-bold font-cinzel tracking-tighter text-foreground">
                            BROWSE. <span className="text-primary italic">FRONTIER.</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {status === "trashed" && filteredNotes.length > 0 && (
                            <Button
                                variant="destructive"
                                className="rounded-xl font-oswald text-[10px] uppercase tracking-widest"
                                onClick={() => clearTrash.mutate()}
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Empty Trash
                            </Button>
                        )}
                        <Link
                            to="/notes/new"
                            className="flex items-center gap-3 bg-primary text-white px-6 py-3 rounded-2xl font-oswald font-bold text-xs tracking-widest uppercase shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                        >
                            <Plus size={18} /> New Entry
                        </Link>
                    </div>
                </header>

                {/* NAVIGATION & SEARCH BAR */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center border-y border-border/40 py-6">
                    {/* Status Tabs */}
                    <div className="xl:col-span-6 flex flex-wrap gap-2">
                        {navItems.map(({ type, label, icon: Icon }) => (
                            <Button
                                key={type}
                                variant={status === type ? "default" : "ghost"}
                                onClick={() => { setStatus(type); setQuery(""); }}
                                className={cn(
                                    "rounded-xl font-oswald text-[10px] uppercase tracking-[0.2em] transition-all",
                                    status === type ? "shadow-lg shadow-primary/20" : "text-muted-foreground"
                                )}
                            >
                                <Icon className="w-3.5 h-3.5 mr-2" /> {label}
                            </Button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="xl:col-span-6">
                        <AnimatePresence mode="wait">
                            {["active", "other", "pinned"].includes(status) ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <InputGroup>
                                        <InputGroupInput
                                            ref={searchInputRef}
                                            placeholder="SCAN DATABASE..."
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            className="bg-card/40 border-border dark:border-white/5 font-oswald tracking-widest text-xs h-12 rounded-2xl"
                                        />
                                        <InputGroupAddon>
                                            <SearchIcon className="w-4 h-4 text-primary" />
                                        </InputGroupAddon>
                                        <InputGroupAddon align="inline-end" className="hidden sm:flex gap-1 pr-4">
                                            <Kbd className="bg-muted text-[10px]">⌘</Kbd>
                                            <Kbd className="bg-muted text-[10px]">K</Kbd>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </motion.div>
                            ) : (
                                <div className="h-12 flex items-center px-4 italic text-muted-foreground text-[10px] tracking-widest uppercase">
                                    Search disabled in {status}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="relative min-h-[400px]">
                {isLoading ? (
                    <NoteSkelton />
                ) : filteredNotes.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-32 text-center space-y-4"
                    >
                        <div className="w-20 h-20 rounded-[2rem] bg-muted/30 border border-border flex items-center justify-center">
                            <Archive size={32} className="text-muted-foreground/40" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-oswald font-bold uppercase tracking-widest text-muted-foreground">Empty Sector</h3>
                            <p className="text-[11px] text-muted-foreground/60 uppercase tracking-tighter">
                                {query ? "No coordinates match your search scan." : "No entries found in this terminal."}
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-full">
                        <NotesGrid noteList={filteredNotes} />
                    </div>
                )}
            </div>
        </main>
    );
}