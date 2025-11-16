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
import type { INote } from "@/types/auth";
import useAuth from "@/hooks/useAuth";
import NoteActionsDropdown from "@/components/note/NoteActionsDropdown";
import { cn } from "@/lib/utils";

export default function Notes() {
  const [notes, setNotes] = useState<INote[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState<Partial<INote>>({});
  const [status, setStatus] = useState<"active" | "archived" | "trashed">("active");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  // ---------- FETCH NOTES ----------
  const fetchNotes = useCallback(async (selectedStatus = "active") => {
    try {
      setLoading(true);
      const { data } = await API.get("/notes", {
        params: { status: selectedStatus },
      });
      setNotes(data);
    } catch (err: any) {
      console.log(err.response?.data?.message || "Failed to fetch notes");
    } finally {
      // setLoading(false);
    }
  }, []);

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
    fetchNotes(status);
  }, [status, fetchNotes]);


  // ---------- NOTE CATEGORIZATION ----------
  const pinnedNotes = notes.filter((n) => n.pinnedAt);
  const otherNotes = notes.filter((n) => !n.pinnedAt);

  // ---------- NOTE RENDERING ----------
  const renderNotesGrid = (noteList: INote[], title?: string, icon?: JSX.Element) => {
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
          {noteList.map((note) => renderNoteCard(note))}
        </div>
      </>
    );
  };

  const renderNoteCard = (note: INote) => {
    const isCollaborative = note.owner !== user?._id;
    const isPinned = !!note.pinnedAt;

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
          style={{ backgroundColor: note.color || "#ffffff" }}
        >
          <CardHeader className="pb-2 flex justify-between items-start">
            <CardTitle className="text-base font-semibold truncate flex items-center gap-2">
              {note.title || "Untitled"}
            </CardTitle>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <NoteActionsDropdown
                note={note}
                onActionComplete={() => fetchNotes(status)}
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
            {note.content || "No content yet..."}
          </CardContent>
        </Card>
      </motion.div>
    );
  };



// ---------- MAIN RETURN ----------
return (
  <div className="min-h-screen bg-muted/30 py-8 px-6">
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-2">
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
          <Button variant="outline" onClick={() => setIsCreating(!isCreating)}>
            <Plus className="w-4 h-4" />
            {isCreating ? "Cancel" : "New Note"}
          </Button>
        )}

        {status === "trashed" && notes.length > 0 && (
          <Button variant="destructive" onClick={handleClearAllTrashed}>
            Clear All Trashed Notes
          </Button>
        )}
      </div>

      {/* Create New Note */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border border-border bg-card/70 shadow-sm rounded-xl">
            <CardHeader>
              <Input
                placeholder="Title"
                value={newNote.title || ""}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="border-none shadow-none focus-visible:ring-0 text-lg font-medium bg-transparent"
              />
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write your note..."
                value={newNote.content || ""}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="border-none shadow-none focus-visible:ring-0 resize-none bg-transparent"
                rows={4}
              />
              <div className="flex justify-end mt-4">
                <Button onClick={handleCreate}>Save</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        // <SimpleEditor />
      )}

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
              {pinnedNotes.length > 0 && renderNotesGrid(pinnedNotes, "Pinned", <Pin className="w-4 h-5" />)}
              {renderNotesGrid(
                otherNotes,
                pinnedNotes.length > 0 ? "Other Notes" : undefined,
                pinnedNotes.length > 0 ? <NotepadText className="w-4" /> : undefined
              )}
            </>
          ) : (
            renderNotesGrid(notes)
          )}

        </>
      )}
    </div>
  </div>
);
}
