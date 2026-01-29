import { useState, type JSX, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Trash2,
    Archive,
    Plus,
    Globe,
    Pin,
    Shield,
    Search as SearchIcon,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import NotesGrid from "@/components/note/NotesGrid";
import { useClearTrash, useNotes } from "@/tanStack/hooks/useNotes";
import NoteSkelton from "@/components/note/NoteSkelton";
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { useSearchShortcut } from "@/hooks/useSearchShortcut";

type Status = "active" | "other" | "archived" | "trashed" | "pinned";

export default function BrowseNotes() {
    const [status, setStatus] = useState<Status>("active");
    const [query, setQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement | null>(null)

    const navItem: Status[] = [
        "other",
        "active",
        "archived",
        "trashed",
        "pinned",
    ];

    const { user } = useAuth();
    const { data: data = [], isLoading } = useNotes(status);
    const clearTrash = useClearTrash();
    const { register } = useSearchShortcut();


    const notes = useMemo(
        () =>
            data.map((note) => ({
                ...note,
                isPinned: note.pinnedBy.some(
                    (id) => id.toString() === user?._id
                ),
            })),
        [data, user]
    );

    /* ---------- SEARCH + FILTER ---------- */
    const filteredNotes = useMemo(() => {
        if (!query.trim()) return notes;

        const q = query.toLowerCase();

        return notes.filter(
            (note) =>
                note.title?.toLowerCase().includes(q)
        );
    }, [notes, query]);

    useEffect(() => {
        if (
            status === "active" ||
            status === "other" ||
            status === "pinned"
        ) {
            register(searchInputRef.current);
        } else {
            register(null);
        }

        return () => register(null);
    }, [register, status]);


    return (
        <div className="min-h-screen px-6 sm:px-8 py-6 max-w-full mx-auto flex flex-col gap-8">
            {/* Header */}
            <div className="flex w-full justify-between items-center flex-wrap gap-3">
                <div className="flex flex-wrap gap-2">
                    {navItem.map((type) => {
                        const isActive = status === type;
                        const icons: Record<Status, JSX.Element> = {
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
                                onClick={() => {
                                    setStatus(type);
                                    setQuery("");
                                }}
                            >
                                {icons[type]}
                                {type === "other"
                                    ? "Explore"
                                    : type === "active"
                                        ? "My"
                                        : type.charAt(0).toUpperCase() + type.slice(1)}
                            </Button>
                        );
                    })}
                </div>

                {/* Search */}
                {(status === "active" ||
                    status === "other" ||
                    status === "pinned") && (
                        <div className="flex w-full max-w-2xl">
                            <InputGroup>
                                <InputGroupInput
                                    ref={searchInputRef}
                                    placeholder="Search notes..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <InputGroupAddon>
                                    <SearchIcon className="w-4 h-4" />
                                </InputGroupAddon>
                                <InputGroupAddon
                                    align="inline-end"
                                    className="hidden sm:flex gap-1"
                                >
                                    <Kbd>⌘</Kbd>
                                    <Kbd>K</Kbd>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                    )}

                {(status === "active" ||
                    status === "other" ||
                    status === "pinned") && (
                        <Link
                            to="/notes/new"
                            className="flex items-center gap-2 border-2 p-2 rounded-lg text-sm shadow-sm hover:shadow-md"
                        >
                            <Plus className="w-4 h-4" />
                            New Note
                        </Link>
                    )}

                {status === "trashed" && notes.length > 0 && (
                    <Button
                        variant="destructive"
                        onClick={() => clearTrash.mutate()}
                    >
                        Clear All Trashed Notes
                    </Button>
                )}
            </div>

            {/* Loading */}
            {isLoading && <NoteSkelton />}

            {/* Empty state */}
            {!isLoading && filteredNotes.length === 0 && (
                <p className="text-center text-muted-foreground mt-10">
                    {query
                        ? "No notes match your search."
                        : "You don’t have any notes yet."}
                </p>
            )}

            {/* Notes */}
            {!isLoading && filteredNotes.length > 0 && (
                <div className="space-y-6 h-full">
                    <NotesGrid noteList={filteredNotes} />
                </div>
            )}
        </div>
    );
}
