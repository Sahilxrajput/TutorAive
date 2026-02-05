import type { INote } from "@/types/type";
import { motion } from "framer-motion";
import NoteActionsDropdown from "./NoteActionsDropdown";
import { Forward, Globe, Pin, FileText } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { formatLastUpdated } from "@/utils/splitDateTime";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { HoverCardDemo } from "./HoverCardDemo";

const NoteCard = ({ note }: { note: INote }) => {
    const { user } = useAuth();

    const isCollaborative =
        note.collaborators.some(
            (c) => c.user._id.toString() === user?._id
        ) && note.owner._id.toString() !== user?._id;

    const noCollaborators = note.collaborators.length === 0;
    const avatars = [note.owner, ...note.collaborators.map((c) => c.user)];

    const navigate = useNavigate();

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
                "relative flex flex-col justify-between rounded-[2rem] border p-6 transition-all duration-500 group",
                "bg-card/60 dark:bg-neutral-900/40 backdrop-blur-xl border-border dark:border-white/5",
                "shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30",
                "min-h-[300px] sm:min-h-[340px]",
                isCollaborative && "ring-1 ring-primary/30 bg-primary/5",
                note.isPinned && "border-amber-400/50 shadow-amber-400/5"
            )}
        >
            {/* Background Decorative Element */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* HEADER */}
            <div className="relative flex items-start justify-between z-10">
                <div className="flex flex-col gap-1 w-full text-center px-4">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <FileText size={12} className="text-primary opacity-50" />
                        <span className="text-[9px] font-bold font-oswald text-muted-foreground uppercase tracking-[0.2em]">
                            Note Entry
                        </span>
                    </div>
                    <h3 className="text-lg font-bold font-cinzel tracking-tight text-foreground line-clamp-2">
                        {note.title || "Untitled Entry"}
                    </h3>
                </div>

                <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <NoteActionsDropdown note={note} />
                </div>
            </div>

            {/* MIDDLE - COLLABORATORS */}
            <div className="flex flex-col items-center justify-center gap-6 flex-1 my-6 relative z-10">
                <div className="flex items-center justify-center -space-x-2">
                    {avatars.map((u, i) => (
                        <div key={u._id} className="transition-transform hover:z-20 hover:scale-110">
                            <HoverCardDemo u={u} i={i} />
                        </div>
                    ))}
                </div>

                <Button
                    onClick={() => navigate(`/notes/${note._id}`)}
                    variant="ghost"
                    className="h-auto py-2 px-4 rounded-xl text-[10px] font-bold font-oswald uppercase tracking-[0.2em] bg-muted/30 hover:bg-primary hover:text-white transition-all"
                >
                    {noCollaborators ? "View Owner" : `${note.collaborators.length} Collaborators`}
                </Button>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between text-muted-foreground border-t border-border/40 dark:border-white/5 pt-4 mt-auto relative z-10">
                <p className="text-[10px] font-medium font-inter italic opacity-70">
                    Sync: {formatLastUpdated(note.updatedAt!)}
                </p>

                <div className="flex items-center gap-3">
                    {isCollaborative && (
                        <Forward className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
                    )}
                    {note.isPinned && (
                        <Pin className="w-3.5 h-3.5 text-amber-400" strokeWidth={2.5} fill="currentColor" />
                    )}
                    {note.isPublic && (
                        <Globe className="w-3.5 h-3.5 text-blue-400" strokeWidth={2.5} />
                    )}
                </div>
            </div>

            {note.isPinned && (
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-amber-400 rounded-full blur-[2px] animate-pulse" />
            )}
        </motion.div>
    );
};

export default NoteCard;