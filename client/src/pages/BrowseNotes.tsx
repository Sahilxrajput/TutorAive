import { useState, type JSX } from "react";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Archive,
  Plus,
  Globe,
  Pin,
  Shield,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import NotesGrid from "@/components/note/NotesGrid";
import { useClearTrash, useNotes } from "@/tanStack/hooks/useNotes";
import NoteSkelton from "@/components/note/NoteSkelton";

export default function BrowseNotes() {
  const [status, setStatus] = useState<"active" | "other" | "archived" | "trashed" | "pinned">("active");
  const navItem = ["other", "active", "archived", "trashed", "pinned"]

  const { user } = useAuth();

  const { data: data = [], isLoading } = useNotes(status);
  const clearTrash = useClearTrash();


  const notes = data.map((note) => ({
    ...note,
    isPinned: note.pinnedBy.some(
      (id) => id.toString() === user?._id
    )
  }));


  // ---------- MAIN RETURN ----------
  return (
    <div className="min-h-screen px-8 py-6 max-w-full mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex w-full justify-between items-center flex-wrap gap-2">
        <div className="space-x-2 flex items-center justify-center">
          {navItem.map((type) => {
            const isActive = status === type;
            const icons: Record<string, JSX.Element> = {
              other: <Globe className="w-4 h-4 mr-1" />,
              active: <Shield className="w-4 h-4 mr-1" />,
              archived: <Archive className="w-4 h-4 mr-1" />,
              trashed: <Trash2 className="w-4 h-4 mr-1" />,
              pinned: <Pin className="w-4 h-4 mr-1" />,
            };
            return (
              <Button
                key={type}
                variant={isActive ? "default" : "outline"}
                onClick={() => setStatus(type as "active" | "other" | "archived" | "trashed" | "pinned")}
              >
                {icons[type]}
                {type === "other"
                  ? "Explore"
                  : type === "active" ? "My" : type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            );
          })}
        </div>

        {(status === "active" || status === "other" || status==="pinned") && (
          <Link to="/notes/new"
            className="flex items-center justify-center shadow-sm hover:shadow-md border-2 p-2 rounded-lg text-sm gap-2"
          >
            <Plus className="w-4 h-4" />
            New Note
          </Link>
        )}

        {status === "trashed" && notes.length > 0 && (
          <Button variant="destructive" onClick={() => clearTrash.mutate()}>
            Clear All Trashed Notes
          </Button>
        )}
      </div>

      {isLoading && <NoteSkelton />}

      {!isLoading && notes.length === 0 &&
        <p className="text-center text-muted-foreground mt-10">
          You don’t have any notes yet.
        </p>
      }

      <div className="space-y-6 h-full">
        <NotesGrid noteList={notes} />
      </div>

    </div >
  );
}


