import { roomManager } from "../../managers/RoomManager";

interface GetProducersPayload {
  roomId: string;
}

export const handleGetProducers =
  () =>
  async ({ roomId }: GetProducersPayload, cb: Function) => {
    try {
      const room = roomManager.get(roomId);
      if (!room) {
        console.log("[get-producers] room not found:", roomId);
        return cb([]);
      }

      const producers = room.getTeacherProducers();
      console.log("producers ==> ", producers)
      cb(producers);
    } catch (error) {
      console.error("[get-producers] error:", error);
      cb([]);
    }
  };
