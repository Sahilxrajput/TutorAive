import { useState } from "react"
import { Clock, Calendar, XCircle, Play, Type, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import API from "@/lib/api"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import type { ILecture } from "@/types/type"

export function LectureDropdownMenu({ lecture , cn}: { lecture: ILecture, cn:string }) {
    const classroomId = lecture.classroom._id ?? lecture.classroom
    const [dialogType, setDialogType] = useState<"delay" | "reschedule" | "cancel" | "title" | null>(null)
    const [title, setTitle] = useState("")
    const [reason, setReason] = useState("")
    const [timeValue, setTimeValue] = useState("")
    const navigate = useNavigate();

    const closeDialog = () => {
        setDialogType(null)
        setReason("")
        setTimeValue("")
        setTitle("")
    }

    const submitDelay = async () => {
        if (!timeValue || Number(timeValue) <= 0) {
            return toast.warning("Enter valid delay time in minutes");
        }
        if (!reason.trim()) {
            return toast.warning("Delay reason is required");
        }

        await API.put(`/classrooms/${classroomId}/lectures/${lecture._id}`, {
            status: "delayed",
            delayTime: Number(timeValue),
            reason,
        });

    };

    const submitReschedule = async () => {
        if (!timeValue) {
            return toast.warning("New date & time is required");
        }
        if (!reason.trim()) {
            return toast.warning("Reschedule reason is required");
        }

        const date = new Date(timeValue);
        if (date.getTime() <= Date.now()) {
            return toast.warning("New time must be in the future");
        }

        await API.put(`/classrooms/${classroomId}/lectures/${lecture._id}`, {
            status: "rescheduled",
            newStartTime: date.toISOString(),
            reason,
        });

    };

    const submitCancel = async () => {
        if (!reason.trim()) {
            return toast.warning("Cancel reason is required");
        }

        const { data } = await API.put(`/classrooms/${classroomId}/lectures/${lecture._id}`, {
            status: "cancelled",
            reason,
        });

    };

    const handleSubmit = async () => {
        try {
            if (dialogType === "delay") {
                await submitDelay();
            }

            if (dialogType === "reschedule") {
                await submitReschedule();
            }

            if (dialogType === "cancel") {
                await submitCancel();
            }

            if (dialogType === "title") {
                await submitTitleChange();
            }

            closeDialog();
        } catch (err: any) {
            console.error(err);
            toast.warning(err?.response?.data?.message || "Something went wrong");
        }
    };

    const submitTitleChange = async () => {
        if (!title.trim()) {
            return alert("Title cannot be empty");
        }

        await API.put(`/classrooms/${classroomId}/lectures/${lecture._id}`, {
            title: title.trim(),
        });

    };

    const goLive = () => {
        navigate(`classrooms/${classroomId}/lecture/live/${lecture._id}`)
    }


    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className={cn} aria-label="Open menu" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                    <DropdownMenuLabel>Class Actions</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="text-green-600"
                            onSelect={goLive}
                        >
                            <Play className="mr-2 h-4 w-4" /> Start Lecture
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setDialogType("delay")}>
                            <Clock className="mr-2 h-4 w-4" /> Delay Class
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setDialogType("reschedule")}>
                            <Calendar className="mr-2 h-4 w-4" /> Reschedule
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setDialogType("title")}>
                            <Type className="mr-2 h-4 w-4" /> Change Title
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={() => setDialogType("cancel")} className="text-destructive">
                            <XCircle className="mr-2 h-4 w-4" /> Cancel Class
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Combined Dialog Logic */}
            <Dialog open={dialogType !== null} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="capitalize">
                            {dialogType} Class
                        </DialogTitle>
                        <DialogDescription>
                            {dialogType === "cancel"
                                ? "Please provide a reason for cancelling this session."
                                : dialogType === "title"
                                    ? "Update the lecture title."
                                    : "Update the timing and notify your students."}
                        </DialogDescription>

                    </DialogHeader>

                    <FieldGroup className="py-2 space-y-4">

                        {(dialogType === "delay" || dialogType === "reschedule") && (
                            <Field>
                                <FieldLabel>
                                    {dialogType === "delay" ? "Delay Duration (minutes)" : "New Date & Time"}
                                </FieldLabel>
                                <Input
                                    type={dialogType === "delay" ? "number" : "datetime-local"}
                                    placeholder={dialogType === "delay" ? "e.g. 15" : ""}
                                    value={timeValue}
                                    onChange={(e) => setTimeValue(e.target.value)}
                                />
                            </Field>
                        )}

                        {dialogType === "title" && (
                            <Field>
                                <FieldLabel>New Lecture Title</FieldLabel>
                                <Input
                                    placeholder="Enter new lecture title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Field>
                        )}

                        {dialogType !== "title" && <Field>
                            <FieldLabel>Reason for {dialogType}</FieldLabel>
                            <Textarea
                                placeholder="Brief explanation for students..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </Field>}
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Back</Button>
                        </DialogClose>
                        <Button
                            variant={dialogType === "cancel" ? "destructive" : "default"}
                            onClick={handleSubmit}
                        >
                            Confirm {dialogType}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}