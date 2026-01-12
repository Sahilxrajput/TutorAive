import { getIO } from "..";
import {
  AssignmentPayload,
  LectureUpdatePayload,
  ITweetPayload,
} from "../../types/type";

export function emitLectureNotification(payload: LectureUpdatePayload) {
  const socket = getIO();
  console.log("lecture emitter payload", payload);
  if (payload.status === "completed") return;

  socket.to(`user:${payload.studentId}`).emit("lecture:update", payload);
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
