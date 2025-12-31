import { Namespace } from "socket.io";

export let classroomSocket: Namespace;

export function setClassroomSocket(ns: Namespace) {
  classroomSocket = ns;
}
