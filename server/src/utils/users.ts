export interface ISocketUser {
  userId: string;
  username?: string;
  socketId: string;
  roomId?: string;
}

// Using a Map to ensure uniqueness by userId
const onlineUsers = new Map<string, ISocketUser>();

/** Add or update a user */
export const addUser = (user: ISocketUser): ISocketUser => {
  onlineUsers.set(user.userId, user);
  return user;
};

/** Remove a user by socketId */
export const removeUser = (socketId: string): void => {
  for (const [userId, u] of onlineUsers.entries()) {
    if (u.socketId === socketId) {
      onlineUsers.delete(userId);
      break;
    }
  }
};

/** Get all online users as an array */
export const getOnlineUsers = (): ISocketUser[] =>
  Array.from(onlineUsers.values());

/** Find a user by their ID */
export const getUserById = (userId: string): ISocketUser | undefined =>
  onlineUsers.get(userId);

// Get all users in a specific room
export const getUsersInRoom = (roomId: string): ISocketUser[] =>
  Array.from(onlineUsers.values()).filter((u) => u.roomId === roomId);

/** Clear all users */
export const removeAllUsers = (): void => {
  onlineUsers.clear();
};
