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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import API from "@/lib/api";

function combineDateWithTime(date: Date, time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    const result = new Date(date);
    result.setHours(hours || 0, minutes || 0, 0, 0);
    return result;
}

interface DateTimePickerProps {
    id?: string
    showPopup: boolean;
    action?: "edit" | "create";
    setShowPopup: Dispatch<SetStateAction<boolean>>;
}

export function DateTimePicker({ showPopup, setShowPopup, action = "create", id }: DateTimePickerProps) {
    const { id: classroomId } = useParams();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState<Date>();
    const [time, setTime] = useState("09:00");
    const [loading, setLoading] = useState(false);
    // const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
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
                toast.success(data.message);
                setTimeout(() => setShowPopup(false), 700);
            } else {
                toast.error(data.message);
            }
        } catch {
            setError("Failed to schedule class. Try again.");
        } finally {
            setLoading(false);
            setTitle("");
            setDate(undefined);
            setTime("09:00");
        }
    };

    const handlerEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!id) return setError("Lecture ID missing.");

        // Build update object based on what user actually changed
        const updateBody: any = {};

        if (title.trim()) updateBody.title = title;

        let combined: Date | undefined;

        // User changed date or time
        if (date || time) {
            if (!date) return setError("Pick a date to update schedule.");
            if (!time) return setError("Pick a time to update schedule.");

            combined = combineDateWithTime(date, time);

            if (combined.getTime() < Date.now()) {
                return setError("Scheduled time must be in the future.");
            }

            updateBody.startTime = combined;
        }

        // Nothing changed
        if (Object.keys(updateBody).length === 0) {
            return setError("Please update at least one field.");
        }

        setLoading(true);
        try {
            const { data } = await API.put(`/lectures/${id}`, updateBody);

            console.log(data)
            if (data.success) {
                toast.success(data.message);
                setTimeout(() => setShowPopup(false), 700);
            } else {
                toast.error(data.message);
            }
        } catch (e: any) {
            setError("Failed to update class. Try again.");
            console.log("error : ", e)
        } finally {
            setLoading(false);
            setTitle("");
            setDate(undefined);
            setTime("09:00");
        }
    };

    const actionDecider = (e: React.FormEvent) => {
        if (action === "create") {
            handleSubmit(e)
        } else {
            handlerEdit(e)
        }
    }

    return (
        <Dialog open={showPopup} onOpenChange={setShowPopup}>
            <DialogContent className="sm:max-w-[400px]">
                <CardHeader>
                    <CardTitle>Schedule a Class</CardTitle>
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
                        <div className="flex items-center gap-2">
                            <Button type="submit" disabled={loading}>
                                {loading ? (action === "edit" ? "Updating..." : "Scheduling...")
                                    : (action === "edit" ? "Update class" : "Schedule class")}
                            </Button>

                            {/* {scheduledAt && (
                                <p className="ml-auto text-xs text-muted-foreground">
                                    Scheduled for {scheduledAt.toLocaleString()} (
                                    {Intl.DateTimeFormat().resolvedOptions().timeZone})
                                </p>
                            )} */}
                        </div>
                    </form>
                </CardContent>
            </DialogContent>
        </Dialog>
    );
}

