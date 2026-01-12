import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import { useNote } from '@/tanStack/hooks/useNotes'
import { useParams } from 'react-router-dom';

const Note = () => {

    const { noteId } = useParams();
    const { data: note, isLoading } = useNote(noteId!);



    //@todo
    if (isLoading) {
        <p>Loading...</p>
    }

    return (
        <div className='px-6 py-2 w-full overflow-hidden h-full'>
            <SimpleEditor content={note?.content} noteId={noteId} noteTitle={note?.title || "New Document"} />
        </div>
    )
}

export default Note