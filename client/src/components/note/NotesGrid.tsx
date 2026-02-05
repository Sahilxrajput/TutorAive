import type { INote } from '@/types/type';
import { type JSX } from 'react';
import NoteCard from './NoteCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, FilePlus2 } from 'lucide-react';

interface Props {
    noteList: INote[];
    title?: string;
    icon?: JSX.Element;
}

const NotesGrid = ({ noteList }: Props) => {

    if (noteList.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-32 px-6 rounded-[3rem] border border-dashed border-border dark:border-white/5 bg-card/20 backdrop-blur-sm"
            >
                <div className="relative mb-6">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-20px] border border-primary/10 rounded-full"
                    />
                    <div className="w-20 h-20 rounded-[2rem] bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/40 relative z-10">
                        <Archive size={32} strokeWidth={1.5} />
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h3 className="text-sm font-bold font-oswald uppercase tracking-[0.3em] text-foreground">
                        No Entries Detected
                    </h3>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-inter max-w-[200px] leading-relaxed opacity-70">
                        The local archive is currently offline. <br /> Initialize a new note to begin.
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/notes/new'}
                    className="mt-8 flex items-center gap-2 text-[9px] font-bold font-oswald tracking-[0.2em] uppercase text-primary border border-primary/20 px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
                >
                    <FilePlus2 size={14} /> Create Entry
                </motion.button>
            </motion.div>
        );
    }

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mb-12">
            <AnimatePresence mode="popLayout">
                {noteList.map((note, i) => (
                    <motion.div
                        key={note._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                            duration: 0.4,
                            delay: i * 0.05,
                            ease: [0.23, 1, 0.32, 1]
                        }}
                    >
                        <NoteCard note={note} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NotesGrid;