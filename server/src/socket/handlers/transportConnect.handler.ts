import { roomManager } from "../../managers/RoomManager";
interface TransportConnectPayload {
  transportId: string;
  dtlsParameters: any;
  roomId: string;
}

export const handleTransportConnect =
  () =>
  async (
    { transportId, dtlsParameters, roomId }: TransportConnectPayload,
    cb: Function
  ) => {
    try {
      console.log(
        "request on server to connect-transport DTLS PARAMS : ",
        dtlsParameters
      );
      console.log(
        "request on server to connect-transport transportId : ",
        transportId
      );
      const room = roomManager.get(roomId);
      if (!room) return cb({ error: "room not found" });
      // const producer = room.getProducer();

      const transport = room.getTransportById(transportId);
      if (!transport) return cb({ error: "transport not found" });

      await transport.connect({ dtlsParameters });

      console.log(`transport connected successfully`);
      cb({ connect: true });
      //   cb({ producer: producer }); //@note can be removed
    } catch (error) {
      console.log(error);
      cb({ error: error });
    }
  };
