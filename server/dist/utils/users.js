"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getOnlineUsers = exports.removeUser = exports.addUser = void 0;
const onlineUsers = [];
/** Add a user to the list of online users */
const addUser = (userId, socketId, username) => {
    const exists = onlineUsers.find((u) => u.userId === userId);
    if (!exists) {
        onlineUsers.push({ userId, socketId, username });
    }
};
exports.addUser = addUser;
/** Remove a user when they disconnect */
const removeUser = (socketId) => {
    const index = onlineUsers.findIndex((u) => u.socketId === socketId);
    if (index !== -1)
        onlineUsers.splice(index, 1);
};
exports.removeUser = removeUser;
/** Get list of all online users */
const getOnlineUsers = () => onlineUsers;
exports.getOnlineUsers = getOnlineUsers;
/** Find a user by their ID */
const getUserById = (userId) => onlineUsers.find((u) => u.userId === userId);
exports.getUserById = getUserById;
