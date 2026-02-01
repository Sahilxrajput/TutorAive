import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import API from "@/lib/api"
import axios from "axios"

interface Props {
    buttonText: string
    type: "assignment" | "resource" | "note" | "submission"
    id: string
    title: string
    cn?: string
    onComplete?: (id: string) => void
}

export function PdfUploadDialog({ buttonText, title, cn, id, type, onComplete }: Props) {
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [description, setDescription] = useState("")
    const [inputTitle, setInputTitle] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [maxPoints, setMaxPoints] = useState("")
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (selected) setFile(selected)
    }

    const resetForm = () => {
        setFile(null);
        setInputTitle("");
        setDescription("");
        setDueDate("");
        setMaxPoints("");
        setOpen(false);
        setUploading(false);
    };

    const assignmentUpload = async () => {
        if (!file) {
            toast.warning("No file selected");
            return;
        }

        let cloudData;

        // 1. get signature + upload
        try {
            setUploading(true)


            const signatureUrl =
                type === "assignment"
                    ? `/assignments/${id}/cloudinary/signature`
                    : `/submissions/assignments/${id}/cloudinary/signature`;

            const { data } = await API.post(signatureUrl);


            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", data.apiKey);
            formData.append("timestamp", data.timestamp);
            formData.append("signature", data.signature);
            formData.append("folder", data.folder);

            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${data.cloudName}/raw/upload`,
                formData,
                {
                    onUploadProgress: (e) => {
                        if (!e.total) return;
                        setProgress(Math.round((e.loaded * 100) / e.total));
                    },
                }
            );

            cloudData = res.data;

        } catch (error) {
            toast.error("Upload failed");
            console.error("cloudinary/server error:", error);
            resetForm();
            return; // STOP HERE
        }

        // 2. save in db (only if upload succeeded)
        try {
            const saveUrl =
                type === "assignment"
                    ? `/assignments/${id}/save`
                    : `/submissions/assignments/${id}/save`;

            const payload =
                type === "assignment"
                    ? {
                        pdfUrl: cloudData.secure_url,
                        public_id: cloudData.public_id,
                        resource_type: cloudData.resource_type,
                        title: inputTitle,
                        description,
                        dueDate: new Date(dueDate),
                        maxPoints: Number(maxPoints),
                    }
                    : {
                        pdfUrl: cloudData.secure_url,
                        public_id: cloudData.public_id,
                        resource_type: cloudData.resource_type,
                    };

            await API.post(saveUrl, payload);



            toast.success(
                type === "assignment"
                    ? "Assignment uploaded successfully"
                    : "Assignment submitted successfully"
            );


            // after successfully upload and save into db
            onComplete?.(id)
        } catch {
            toast.error("Database error");
        } finally {
            setUploading(false)
            setProgress(0)
            resetForm();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className={`px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition ${cn}`}
                >
                    {buttonText}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-3 py-2">
                    {type === "assignment" && (
                        <div className="space-y-3 py-2">
                            <Input
                                type="text"
                                value={inputTitle}
                                onChange={(e) => setInputTitle(e.target.value)}
                                placeholder="Enter Title"
                            />

                            <Input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter Description"
                            />

                            <Input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />

                            <Input
                                type="text"
                                value={maxPoints}
                                onChange={(e) => setMaxPoints(e.target.value)}
                                placeholder="Max Points (optional)"
                            />
                        </div>
                    )}

                    <Input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />

                    {uploading && <Progress value={progress} />}
                </div>

                <Button
                    className="w-full mt-3"
                    onClick={assignmentUpload}
                    disabled={!file || uploading}
                >
                    {uploading ? "Uploading..." : "Upload"}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
