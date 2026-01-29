import type { INote } from '@/types/type';
import  { type JSX } from 'react'
import NoteCard from './NoteCard';

interface Props {
    noteList: INote[],
    title?: string,
    icon?: JSX.Element
}

const NotesGrid = ({ noteList, }: Props) => {

    if (noteList.length === 0) return null;

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12">
            {noteList.map((note) => <NoteCard key={note._id} note={note} />)}
        </div>
    );
};

export default NotesGrid