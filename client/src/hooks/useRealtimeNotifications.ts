import { useEffect } from "react";
import { toast } from "sonner";
import type { AssignmentPayload, ILecture } from "@/types/type";
import { formatDateTime } from "@/utils/splitDateTime";
import useSocketContext from "@/hooks/useSocketContext";

export const useRealtimeNotifications = () => {
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;

    const handleLectureUpdate = (payload: ILecture) => {
      console.log("socket received");
      console.log(payload);

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
      toast.info(`New assignment: ${payload.title}`, {
        description: `Due: ${new Date(payload.dueDate).toLocaleString()}`,
        duration: 5000,
      });
    };

    const handleTweetUpdate = (payload: { msg: string }) => {
      toast.success(payload.msg);
    };

    socket.on("lecture:update", handleLectureUpdate);
    socket.on("assignment:update", handleAssignmentUpdate);
    socket.on("tweet:update", handleTweetUpdate);

    return () => {
      socket.off("lecture:update", handleLectureUpdate);
      socket.off("assignment:update", handleAssignmentUpdate);
      socket.off("tweet:update", handleTweetUpdate);
    };
  }, [socket]);
};
