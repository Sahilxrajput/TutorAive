import type { INote } from '@/types/type';
import React, { useEffect, type JSX } from 'react'
import NoteCard from './NoteCard';

interface Props {
    noteList: INote[],
    title?: string,
    icon?: JSX.Element
}

const NotesGrid = ({ noteList, }: Props) => {

    if (noteList.length === 0) return null;

    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ">
            {/* @fix make grid responsive */}
            {noteList.map((note) => <NoteCard key={note._id} note={note} />)}
        </div>
    );
};

export default NotesGrid