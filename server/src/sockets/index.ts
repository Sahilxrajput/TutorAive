import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { socketAuthMiddleware } from "../Middlewares/socketAuth";
import Peer from "../classes/peer";
import Room from "../classes/room";


export const roomMap: Record<string, Room> = {};
const peerMap: Record<string, Peer> = {};
// export const roomIdUserIdMap: Record<string, Set<Socket>> = {};

export const initSocket = async(httpServer:HttpServer) => {
    const io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL,
        credentials: false, //@remind
      },
    }); 

    io.use(socketAuthMiddleware);

const classroom = io.of("/classroom");

    classroom.on('connction',(socket:Socket)=>{
        console.log("Somthing connected!", socket.id);

          socket.on("join-room", (data) => {
            // mediasoup logic here
          });
    })
}