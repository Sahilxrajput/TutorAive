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

  const detectPath = (id: string): string => {
    switch (type) {
      case "assignment":
        return `/assignments/upload/${id}`
      case "submission":
        return `/submissions/upload/${id}`
      default:
        return ""
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.warning("No file selected")
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      
      if (type === "assignment") {
        formData.append("assignmentFile", file)
        formData.append("title", inputTitle)
        formData.append("description", description)
        formData.append("dueDate", dueDate)
        formData.append("maxPoints", maxPoints)
      }else{
        formData.append("submissionFile", file)
      }

      await API.post(detectPath(id), formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total)
            setProgress(percent)
          }
        },
      })

      toast.success("Upload complete!")
      onComplete?.(id)
      setInputTitle("")
      setDescription("")
      setDueDate("")
      setMaxPoints("")
      setFile(null)
      setOpen(false)
    } catch (err) {
      console.log("Error:", err)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

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
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
