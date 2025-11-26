import type { INote } from '@/types/type';
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import NoteActionsDropdown from './NoteActionsDropdown';
import { Forward, Globe, Pin } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { formatLastUpdated } from '@/utils/splitDateTime';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const NoteCard = (note: INote) => {
    const { user } = useAuth();

    const isCollaborative = note.collaborators.some(
        (c) => c.user._id.toString() === user?._id
    ) && note.owner._id.toString() !== user?._id;

    const noCollaborators = note.collaborators.length === 0;
    const avatars = [...note.collaborators.map(c => c.user), note.owner];

    return (
        <motion.div
            key={note._id}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "border rounded-xl flex flex-col justify-between p-6 shadow-md hover:shadow-lg transition-all duration-200 group relative w-full min-h-[360px]",
                isCollaborative ? "ring-2 ring-blue-200 bg-blue-50/40" : "bg-card/90",
                note.isPinned && "ring-2 ring-amber-400"
            )}
        >
            <div className="relative pb-3 flex justify-center items-start">
                <div className="text-xl font-bold truncate max-w-[70%] text-center">
                    {note.title || "Untitled"}
                </div>

                <div className="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <NoteActionsDropdown note={note} />
                </div>
            </div>


            <div className="text-sm text-muted-foreground flex flex-col items-center justify-center h-full gap-4 my-8">
                <div className="flex items-center justify-center relative">
                    {avatars.map((u, i) => (
                        <div
                            key={u?._id || i}
                            className="relative"
                            style={{
                                marginLeft: i === 0 ? 0 : -14,
                                zIndex: i
                            }}
                        >
                            <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                                <AvatarImage src={u?.profilePicture} />
                                <AvatarFallback>{u?.userName?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </div>
                    ))}
                </div>

                <h3 className="text-lg font-medium">{noCollaborators ? "Owner" : "Collaborators"}</h3>
            </div>

            <div className="flex items-center justify-between text-muted-foreground">
                <p className="text-xs italic">
                    Last Update: {formatLastUpdated(note.updatedAt!)}
                </p>

                {(isCollaborative || note.isPinned || note.isPublic) && (
                    <div className="flex gap-2 items-center">
                        {isCollaborative && <Forward className="w-4 text-blue-500" />}
                        {note.isPinned && <Pin className="w-4 text-amber-400" />}
                        {note.isPublic && <Globe className="w-4 text-blue-400" />}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default NoteCard;
