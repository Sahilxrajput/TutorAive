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

export function PdfUploadDialog() {
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (selected) setFile(selected)
    }

    const handleUpload = async () => {
        if (!file) return toast("No file selected")

        setUploading(true)
        try {
            const formData = new FormData();
            formData.append("document", file);
            const res = await API.post(`/submissions/upload/690e64987fb9c6c484ce5f4a`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (event) => {
                    if (event.total) {
                        const percent = Math.round((event.loaded * 100) / event.total)
                        setProgress(percent)
                    }
                },
            })

            toast("Upload complete!")
            console.log("res", res)
            setFile(null)
            setOpen(false)
        } catch (err) {
            console.log("err" + err)
            toast("Upload failed,  Try again later.")
        } finally {
            setUploading(false)
            setProgress(0)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >Upload PDF</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload Submission PDF</DialogTitle>
                </DialogHeader>

                <div className="space-y-3 py-2">
                    <Input type="file" accept="application/pdf" onChange={handleFileChange} disabled={uploading} />
                    {uploading && <Progress value={progress} />}
                </div>

                <Button
                    className="w-full mt-3"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                >
                    {uploading ? "Uploading..." : "Upload"}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
