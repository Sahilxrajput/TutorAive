import { useEffect, useState, useCallback, type JSX } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
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
import type { IDocs, INote } from "@/types/type";
import useAuth from "@/hooks/useAuth";
import NoteActionsDropdown from "@/components/note/NoteActionsDropdown";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import NotesGrid from "@/components/note/NotesGrid";
import Navbar from "@/components/note/Navbar";
import { useNotes } from "@/tanStack/hooks/useNotes";

export default function Notes() {
  const [notes, setNotes] = useState<INote[]>([]);
  const [newNote, setNewNote] = useState<Partial<INote>>({});
  const [status, setStatus] = useState<"active" | "archived" | "trashed">("active");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  // ---------- FETCH NOTES ----------
  const fetchNotes = useCallback(async (selectedStatus: string) => {
    try {
      setLoading(true);
      const { data } = await API.get("/notes", {
        params: { status: selectedStatus },
      });
      setNotes(data.data);
    } catch (err: any) {
      console.log(err.response?.data?.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  }, []);

  const { data, isLoading, error } = useNotes()

  useEffect(() => {
    console.log("docs", data)
    if (loading) console.log("loading : ", isLoading);
    if (error) console.log("error", error)
  }, [data, error, isLoading])


  // ---------- CREATE ----------
  const handleCreate = async () => {
    if (!newNote.title && !newNote.content) {
      toast.warning("Please add a title or content before saving");
      return;
    }
    try {
      // setLoading(true);
      const { data } = await API.post("/notes", newNote);
      toast.success("Note created successfully");
      setNotes((prev) => [data, ...prev]);
      setNewNote({});
      setIsCreating(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create note");
    } finally {
      // setLoading(false);
    }
  };

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

  useEffect(() => {
    // fetchNotes(status);
    console.log("pinned : ", pinnedNotes)
    console.log("otherNotes : ", otherNotes)
  }, [status, fetchNotes]);

  useEffect(() => {
    fetchNotes(status)
  }, [])


  // ---------- NOTE CATEGORIZATION ----------
  const pinnedNotes = notes.filter((n) => n.pinnedAt);
  const otherNotes = notes.filter((n) => !n.pinnedAt);



  // ---------- MAIN RETURN ----------
  return (
    <div className="min-h-screen bg-muted/30 py-8 px-6">
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

        {/* <Navbar /> */}

        {/* Notes Display */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <p className="text-center text-muted-foreground mt-10">
            You don’t have any notes yet.
          </p>
        ) : (
          <>
            {status === "active" ? (
              <>
                {pinnedNotes.length > 0 &&
                  <NotesGrid noteList={pinnedNotes} title="Pinned" icon={<Pin className="w-4 h-5" />} />}
                <NotesGrid noteList={pinnedNotes} title={pinnedNotes.length > 0 ? "Other Notes" : undefined} icon={pinnedNotes.length > 0 ? <NotepadText className="w-4" /> : undefined} />
              </>
            ) : (
              <NotesGrid noteList={notes} />
            )}
          </>
          // <NotesGrid noteList={notes} />
        )}
      </div>
    </div>
  );
}


