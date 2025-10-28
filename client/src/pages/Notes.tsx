import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Save, Archive, Trash2, Pin } from "lucide-react";

interface NoteProps {
  note?: {
    title: string;
    content: string;
    color?: string;
    status?: "active" | "archived" | "trashed";
  };
  onSave?: (note: any) => void;
  onArchive?: () => void;
  onTrash?: () => void;
  onPin?: () => void;
}

const Note: React.FC<NoteProps> = ({
  note = {
    title: "",
    content: "",
    color: "#ffffff",
    status: "active",
  },
  onSave,
  onArchive,
  onTrash,
  onPin,
}) => {
  const [form, setForm] = useState(note);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <motion.div
      className="flex justify-center items-start min-h-screen bg-muted/30 py-10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        className="w-full max-w-3xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl"
        style={{ backgroundColor: form.color }}
      >
        <CardHeader className="flex flex-col gap-2 border-b pb-4">
          <div className="flex justify-between items-center">
            <CardTitle>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Untitled Note"
                className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 p-0 bg-transparent"
              />
            </CardTitle>

            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={onPin}>
                <Pin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onArchive}>
                <Archive className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onTrash}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <Badge variant="outline" className="capitalize">
              {form.status}
            </Badge>
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              className="w-6 h-6 cursor-pointer border-none bg-transparent"
            />
          </div>
        </CardHeader>

        <CardContent className="mt-4">
          <Textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Start writing your note..."
            className="min-h-[300px] text-base border-none shadow-none focus-visible:ring-0 resize-none bg-transparent"
          />
        </CardContent>

        <CardFooter className="flex justify-end pt-2 border-t mt-4">
          <Button
            onClick={() => onSave?.(form)}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default Note;
