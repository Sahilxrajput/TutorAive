import { Socket } from "socket.io";
import { getIO } from "..";
import {
  AssignmentPayload,
  ITweetPayload,
  ILecture,
  IResourceJob,
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
  socket.to(`user:${payload.studentId}`).emit("assignment:update", payload);
}

export function emitResourceNotification(payload: IResourceJob) {
  const socket = getIO();
  console.log("resource payload in emitter: ", payload);
  socket.to(`user:${payload.studentId}`).emit("resource:update", payload);
}

export function emitTweetNotification(payload: ITweetPayload) {
  const io = getIO();
  console.log("tweet emitter payload", payload);
  io.to(`user:${payload.userId}`).emit("tweet:update", payload);
}
