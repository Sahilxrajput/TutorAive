import { useEffect } from "react";
import { toast } from "sonner";
import type { AssignmentPayload, ILecture, ResourcePayload } from "@/types/type";
import { formatDateTime } from "@/utils/splitDateTime";
import useSocketContext from "@/hooks/useSocketContext";

export const useRealtimeNotifications = () => {
    const { socket } = useSocketContext();

    useEffect(() => {
        if (!socket) return;

        const handleLectureUpdate = (payload: ILecture) => {

            switch (payload.status) {
                case "live":
                    toast.success(`Lecture "${payload.title}" is live now`);
                    break;

                case "scheduled":
                    toast.info(
                        `Lecture scheduled at ${formatDateTime(payload.startTime)}`,
                    );
                    break;

                case "rescheduled":
                    toast.info(`"${payload.title}" rescheduled`, {
                        description: `New time: ${formatDateTime(payload.startTime)}`,
                    });
                    break;

                case "delayed":
                    toast.warning(`"${payload.title}" lecture delayed`);
                    break;

                case "cancelled":
                    toast.error(`"${payload.title}" cancelled`, {
                        description: payload?.cancelReason || "No reason provided",
                    });
                    break;

                default:
                    toast("Lecture updated");
            }
        };

        const handleAssignmentUpdate = (payload: AssignmentPayload) => {
            toast.info("New Assignment Available", {
                description: `"${payload.assignmentTitle}" has been published in ${payload.classroomTitle}. Please review the details and submit before the deadline.`,
                duration: 5000,
            });
        };

        const handleResourceUpdate = (payload: ResourcePayload) => {
            toast.info("New Learning Resource Uploaded", {
                description: `"${payload.title}" has been added to ${payload.classroomTitle}. Access the material to stay up to date.`,
                duration: 5000,
            });
        };

        const handleTweetUpdate = (payload: { msg: string }) => {
            toast.success(payload.msg);
        };

        socket.on("lecture:update", handleLectureUpdate);
        socket.on("assignment:update", handleAssignmentUpdate);
        socket.on("resource:update", handleResourceUpdate);
        socket.on("tweet:update", handleTweetUpdate);

        return () => {
            socket.off("lecture:update", handleLectureUpdate);
            socket.off("assignment:update", handleAssignmentUpdate);
            socket.off("resource:update", handleResourceUpdate);
            socket.off("tweet:update", handleTweetUpdate);
        };
    }, [socket]);
};
