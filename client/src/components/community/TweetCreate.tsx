import { useState, type Dispatch, type SetStateAction } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import  { Spinner } from "../ui/spinner";

interface Props {
    isCreating: boolean
    setIsCreating: Dispatch<SetStateAction<boolean>>;
}

export default function TweetCreate({ isCreating, setIsCreating }: Props) {
    const [content, setContent] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [type, setType] = useState("general");
    const [classroom, setClassroom] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false)

    const submit = async () => {
        if (!title.trim() || !content.trim()) {
            toast.info("Title and content are required");
            return;
        }
        setLoading(true)
        const form = new FormData();
        form.append("title", title.trim());
        form.append("content", content.trim());
        form.append("type", type);

        if (classroom.trim()) form.append("classroom", classroom.trim());
        if (image) form.append("image", image);

        try {
            // @remind i can call fetchTweets
            const { data } = await API.post("/tweets", form)

            toast.success(data.message)
            // Reset only after successful creation
            setTitle("");
            setContent("");
            setType("general");
            setClassroom("");
            setImage(null);
            setIsCreating(false);
            setLoading(true);
            // @remind doesn't update tweets -> it successfully fetch but not update state
        } catch (err) {
            console.error("Failed to create tweet:", err);
        }
    }

    return (
        <Dialog open={isCreating} onOpenChange={setIsCreating} >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create Post</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-start justify-center space-y-2">
                    <Label htmlFor="Input">Title</Label>
                    <Input
                        maxLength={30}
                        placeholder="Enter a title..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>

                <div className="flex flex-col items-start justify-center space-y-2 relative">
                    <Label htmlFor="Textarea">Content</Label>
                    <Textarea
                        maxLength={500}
                        placeholder="Share something with the community..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                    <p className="font-semibold absolute right-2 bottom-2 text-xs text-red-600">{500 - content.length}/500</p>
                </div>

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

                <div className="flex flex-col items-start justify-center space-y-2">
                    <Label htmlFor="Classroom">Classroom</Label>
                    <Input
                        placeholder="Classroom ID (optional)"
                        value={classroom}
                        onChange={e => setClassroom(e.target.value)}
                    />
                </div>
                <div className="flex flex-col items-start justify-center space-y-2">
                    <Label htmlFor="image">Image</Label>
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) setImage(file);
                        }}
                    />
                </div>


                <Button className="w-full"
                    disabled={loading}
                    onClick={submit}
                >
                    {loading ? <Spinner/> : "Post"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}


