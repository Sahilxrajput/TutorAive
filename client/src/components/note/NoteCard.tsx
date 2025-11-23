import type { IDocs, INote } from '@/types/type';
import { useEffect } from 'react'
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import NoteActionsDropdown from './NoteActionsDropdown';
import { Forward, Pin } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { cn } from '@/lib/utils';


const NoteCard = (note: INote) => {

    const { user } = useAuth();

    const isCollaborative = note.owner !== user?._id;
    const isPinned = !!note.pinnedAt;

    useEffect(() => {
        console.log("specific card", note)
    }, [])

    return (
        <motion.div
            key={note._id}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <Card
                className={cn(
                    "border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group relative",
                    isCollaborative
                        ? "ring-blue-200 ring-2 bg-blue-50/40"
                        : "border-border bg-card/80",
                    isPinned && status === "active" && "ring-2 ring-amber-400"
                )}
            // style={{ backgroundColor: note?.color || "#ffffff" }}
            >
                <CardHeader className="pb-2 flex justify-between items-start">
                    <CardTitle className="text-base font-semibold truncate flex items-center gap-2">
                        {note.title || "Untitled"}
                    </CardTitle>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <NoteActionsDropdown
                            note={note}
                        //  onActionComplete={() => fetchNotes(status)}
                        />
                    </div>
                    {(isCollaborative || isPinned) && status === "active" && (
                        <div className="flex absolute right-2 top-1 gap-2 items-center justify-center">
                            {isCollaborative && <Forward className="w-4 text-blue-500" />}
                            {isPinned && <Pin className="text-amber-400 w-4" />}
                        </div>
                    )}
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground line-clamp-3">
                    {/* {note.content || "No content yet..."} */}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default NoteCard