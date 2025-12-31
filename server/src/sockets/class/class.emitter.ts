import { getIO } from "..";
import {
  AssignmentPayload,
  ClassUpdatePayload,
  LectureStatus,
} from "../../types/type";

export function emitClassUpdate(payload: ClassUpdatePayload) {
  const socket = getIO();

  if (payload.status === "completed") return;

  socket.to(payload.classroomId).emit("lecture:update", payload);
}

export function emitAssignmentUpdate(payload: AssignmentPayload) {
  const socket = getIO();
  console.log("assignment emitter payload", payload);
  socket.to(payload.classroomId).emit("assignment:update", payload);
}
