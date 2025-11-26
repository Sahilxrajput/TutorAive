import { useEffect, useState, useCallback, type JSX } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Trash2,
  Archive,
  Plus,
  Pin,
  Forward,
  NotepadText,
} from "lucide-react";
import API from "@/lib/api";
import { motion } from "framer-motion";
import type { INote } from "@/types/type";
import useAuth from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import NotesGrid from "@/components/note/NotesGrid";
import Navbar from "@/components/note/Navbar";
import { useClearTrash, useNotes, useSaveNote } from "@/tanStack/hooks/useNotes";
import NoteSkelton from "@/components/note/NoteSkelton";

export default function Notes() {
  // const [notes, setNotes] = useState<INote[]>([]);
  const [newNote, setNewNote] = useState<Partial<INote>>({});
  const [status, setStatus] = useState<"active" | "archived" | "trashed">("active");

  const { user } = useAuth();

  // ---------- FETCH NOTES ----------
  // const fetchNotes = useCallback(async (selectedStatus: string) => {
  //   try {
  //     setLoading(true);
  //     const { data } = await API.get("/notes/" + selectedStatus);
  //     setNotes(data.data);
  //   } catch (err: any) {
  //     console.log(err.response?.data?.message || "Failed to fetch notes");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  const { data: data = [], isLoading, error } = useNotes(status);

  const notes = data.map((note) => ({
    ...note,
    isPinned: note.pinnedBy.some(
      (id) => id.toString() === user?._id
    )
  }));

  // ---------- CREATE ----------
  // const handleCreate = async () => {
  //   if (!newNote.title && !newNote.content) {
  //     toast.warning("Please add a title or content before saving");
  //     return;
  //   }
  //   try {
  //     // setLoading(true);
  //     const { data } = await API.post("/notes", newNote);
  //     toast.success("Note created successfully");
  //     setNotes((prev) => [data, ...prev]);
  //     setNewNote({});
  //     setIsCreating(false);
  //   } catch (err: any) {
  //     toast.error(err.response?.data?.message || "Failed to create note");
  //   } finally {
  //     // setLoading(false);
  //   }
  // };

  const handleClearAllTrashed = async () => {
    try {
      const { data } = await API.delete("/notes/clear-trash");
      toast.success(data.message);
      console.log(data);
      await fetchNotes("trashed");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to clear trashed notes");
    }
  };
  // ---------- NOTE CATEGORIZATION ----------


  useEffect(() => {
    console.log("notes", notes);
  }, [isLoading])


  if (isLoading) {
    return <NoteSkelton />
  }
  if (notes.length === 0) {
    return <p className="text-center text-muted-foreground mt-10">
      You don’t have any notes yet.
    </p>
  }

  // ---------- MAIN RETURN ----------
  return (
    <div className="min-h-screen bg-muted/30 px-8 py-8">
      <div className="max-w-full mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex w-full justify-between items-center flex-wrap gap-2">

          <div className="space-x-2 flex items-center justify-center">
            {["active", "archived", "trashed"].map((type) => {
              const isActive = status === type;
              const icons: Record<string, JSX.Element> = {
                active: <></>,
                archived: <Archive className="w-4 h-4 mr-1" />,
                trashed: <Trash2 className="w-4 h-4 mr-1" />,
              };
              return (
                <Button
                  key={type}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => setStatus(type as any)}
                >
                  {icons[type]}
                  {type === "active"
                    ? "All Notes"
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              );
            })}
          </div>

          {status === "active" && (
            <Link to="/notes/new"
              className="flex items-center justify-center shadow-sm hover:shadow-md border-2 p-2 rounded-lg text-sm gap-2"
            >
              <Plus className="w-4 h-4" />
              New Note
            </Link>
          )}

          {status === "trashed" && notes.length > 0 && (
            <Button variant="destructive" onClick={handleClearAllTrashed}>
              Clear All Trashed Notes
            </Button>
          )}
        </div>

        <div className="space-y-6  h-full">
          <NotesGrid noteList={notes} />
        </div>
      </div>
    </div >
  );
}


