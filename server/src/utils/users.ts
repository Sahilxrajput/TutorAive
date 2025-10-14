interface OnlineUser {
  userId: string;
  username?: string;
  socketId: string;
}

const onlineUsers: OnlineUser[] = [];

/** Add a user to the list of online users */
export const addUser = (userId: string, socketId: string, username?: string) => {
  const exists = onlineUsers.find((u) => u.userId === userId);
  if (!exists) {
    onlineUsers.push({ userId, socketId, username });
  }
};

/** Remove a user when they disconnect */
export const removeUser = (socketId: string) => {
  const index = onlineUsers.findIndex((u) => u.socketId === socketId);
  if (index !== -1) onlineUsers.splice(index, 1);
};

/** Get list of all online users */
export const getOnlineUsers = () => onlineUsers;

/** Find a user by their ID */
export const getUserById = (userId: string) =>
  onlineUsers.find((u) => u.userId === userId);
