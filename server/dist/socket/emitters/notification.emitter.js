"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitLectureNotification = emitLectureNotification;
exports.emitAssignmentNotification = emitAssignmentNotification;
exports.emitTweetNotification = emitTweetNotification;
const __1 = require("..");
function emitLectureNotification(payload) {
    const socket = (0, __1.getIO)();
    console.log("lecture emitter payload", payload);
    if (payload.status === "completed")
        return;
    socket.to(`user:${payload.studentId}`).emit("lecture:update", payload);
}
function emitAssignmentNotification(payload) {
    const socket = (0, __1.getIO)();
    console.log("assignment emitter payload", payload);
    socket.to(`user:${payload.studentId}`).emit("assignment:update", payload);
}
function emitTweetNotification(payload) {
    const io = (0, __1.getIO)();
    console.log("tweet emitter payload", payload);
    io.to(`user:${payload.userId}`).emit("tweet:update", payload);
}
