import type { IDocs, INote } from '@/types/type';
import React, { type JSX } from 'react'
import NoteCard from './NoteCard';

interface Props {
    noteList: INote[],
    title?: string,
    icon?: JSX.Element
}

const NotesGrid = ({ noteList, title, icon }: Props) => {
    if (noteList.length === 0) return null;

    return (
        <>
            {title && (
                <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground mb-2">
                    {icon}
                    {title}
                </span>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {noteList.map((note) => NoteCard(note))}
            </div>
        </>
    );
};

export default NotesGrid