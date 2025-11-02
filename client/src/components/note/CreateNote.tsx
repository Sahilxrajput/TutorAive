// src/components/Editor.tsx
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    return (
        <div className="flex flex-wrap gap-2 mb-3">
            <Button
                variant={editor.isActive("bold") ? "default" : "outline"}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                Bold
            </Button>
            <Button
                variant={editor.isActive("italic") ? "default" : "outline"}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                Italic
            </Button>
            <Button
                variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"}
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
            >
                H2
            </Button>
            <Button
                variant={editor.isActive("bulletList") ? "default" : "outline"}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                List
            </Button>
            <Button
                variant="outline"
                onClick={() => editor.chain().focus().undo().run()}
            >
                Undo
            </Button>
            <Button
                variant="outline"
                onClick={() => editor.chain().focus().redo().run()}
            >
                Redo
            </Button>
        </div>
    );
};

export default function CreateNotePage({ content, onChange }: { content?: string; onChange?: (html: string) => void }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Heading.configure({ levels: [1, 2, 3] }),
            Link,
            Image,
            Placeholder.configure({
                placeholder: "Start writing your note...",
            }),
        ],
        content: content || "",
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
    });

    return (
        <div className="border rounded-lg p-4 shadow-sm bg-white">
            <MenuBar editor={editor} />
            <EditorContent
                editor={editor}
                className="prose prose-gray max-w-none min-h-[400px] focus:outline-none"
            />
        </div>
    );
};

