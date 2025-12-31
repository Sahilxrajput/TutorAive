import React, { useState, type Dispatch, type SetStateAction } from "react";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Calendar as CalendarIcon } from "lucide-react";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import API from "@/lib/api";
import useSocketContext from "@/hooks/useSocketContext";

function combineDateWithTime(date: Date, time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    const result = new Date(date);
    result.setHours(hours || 0, minutes || 0, 0, 0);
    return result;
}

interface DateTimePickerProps {
    id?: string
    showPopup: boolean;
    action?: "update" | "create";
    setShowPopup: Dispatch<SetStateAction<boolean>>;
}

export function StartClass({ showPopup, setShowPopup, action = "create", id }: DateTimePickerProps) {
    const { classroomId } = useParams();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState<Date>(new Date());
    const [time, setTime] = useState("");
    const [loading, setLoading] = useState(false);
    // const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { socket } = useSocketContext();

    //live, schedule, reschedule, delay, cancle, title update

    //@todo handler reschedule
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) return setError("Please add a class title.");
        if (!date) return setError("Please pick a date.");
        if (!time) return setError("Please pick a time.");

        const combined = combineDateWithTime(date, time);


        if (combined.getTime() < Date.now()) {
            return setError("Scheduled time must be in the future.");
        }

        setLoading(true);
        try {
            const { data } = await API.post("/lectures", {
                title,
                status: "scheduled",
                startTime: combined,
                classroomId,
            });

            console.log("data:", data)



            if (data.success) {
                // toast.success(data.message);
                setTimeout(() => setShowPopup(false), 700);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error)
            setError("Failed to schedule class. Try again.");
        } finally {
            setLoading(false);
            setTitle("");
            setDate(new Date());
            setTime("00:00");
        }
    };

    const handleStartNow = async () => {
        setError(null);

        if (!title.trim()) return setError("Please add a class title.");

        setLoading(true);
        try {
            const { data } = await API.post("/lectures", {
                title,
                status: "live",
                startTime: new Date(),
                classroomId,
            });
            console.log("data : ", data)

            if (data.success) {
                // toast.success(data.message);
                setShowPopup(false);
            } else {
                toast.error(data.message);
            }
        } catch {
            setError("Failed to start class.");
        } finally {
            setLoading(false);
            setTitle("");
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!id) return setError("Lecture ID missing.");

        const updateBody: {
            newStartTime?: Date,
            status?: | "live"
            | "scheduled"
            | "rescheduled"
            | "delayed"
            | "cancelled",
            title?: string
        } = {};

        // Title update (independent)
        if (title.trim()) {
            updateBody.title = title.trim();
        }

        const hasDate = Boolean(date);
        const hasTime = Boolean(time.trim());

        // Date/time logic
        if (hasDate || hasTime) {
            // Partial datetime is not allowed
            if (!hasDate || !hasTime) {
                return setError("Please provide both date and time to reschedule.");
            }

            const combined = combineDateWithTime(date!, time!);

            if (combined.getTime() < Date.now()) {
                return setError("Scheduled time must be in the future.");
            }

            updateBody.newStartTime = combined;
            updateBody.status = "rescheduled";
        }

        //  Nothing changed
        if (Object.keys(updateBody).length === 0) {
            return setError("Please update at least one field.");
        }

        setLoading(true);
        try {
            const { data } = await API.put(`/lectures/${id}`, updateBody);

            if (data.success) {
                setShowPopup(false);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to update class. Try again.");
        } finally {
            setLoading(false);
            setTitle("");
            setDate(undefined);
            setTime("");
        }
    };


    const actionDecider = (e: React.FormEvent) => {
        if (action === "create") {
            handleCreate(e)
        } else {
            handleUpdate(e)
        }
    }

    return (
        <Dialog open={showPopup} onOpenChange={setShowPopup}>
            <DialogContent className="sm:max-w-[400px]">
                <CardHeader>
                    <DialogTitle>
                        Select Class Type
                    </DialogTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={actionDecider} className="space-y-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Class title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Linear Algebra: Lecture 3"
                            />
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-1 gap-4">
                            {/* Date Picker */}
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className={cn(
                                                "justify-start text-left font-normal w-full",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            disabled={(d) => d < new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Time Picker */}
                            <div className="space-y-2">
                                <Label htmlFor="time-picker">Time</Label>
                                <Input
                                    id="time-picker"
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    step="60"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && <p className="text-sm text-red-600">{error}</p>}

                        {/* Submit */}
                        <div className="flex items-center justify-between ">
                            <Button
                                type="submit"
                                variant="outline"
                                disabled={loading}>
                                {loading ? (action === "update" ? "Updating..." : "Scheduling...")
                                    : (action === "update" ? "Update class" : "Schedule class")}
                            </Button>

                            {action === "create" && <Button
                                type="button"
                                onClick={handleStartNow}
                                disabled={loading}>
                                {loading ? (action === "create" && "Starting...")
                                    : (action === "create" && "Start class")}
                            </Button>}
                        </div>
                    </form>
                </CardContent>
            </DialogContent>
        </Dialog>
    );
}

