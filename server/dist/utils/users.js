"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAllUsers = exports.getUsersInRoom = exports.getUserById = exports.getOnlineUsers = exports.removeUser = exports.addUser = void 0;
// Using a Map to ensure uniqueness by userId
const onlineUsers = new Map();
/** Add or update a user */
const addUser = (user) => {
    onlineUsers.set(user.userId, user);
    return user;
};
exports.addUser = addUser;
/** Remove a user by socketId */
const removeUser = (socketId) => {
    for (const [userId, u] of onlineUsers.entries()) {
        if (u.socketId === socketId) {
            onlineUsers.delete(userId);
            break;
        }
    }
};
exports.removeUser = removeUser;
/** Get all online users as an array */
const getOnlineUsers = () => Array.from(onlineUsers.values());
exports.getOnlineUsers = getOnlineUsers;
/** Find a user by their ID */
const getUserById = (userId) => onlineUsers.get(userId);
exports.getUserById = getUserById;
// Get all users in a specific room
const getUsersInRoom = (roomId) => Array.from(onlineUsers.values()).filter((u) => u.roomId === roomId);
exports.getUsersInRoom = getUsersInRoom;
/** Clear all users */
const removeAllUsers = () => {
    onlineUsers.clear();
};
exports.removeAllUsers = removeAllUsers;
