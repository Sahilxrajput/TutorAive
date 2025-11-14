import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectContent,
    SelectValue
} from "@/components/ui/select";
import { Label } from "../ui/label";
import API from "@/lib/api";
import { toast } from "sonner";



export default function TweetCreate() {
    const [content, setContent] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [type, setType] = useState("general");
    const [classroom, setClassroom] = useState<string>("");

    const submit = async () => {
        if (!title.trim() || !content.trim()) {
            toast.info("Title and content are required");
            return;
        }

        const payload = {
            title: title.trim(),
            content: content.trim(),
            type,
        };

        // Only include classroom if non-empty
        if (classroom && classroom.trim() !== "") {
            payload.classroom = classroom.trim();
        }

        try {
            const { data } = await API.post("/tweets", payload);
            console.log("Tweet created:", data);
            toast.success(data.message);

            // Reset only after successful creation
            setTitle("");
            setContent("");
            setClassroom("");
            setType("general");

            // Reload tweets if needed
            // loadTweets();

        } catch (err) {
            console.error("Failed to create tweet:", err);
        }
    }


    return (
        <Card className="mb-5 shadow-sm">
            <CardContent className="space-y-6 py-5">

                {/* Title */}
                <div className="flex flex-col items-start justify-center space-y-2">
                    <Label htmlFor="Input">Title</Label>
                    <Input
                        maxLength={30}
                        placeholder="Enter a title..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col items-start justify-center space-y-2 relative">
                    <Label htmlFor="Textarea">Content</Label>
                    <Textarea
                        maxLength={500}
                        placeholder="Share something with the community..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                    <p className="font-semibold absolute right-2 bottom-2 text-xs text-red-600">{500-content.length}/500</p>
                </div>

                {/* Type */}
                <div className="flex flex-col items-start justify-center space-y-2">
                    <Label htmlFor="Select">Type</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="mentorship">Mentorship</SelectItem>
                            <SelectItem value="problem">Problem Reference</SelectItem>
                            <SelectItem value="news">News</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Classroom Link */}
                <div className="flex flex-col items-start justify-center space-y-2">
                    <Label htmlFor="Classroom">Classroom</Label>
                    <Input
                        placeholder="Classroom ID (optional)"
                        value={classroom}
                        onChange={e => setClassroom(e.target.value)}
                    />
                </div>

                {/* Submit */}
                <Button className="w-full" onClick={submit}>
                    Post
                </Button>
            </CardContent>
        </Card>
    );
}

