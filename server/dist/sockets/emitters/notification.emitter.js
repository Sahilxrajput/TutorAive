"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitLectureNotification = emitLectureNotification;
exports.emitAssignmentNotification = emitAssignmentNotification;
exports.emitResourceNotification = emitResourceNotification;
exports.emitTweetNotification = emitTweetNotification;
const __1 = require("..");
function emitLectureNotification({ payload, userId, }) {
    const socket = (0, __1.getIO)();
    console.log("UI payload", userId);
    if (payload.status === "completed")
        return;
    socket.to(`user:${userId}`).emit("lecture:update", payload);
}
function emitAssignmentNotification(payload) {
    const socket = (0, __1.getIO)();
    socket.to(`user:${payload.studentId}`).emit("assignment:update", payload);
}
function emitResourceNotification(payload) {
    const socket = (0, __1.getIO)();
    console.log("resource payload in emitter: ", payload);
    socket.to(`user:${payload.studentId}`).emit("resource:update", payload);
}
function emitTweetNotification(payload) {
    const io = (0, __1.getIO)();
    console.log("tweet emitter payload", payload);
    io.to(`user:${payload.userId}`).emit("tweet:update", payload);
}
