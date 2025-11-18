import { useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectContent,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import API from "@/lib/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Spinner } from "../ui/spinner";
import type { ITweet } from "@/types/auth";
import TweetCard from "./TweetCard";

interface Props {
    parentTweet?: ITweet;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function TweetCreateDialog({
    isOpen,
    setIsOpen,
    parentTweet,
}: Props) {
    const [content, setContent] = useState<string>("");
    const [type, setType] = useState("general");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setImage(file);
    };

    const submit = async () => {
        if (!parentTweet && !content.trim()) {
            toast.info("content are required");
            return;
        }

        setLoading(true);
        const form = new FormData();
        form.append("content", content.trim());
        form.append("type", type);

        if (!parentTweet && image) {
            form.append("image", image);
        }

        try {

            if (parentTweet) {
                await toast.promise(
                    API.post(`/tweets/${parentTweet?._id}/repost`, { content, type }),
                    {
                        loading: 'Reposting...',
                        success: "Tweet reposted successfully",
                        error: "Something went wrong"
                    }
                )
            } else {
                const { data } = await API.post("/tweets", form);
                toast.success(data.message);
            }

            setContent("");
            setType("general");
            setImage(null);
            setPreview(null);

            setIsOpen(false);
        } catch (err) {
            toast.error("Something went wrong");
            console.error("Failed to create tweet:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-lg max-h-[80vh] p-0 flex flex-col">
                {/* HEADER */}
                <DialogHeader className="p-4 pb-2">
                    <DialogTitle>{parentTweet ? "Repost" : "Create Post"}</DialogTitle>
                </DialogHeader>

                {/* SCROLLABLE BODY */}
                <div className="px-4 flex-1 overflow-y-auto space-y-4 pb-4">

                    <div className="flex flex-col space-y-2 relative">
                        <Label>Content</Label>
                        <Textarea
                            maxLength={500}
                            placeholder="Share something with the community..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <p className="text-xs text-red-600 absolute right-2 bottom-2">
                            {500 - content.length}/500
                        </p>
                    </div>

                    {parentTweet && (
                        <TweetCard  isCreating={true} tweet={parentTweet} />
                    )}

                    <div className="flex flex-col space-y-2">
                        <Label>Type</Label>
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

                    {!parentTweet && (
                        <div className="flex flex-col space-y-2">
                            <Label>Image</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                    )}

                    {preview && (
                        <img
                            className="mx-auto w-48 h-auto mt-2 rounded-md"
                            src={preview}
                            alt="preview"
                        />
                    )}
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t">
                    <Button className="w-full" disabled={loading} onClick={submit}>
                        {loading ? <Spinner /> : "Post"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
