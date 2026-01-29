// import type { INote } from '@/types/type';
// import { motion } from "framer-motion";
// import NoteActionsDropdown from './NoteActionsDropdown';
// import { Forward, Globe, Pin } from 'lucide-react';
// import useAuth from '@/hooks/useAuth';
// import { cn } from '@/lib/utils';
// import { formatLastUpdated } from '@/utils/splitDateTime';
// import { Button } from '../ui/button';
// import { useNavigate } from 'react-router-dom';
// import { HoverCardDemo } from './HoverCardDemo';

// const NoteCard = ({ note }: { note: INote }) => {
//     const { user } = useAuth();

//     const isCollaborative = note.collaborators.some(
//         (c) => c.user._id.toString() === user?._id
//     ) && note.owner._id.toString() !== user?._id;

//     const noCollaborators = note.collaborators.length === 0;
//     const avatars = [note.owner, ...note.collaborators.map(c => c.user)].slice(0,);

//     const navigate = useNavigate();

//     return (
//         <motion.div
//             key={note._id}
//             whileHover={{ scale: 1.03 }}
//             transition={{ duration: 0.2 }}
//             className={cn(
//                 "border relative rounded-xl flex flex-col justify-between p-6 shadow-md hover:shadow-lg transition-all duration-200 group min-h-[360px]",
//                 isCollaborative ? "ring-2 ring-blue-200 bg-blue-50/40" : "bg-card/90",
//                 note.isPinned && "ring-2 ring-amber-400"
//             )}
//         >
//             <div className="relative pb-3 flex justify-center items-start">
//                 <div className="text-xl font-bold truncate max-w-[70%] text-center">
//                     {note.title || "Untitled"}
//                 </div>

//                 <div className="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <NoteActionsDropdown note={note} />
//                 </div>
//             </div>

//             <div className="text-sm text-muted-foreground flex flex-col items-center justify-center h-full gap-4 my-8">
//                 <div className="flex items-center justify-center relative hover:cursor-pointer">
//                     {avatars.map((u, i) => (
//                         <HoverCardDemo u={u} i={i} />
//                     ))}
//                 </div>

//                 <Button
//                     onClick={() => navigate(`/notes/${note._id}`)}
//                     className="text-lg font-medium"
//                     variant={"ghost"}
//                 >{noCollaborators ? "Owner" : "Collaborators"}
//                 </Button>
//             </div>

//             <div className="flex items-center justify-between text-muted-foreground">
//                 <p className="text-xs italic">
//                     Last Update: {formatLastUpdated(note.updatedAt!)}
//                 </p>

//                 {(isCollaborative || note.isPinned || note.isPublic) && (
//                     <div className="flex gap-2 items-center">
//                         {isCollaborative && <Forward className="w-4 text-blue-500" />}
//                         {note.isPinned && <Pin className="w-4 text-amber-400" />}
//                         {note.isPublic && <Globe className="w-4 text-blue-400" />}
//                     </div>
//                 )}
//             </div>

//         </motion.div>
//     );
// };

// export default NoteCard;
import type { INote } from "@/types/type";
import { motion } from "framer-motion";
import NoteActionsDropdown from "./NoteActionsDropdown";
import { Forward, Globe, Pin } from "lucide-react";
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
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "relative flex flex-col justify-between rounded-xl border p-4 sm:p-5 lg:p-6",
                "shadow-sm hover:shadow-lg transition-all duration-200",
                "min-h-[280px] sm:min-h-[320px]",
                isCollaborative && "ring-2 ring-blue-200 bg-blue-50/40",
                note.isPinned && "ring-2 ring-amber-400",
                "bg-card"
            )}
        >
            {/* Header */}
            <div className="relative pb-2 flex items-start justify-center">
                <h3 className="text-base sm:text-lg font-semibold text-center line-clamp-2 px-6">
                    {note.title || "Untitled"}
                </h3>

                <div className="absolute right-2 top-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <NoteActionsDropdown note={note} />
                </div>
            </div>

            {/* Middle */}
            <div className="flex flex-col items-center justify-center gap-4 flex-1 text-muted-foreground my-4">
                <div className="flex items-center justify-center">
                    {avatars.map((u, i) => (
                        <HoverCardDemo key={u._id} u={u} i={i} />
                    ))}
                </div>

                <Button
                    onClick={() => navigate(`/notes/${note._id}`)}
                    variant="ghost"
                    className="text-sm sm:text-base font-medium"
                >
                    {noCollaborators ? "Owner" : "Collaborators"}
                </Button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-muted-foreground text-xs">
                <p className="italic">
                    Updated {formatLastUpdated(note.updatedAt!)}
                </p>

                {(isCollaborative || note.isPinned || note.isPublic) && (
                    <div className="flex items-center gap-2">
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
