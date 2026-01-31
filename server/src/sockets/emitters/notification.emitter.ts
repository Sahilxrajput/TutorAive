import { Socket } from "socket.io";
import { getIO } from "..";
import {
  AssignmentPayload,
  ITweetPayload,
  ILecture,
} from "../../types/type";

export function emitLectureNotification({
  payload,
  userId,
}: {
  payload: ILecture;
  userId: string;
}) {
  const socket = getIO();
  console.log("UI payload", userId);
  if (payload.status === "completed") return;

  socket.to(`user:${userId}`).emit("lecture:update", payload);
}

export function emitAssignmentNotification(payload: AssignmentPayload) {
  const socket = getIO();
  console.log("assignment emitter payload", payload);
  socket.to(`user:${payload.studentId}`).emit("assignment:update", payload);
}

export function emitTweetNotification(payload: ITweetPayload) {
  const io = getIO();
  console.log("tweet emitter payload", payload);
  io.to(`user:${payload.userId}`).emit("tweet:update", payload);
}
