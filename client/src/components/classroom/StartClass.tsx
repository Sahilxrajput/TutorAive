import React, { useState, type Dispatch, type SetStateAction } from "react";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Calendar as CalendarIcon } from "lucide-react";

import { CardContent, CardHeader } from "@/components/ui/card";
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

function combineDateWithTime(date: Date, time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    const result = new Date(date);
    result.setHours(hours || 0, minutes || 0, 0, 0);
    return result;
}

interface DateTimePickerProps {
    showPopup: boolean;
    setShowPopup: Dispatch<SetStateAction<boolean>>;
}

export function StartClass({ showPopup, setShowPopup }: DateTimePickerProps) {
    const { classroomId } = useParams();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);



    const handleSchedule = async (e: React.FormEvent) => {
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
            const { data } = await API.post(`/classrooms/${classroomId}/lectures`, {
                title,
                status: "scheduled",
                startTime: combined,
                classroomId,
            });

            console.log("data:", data)


            if (data.success) {
                toast.success(data.message);
                setShowPopup(false)
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
            const { data } = await API.post(`/classrooms/${classroomId}/lectures`, {
                title,
                status: "live",
                startTime: new Date(),
                classroomId,
            });
            console.log("data : ", data)

            if (data.success) {
                toast.success(data.message);
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


    return (
        <Dialog open={showPopup} onOpenChange={setShowPopup}>
            <DialogContent className="sm:max-w-[400px]">
                <CardHeader>
                    <DialogTitle>
                        Select Class Type
                    </DialogTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSchedule} className="space-y-4">
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
                                            onSelect={(date) => {
                                                setDate(date)
                                            }}
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
                                    defaultValue="10:30:00"
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
                                {loading ? "Scheduling..."
                                    : "Schedule class"}
                            </Button>

                            <Button
                                type="button"
                                onClick={handleStartNow}
                                disabled={loading}>
                                {loading ? "Starting..."
                                    : "Start class"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </DialogContent>
        </Dialog>
    );
}

